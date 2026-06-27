package com.marius.worldcup.common.config;

import com.marius.worldcup.users.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.GenericFilter;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  JwtFilter jwtFilter(JwtService jwt, UserRepository users) {
    return new JwtFilter(jwt, users);
  }

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http, JwtFilter jwt, SecurityHeadersFilter headers)
      throws Exception {
    return http.csrf(csrf -> csrf.disable())
        .cors(cors -> {})
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers("/", "/api/health", "/api/auth/**", "/actuator/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/matches/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .addFilterBefore(headers, UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class)
        .build();
  }

  @Bean
  SecurityHeadersFilter securityHeadersFilter() {
    return new SecurityHeadersFilter();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource(
      @Value("${app.cors.allowed-origins:http://localhost:3000}") String allowedOrigins) {
    var cors = new CorsConfiguration();
    cors.setAllowedOrigins(
        Arrays.stream(allowedOrigins.split(",")).map(String::trim).filter(origin -> !origin.isBlank()).toList());
    cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    cors.setAllowedHeaders(List.of("*"));

    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cors);
    return source;
  }
}

class SecurityHeadersFilter extends GenericFilter {
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    if (response instanceof HttpServletResponse httpResponse) {
      httpResponse.setHeader("X-Content-Type-Options", "nosniff");
      httpResponse.setHeader("Referrer-Policy", "no-referrer");
      httpResponse.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
      httpResponse.setHeader("X-Frame-Options", "DENY");
      httpResponse.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
    }

    chain.doFilter(request, response);
  }
}

class JwtFilter extends GenericFilter {
  private final JwtService jwt;
  private final UserRepository users;

  JwtFilter(JwtService jwt, UserRepository users) {
    this.jwt = jwt;
    this.users = users;
  }

  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    var header = ((HttpServletRequest) request).getHeader("Authorization");
    if (header != null && header.startsWith("Bearer ")) {
      try {
        var userId = jwt.parseUserId(header.substring(7));
        users
            .findById(userId)
            .ifPresent(
                user ->
                    SecurityContextHolder.getContext()
                        .setAuthentication(
                            new UsernamePasswordAuthenticationToken(user, null, List.of())));
      } catch (Exception ignored) {
      }
    }

    chain.doFilter(request, response);
  }
}

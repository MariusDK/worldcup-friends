package com.marius.worldcup.auth;

import com.marius.worldcup.common.config.JwtService;
import com.marius.worldcup.users.AppUser;
import com.marius.worldcup.users.UserRepository;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final JwtService jwt;

  AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
    this.users = users;
    this.encoder = encoder;
    this.jwt = jwt;
  }

  record AuthReq(@Email String email, @Size(min = 3) String displayName, @Size(min = 6) String password) {}

  record LoginReq(@Email String email, String password) {}

  record AuthRes(String token, String displayName, String email) {}

  record ErrorRes(String message) {}

  @PostMapping("/auth/register")
  ResponseEntity<?> register(@RequestBody AuthReq request) {
    if (users.findByEmail(request.email()).isPresent()) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorRes("Email already used"));
    }

    var user = new AppUser();
    user.email = request.email();
    user.displayName = request.displayName();
    user.passwordHash = encoder.encode(request.password());
    users.save(user);

    return ResponseEntity.ok(new AuthRes(jwt.createToken(user.id, user.email), user.displayName, user.email));
  }

  @PostMapping("/auth/login")
  AuthRes login(@RequestBody LoginReq request) {
    var user = users.findByEmail(request.email()).orElseThrow();
    if (!encoder.matches(request.password(), user.passwordHash)) {
      throw new BadCredentialsException("Invalid login");
    }

    return new AuthRes(jwt.createToken(user.id, user.email), user.displayName, user.email);
  }

  @GetMapping("/me")
  Object me(@AuthenticationPrincipal AppUser user) {
    return new AuthRes("", user.displayName, user.email);
  }
}

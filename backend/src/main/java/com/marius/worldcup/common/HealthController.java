package com.marius.worldcup.common;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
  @GetMapping("/")
  Map<String, String> root() {
    return Map.of("status", "ok", "app", "football-friends-predictor-backend");
  }

  @GetMapping("/api/health")
  Map<String, String> health() {
    return Map.of("status", "ok");
  }
}

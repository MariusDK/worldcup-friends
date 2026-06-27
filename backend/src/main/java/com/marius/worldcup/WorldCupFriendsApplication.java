package com.marius.worldcup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class WorldCupFriendsApplication {
  public static void main(String[] args) {
    SpringApplication.run(WorldCupFriendsApplication.class, args);
  }
}

package com.marius.worldcup.users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "app_user")
public class AppUser {
  @Id @GeneratedValue public UUID id;

  @Column(unique = true, nullable = false)
  public String email;

  @Column(nullable = false)
  public String displayName;

  @Column(nullable = false)
  public String passwordHash;

  public Instant createdAt = Instant.now();
}

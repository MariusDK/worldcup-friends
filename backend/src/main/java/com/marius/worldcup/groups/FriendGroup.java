package com.marius.worldcup.groups;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "friend_group")
public class FriendGroup {
  @Id @GeneratedValue public UUID id;

  @Column(nullable = false)
  public String name;

  @Column(nullable = false)
  public UUID ownerId;

  @Column(unique = true, nullable = false)
  public String inviteCode;

  public Instant createdAt = Instant.now();
}

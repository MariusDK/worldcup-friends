package com.marius.worldcup.groups;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "group_member",
    uniqueConstraints = @UniqueConstraint(columnNames = {"groupId", "userId"}))
public class GroupMember {
  @Id @GeneratedValue public UUID id;

  @Column(nullable = false)
  public UUID groupId;

  @Column(nullable = false)
  public UUID userId;

  @Column(nullable = false)
  public String role;

  public Instant joinedAt = Instant.now();
}

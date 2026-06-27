package com.marius.worldcup.predictions;

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
    name = "prediction",
    uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "matchId", "groupId"}))
public class Prediction {
  @Id @GeneratedValue public UUID id;

  @Column(nullable = false)
  public UUID userId;

  @Column(nullable = false)
  public UUID matchId;

  @Column(nullable = false)
  public UUID groupId;

  public Integer homeScore;
  public Integer awayScore;
  public String predictedWinner;
  public Instant lockedAt;
  public Integer points = 0;
}

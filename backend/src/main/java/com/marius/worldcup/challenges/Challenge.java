package com.marius.worldcup.challenges;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "challenge")
public class Challenge {
  @Id @GeneratedValue public UUID id;

  @Column(nullable = false)
  public UUID challengerId;

  @Column(nullable = false)
  public UUID opponentId;

  @Column(nullable = false)
  public UUID groupId;

  @Column(nullable = false)
  public UUID matchId;

  public UUID challengerPredictionId;
  public UUID opponentPredictionId;
  public String status = "PENDING";
  public UUID winnerUserId;
  public Instant createdAt = Instant.now();
}

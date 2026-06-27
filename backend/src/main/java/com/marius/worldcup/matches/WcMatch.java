package com.marius.worldcup.matches;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "wc_match")
public class WcMatch {
  @Id @GeneratedValue public UUID id;

  @Column(unique = true)
  public String externalId;

  public String homeTeam;
  public String awayTeam;
  public Instant kickoffAt;
  public String status;
  public Integer homeScore;
  public Integer awayScore;
}

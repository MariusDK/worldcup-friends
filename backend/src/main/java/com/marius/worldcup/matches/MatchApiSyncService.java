package com.marius.worldcup.matches;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.marius.worldcup.predictions.PredictionScoringService;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class MatchApiSyncService {
  private static final Logger log = LoggerFactory.getLogger(MatchApiSyncService.class);
  private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("M/d/yyyy H:mm");

  private final MatchRepository repo;
  private final PredictionScoringService scoring;
  private final RestClient restClient;
  private final String gamesUrl;
  private final ZoneId matchZone;

  public MatchApiSyncService(
      MatchRepository repo,
      PredictionScoringService scoring,
      @Value("${app.match-api.url:https://worldcup26.ir/get/games}") String gamesUrl,
      @Value("${app.match-api.time-zone:UTC}") String matchTimeZone) {
    this.repo = repo;
    this.scoring = scoring;
    this.restClient = RestClient.create();
    this.gamesUrl = gamesUrl;
    this.matchZone = ZoneId.of(matchTimeZone);
  }

  public void syncFromApi() {
    try {
      var response = restClient.get().uri(gamesUrl).retrieve().body(GamesResponse.class);
      if (response == null || response.games() == null) {
        return;
      }

      for (var apiMatch : response.games()) {
        try {
          upsert(apiMatch);
        } catch (Exception e) {
          log.warn("Could not sync football match {}", apiMatch == null ? null : apiMatch.id(), e);
        }
      }
    } catch (Exception e) {
      log.warn("Could not sync football matches from {}", gamesUrl, e);
    }
  }

  private void upsert(ApiGame apiGame) {
    if (apiGame == null || apiGame.id() == null || apiGame.id().isBlank()) {
      return;
    }

    var match = repo.findByExternalId(apiGame.id()).orElseGet(WcMatch::new);
    match.externalId = apiGame.id();
    match.homeTeam = firstPresent(apiGame.homeTeamNameEn(), apiGame.homeTeamLabel(), "TBD");
    match.awayTeam = firstPresent(apiGame.awayTeamNameEn(), apiGame.awayTeamLabel(), "TBD");
    match.kickoffAt = parseKickoff(apiGame.localDate(), apiGame.stadiumId());
    match.status = status(apiGame);

    var finished = isTrue(apiGame.finished());
    match.homeScore = parseScore(apiGame.homeScore(), finished);
    match.awayScore = parseScore(apiGame.awayScore(), finished);

    var saved = repo.save(match);
    scoring.scoreFinishedMatch(saved);
  }

  private Instant parseKickoff(String localDate, String stadiumId) {
    if (localDate == null || localDate.isBlank()) {
      return null;
    }

    return LocalDateTime.parse(localDate, DATE_FORMAT).atZone(stadiumZone(stadiumId)).toInstant();
  }

  private ZoneId stadiumZone(String stadiumId) {
    return switch (stadiumId) {
      case "1", "2", "3" -> ZoneId.of("America/Mexico_City");
      case "4", "5", "6" -> ZoneId.of("America/Chicago");
      case "7", "8", "9", "10", "11" -> ZoneId.of("America/New_York");
      case "12" -> ZoneId.of("America/Toronto");
      case "13" -> ZoneId.of("America/Vancouver");
      case "14", "15", "16" -> ZoneId.of("America/Los_Angeles");
      default -> matchZone;
    };
  }

  private String status(ApiGame apiGame) {
    if (isTrue(apiGame.finished())) {
      return "FINISHED";
    }
    if ("notstarted".equalsIgnoreCase(apiGame.timeElapsed())) {
      return "SCHEDULED";
    }
    return apiGame.timeElapsed() == null ? "SCHEDULED" : apiGame.timeElapsed().toUpperCase(Locale.ROOT);
  }

  private Integer parseScore(String value, boolean finished) {
    if (!finished || value == null || value.isBlank() || "null".equalsIgnoreCase(value)) {
      return null;
    }

    try {
      return Integer.valueOf(value);
    } catch (NumberFormatException e) {
      return null;
    }
  }

  private boolean isTrue(String value) {
    return "TRUE".equalsIgnoreCase(value);
  }

  private String firstPresent(String... values) {
    for (var value : values) {
      if (value != null && !value.isBlank()) {
        return value;
      }
    }
    return null;
  }

  public record GamesResponse(List<ApiGame> games) {}

  public record ApiGame(
      String id,
      @JsonProperty("home_score") String homeScore,
      @JsonProperty("away_score") String awayScore,
      @JsonProperty("local_date") String localDate,
      @JsonProperty("stadium_id") String stadiumId,
      String finished,
      @JsonProperty("time_elapsed") String timeElapsed,
      @JsonProperty("home_team_name_en") String homeTeamNameEn,
      @JsonProperty("away_team_name_en") String awayTeamNameEn,
      @JsonProperty("home_team_label") String homeTeamLabel,
      @JsonProperty("away_team_label") String awayTeamLabel) {}
}

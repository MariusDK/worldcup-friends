package com.marius.worldcup.matches;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/matches")
public class MatchController {
  private final MatchRepository repo;

  MatchController(MatchRepository repo) {
    this.repo = repo;
  }

  record MatchRes(
      UUID id,
      String externalId,
      String homeTeam,
      String awayTeam,
      Instant kickoffAt,
      String localKickoffAt,
      String timeZone,
      String status,
      Integer homeScore,
      Integer awayScore) {}

  @GetMapping
  public List<WcMatch> all() {
    return repo.findAllByOrderByKickoffAtAsc();
  }

  @GetMapping("/today")
  public List<MatchRes> today(@RequestParam(name = "timeZone", defaultValue = "UTC") String timeZone) {
    var zone = zone(timeZone);
    var openMatchday = firstOpenMatchday(zone);
    var day = openMatchday == null ? LocalDate.now(zone) : openMatchday;
    var from = day.atStartOfDay(zone).toInstant();
    var to = day.plusDays(1).atStartOfDay(zone).toInstant();

    return repo.findByKickoffAtBetweenOrderByKickoffAtAsc(from, to).stream()
        .map(match -> toRes(match, zone))
        .toList();
  }

  private LocalDate firstOpenMatchday(ZoneId zone) {
    return repo.findAllByOrderByKickoffAtAsc().stream()
        .filter(match -> match.kickoffAt != null)
        .filter(match -> !"FINISHED".equalsIgnoreCase(match.status))
        .map(match -> match.kickoffAt.atZone(zone).toLocalDate())
        .findFirst()
        .orElse(null);
  }

  private static MatchRes toRes(WcMatch match, ZoneId zone) {
    return new MatchRes(
        match.id,
        match.externalId,
        match.homeTeam,
        match.awayTeam,
        match.kickoffAt,
        match.kickoffAt == null
            ? null
            : match.kickoffAt.atZone(zone).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
        zone.getId(),
        match.status,
        match.homeScore,
        match.awayScore);
  }

  private static ZoneId zone(String timeZone) {
    try {
      return ZoneId.of(timeZone);
    } catch (Exception e) {
      return ZoneOffset.UTC;
    }
  }
}

package com.marius.worldcup.predictions;

import com.marius.worldcup.groups.GroupMemberRepository;
import com.marius.worldcup.matches.MatchRepository;
import com.marius.worldcup.users.AppUser;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class PredictionController {
  private final PredictionRepository predictions;
  private final MatchRepository matches;
  private final GroupMemberRepository members;

  PredictionController(
      PredictionRepository predictions, MatchRepository matches, GroupMemberRepository members) {
    this.predictions = predictions;
    this.matches = matches;
    this.members = members;
  }

  record PredictionReq(UUID groupId, UUID matchId, int homeScore, int awayScore) {}

  @PostMapping("/predictions")
  Prediction submit(@AuthenticationPrincipal AppUser user, @RequestBody PredictionReq request) {
    validate(request);

    if (!members.existsByGroupIdAndUserId(request.groupId(), user.id)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Join this group before saving predictions");
    }

    var match =
        matches
            .findById(request.matchId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

    if (!isOpenForPredictions(match.status)
        || (match.status == null && match.kickoffAt != null && !Instant.now().isBefore(match.kickoffAt))) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prediction locked: match already started");
    }

    var prediction = findOrCreate(user.id, request.matchId(), request.groupId());
    prediction.userId = user.id;
    prediction.groupId = request.groupId();
    prediction.matchId = request.matchId();
    prediction.homeScore = request.homeScore();
    prediction.awayScore = request.awayScore();
    prediction.predictedWinner = winner(request.homeScore(), request.awayScore());
    prediction.lockedAt = null;

    try {
      return predictions.saveAndFlush(prediction);
    } catch (DataIntegrityViolationException duplicatePrediction) {
      var existing =
          predictions
              .findByUserIdAndMatchIdAndGroupId(user.id, request.matchId(), request.groupId())
              .orElseThrow();
      existing.homeScore = request.homeScore();
      existing.awayScore = request.awayScore();
      existing.predictedWinner = winner(request.homeScore(), request.awayScore());
      existing.lockedAt = null;
      return predictions.save(existing);
    }
  }

  @GetMapping("/groups/{groupId}/predictions")
  List<Prediction> byGroup(@PathVariable("groupId") UUID groupId) {
    return predictions.findByGroupId(groupId);
  }

  @GetMapping("/groups/{groupId}/my-predictions")
  List<Prediction> mine(@AuthenticationPrincipal AppUser user, @PathVariable("groupId") UUID groupId) {
    return predictions.findByUserIdAndGroupId(user.id, groupId);
  }

  private static void validate(PredictionReq request) {
    if (request.groupId() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a group before saving");
    }
    if (request.matchId() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a match before saving");
    }
    if (request.homeScore() < 0 || request.awayScore() < 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Scores cannot be negative");
    }
  }

  static String winner(int homeScore, int awayScore) {
    return homeScore > awayScore ? "HOME" : awayScore > homeScore ? "AWAY" : "DRAW";
  }

  private static boolean isOpenForPredictions(String status) {
    return status == null || "SCHEDULED".equalsIgnoreCase(status) || "NOTSTARTED".equalsIgnoreCase(status);
  }

  private Prediction findOrCreate(UUID userId, UUID matchId, UUID groupId) {
    return predictions.findByUserIdAndMatchIdAndGroupId(userId, matchId, groupId).orElseGet(Prediction::new);
  }
}

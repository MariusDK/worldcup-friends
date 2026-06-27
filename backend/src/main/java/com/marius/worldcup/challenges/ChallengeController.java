package com.marius.worldcup.challenges;

import com.marius.worldcup.users.AppUser;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChallengeController {
  private final ChallengeRepository repo;

  ChallengeController(ChallengeRepository repo) {
    this.repo = repo;
  }

  record CreateChallengeReq(UUID opponentId, UUID groupId, UUID matchId, UUID challengerPredictionId) {}

  @PostMapping("/challenges")
  Challenge create(@AuthenticationPrincipal AppUser user, @RequestBody CreateChallengeReq request) {
    var challenge = new Challenge();
    challenge.challengerId = user.id;
    challenge.opponentId = request.opponentId();
    challenge.groupId = request.groupId();
    challenge.matchId = request.matchId();
    challenge.challengerPredictionId = request.challengerPredictionId();
    return repo.save(challenge);
  }

  @PostMapping("/challenges/{id}/accept")
  Challenge accept(@PathVariable("id") UUID id) {
    var challenge = repo.findById(id).orElseThrow();
    challenge.status = "ACCEPTED";
    return repo.save(challenge);
  }

  @PostMapping("/challenges/{id}/decline")
  Challenge decline(@PathVariable("id") UUID id) {
    var challenge = repo.findById(id).orElseThrow();
    challenge.status = "DECLINED";
    return repo.save(challenge);
  }

  @GetMapping("/groups/{groupId}/challenges")
  List<Challenge> byGroup(@PathVariable("groupId") UUID groupId) {
    return repo.findByGroupId(groupId);
  }
}

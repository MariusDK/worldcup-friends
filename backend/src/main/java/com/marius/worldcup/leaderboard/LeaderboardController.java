package com.marius.worldcup.leaderboard;

import com.marius.worldcup.groups.GroupMemberRepository;
import com.marius.worldcup.predictions.PredictionRepository;
import com.marius.worldcup.users.UserRepository;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/groups/{groupId}/leaderboard")
public class LeaderboardController {
  private final PredictionRepository predictions;
  private final GroupMemberRepository members;
  private final UserRepository users;

  LeaderboardController(
      PredictionRepository predictions, GroupMemberRepository members, UserRepository users) {
    this.predictions = predictions;
    this.members = members;
    this.users = users;
  }

  record Row(UUID userId, String displayName, String role, int points, long predictions) {}

  @GetMapping
  public List<Row> leaderboard(@PathVariable("groupId") UUID groupId) {
    var totals = new HashMap<UUID, Integer>();
    var counts = new HashMap<UUID, Long>();

    for (var prediction : predictions.findByGroupId(groupId)) {
      totals.merge(prediction.userId, prediction.points == null ? 0 : prediction.points, Integer::sum);
      counts.merge(prediction.userId, 1L, Long::sum);
    }

    return members.findByGroupId(groupId).stream()
        .map(
            member -> {
              var user = users.findById(member.userId).orElseThrow();
              return new Row(
                  user.id,
                  user.displayName,
                  member.role,
                  totals.getOrDefault(user.id, 0),
                  counts.getOrDefault(user.id, 0L));
            })
        .sorted(Comparator.comparingInt(Row::points).reversed())
        .toList();
  }
}

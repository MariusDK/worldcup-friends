package com.marius.worldcup.challenges;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeRepository extends JpaRepository<Challenge, UUID> {
  List<Challenge> findByGroupId(UUID groupId);

  List<Challenge> findByChallengerIdOrOpponentId(UUID challengerId, UUID opponentId);
}

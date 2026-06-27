package com.marius.worldcup.matches;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<WcMatch, UUID> {
  Optional<WcMatch> findByExternalId(String externalId);

  List<WcMatch> findByKickoffAtBetweenOrderByKickoffAtAsc(Instant from, Instant to);

  List<WcMatch> findAllByOrderByKickoffAtAsc();
}

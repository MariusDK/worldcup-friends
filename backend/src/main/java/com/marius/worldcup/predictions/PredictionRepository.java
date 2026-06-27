package com.marius.worldcup.predictions;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PredictionRepository extends JpaRepository<Prediction, UUID> {
  List<Prediction> findByGroupId(UUID groupId);

  List<Prediction> findByUserIdAndGroupId(UUID userId, UUID groupId);

  List<Prediction> findByUserId(UUID userId);

  Optional<Prediction> findByUserIdAndMatchIdAndGroupId(UUID userId, UUID matchId, UUID groupId);

  List<Prediction> findByMatchId(UUID matchId);

  void deleteByUserId(UUID userId);
}

package com.marius.worldcup.groups;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
  List<GroupMember> findByUserId(UUID userId);

  boolean existsByGroupIdAndUserId(UUID groupId, UUID userId);

  Optional<GroupMember> findByGroupIdAndUserId(UUID groupId, UUID userId);

  List<GroupMember> findByGroupId(UUID groupId);

  void deleteByUserId(UUID userId);
}

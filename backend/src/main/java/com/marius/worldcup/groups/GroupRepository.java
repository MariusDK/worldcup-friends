package com.marius.worldcup.groups;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<FriendGroup, UUID> {
  Optional<FriendGroup> findByInviteCode(String inviteCode);
}

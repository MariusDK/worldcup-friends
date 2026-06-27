package com.marius.worldcup.groups;

import com.marius.worldcup.users.AppUser;
import java.security.SecureRandom;
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
@RequestMapping("/api/groups")
public class GroupController {
  private final GroupRepository groups;
  private final GroupMemberRepository members;

  GroupController(GroupRepository groups, GroupMemberRepository members) {
    this.groups = groups;
    this.members = members;
  }

  record CreateGroupReq(String name) {}

  @PostMapping
  public FriendGroup create(@AuthenticationPrincipal AppUser user, @RequestBody CreateGroupReq request) {
    var group = new FriendGroup();
    group.name = request.name();
    group.ownerId = user.id;
    group.inviteCode = code();
    groups.save(group);

    var member = new GroupMember();
    member.groupId = group.id;
    member.userId = user.id;
    member.role = "OWNER";
    members.save(member);

    return group;
  }

  @GetMapping
  public List<FriendGroup> myGroups(@AuthenticationPrincipal AppUser user) {
    return members.findByUserId(user.id).stream()
        .map(member -> groups.findById(member.groupId).orElseThrow())
        .toList();
  }

  @PostMapping("/join/{inviteCode}")
  public FriendGroup join(
      @AuthenticationPrincipal AppUser user, @PathVariable("inviteCode") String inviteCode) {
    var group = groups.findByInviteCode(inviteCode).orElseThrow();
    if (!members.existsByGroupIdAndUserId(group.id, user.id)) {
      var member = new GroupMember();
      member.groupId = group.id;
      member.userId = user.id;
      member.role = "MEMBER";
      members.save(member);
    }
    return group;
  }

  @GetMapping("/{id}")
  public FriendGroup one(@PathVariable("id") UUID id) {
    return groups.findById(id).orElseThrow();
  }

  private static String code() {
    return Long.toString(Math.abs(new SecureRandom().nextLong()), 36).substring(0, 8).toUpperCase();
  }
}

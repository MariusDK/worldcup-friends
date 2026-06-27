package com.marius.worldcup.users;

import com.marius.worldcup.challenges.Challenge;
import com.marius.worldcup.challenges.ChallengeRepository;
import com.marius.worldcup.groups.FriendGroup;
import com.marius.worldcup.groups.GroupMember;
import com.marius.worldcup.groups.GroupMemberRepository;
import com.marius.worldcup.groups.GroupRepository;
import com.marius.worldcup.predictions.Prediction;
import com.marius.worldcup.predictions.PredictionRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/account")
public class AccountController {
  private final UserRepository users;
  private final GroupRepository groups;
  private final GroupMemberRepository members;
  private final PredictionRepository predictions;
  private final ChallengeRepository challenges;
  private final PasswordEncoder encoder;

  AccountController(
      UserRepository users,
      GroupRepository groups,
      GroupMemberRepository members,
      PredictionRepository predictions,
      ChallengeRepository challenges,
      PasswordEncoder encoder) {
    this.users = users;
    this.groups = groups;
    this.members = members;
    this.predictions = predictions;
    this.challenges = challenges;
    this.encoder = encoder;
  }

  record UpdateAccountReq(@Email String email, @Size(min = 3, max = 120) String displayName) {}

  record ChangePasswordReq(String currentPassword, @Size(min = 6) String newPassword) {}

  record DeleteAccountReq(String password) {}

  record AccountRes(UUID id, String email, String displayName, Instant createdAt) {}

  record GroupExport(UUID id, String name, String inviteCode, String role, Instant joinedAt) {}

  record PredictionExport(
      UUID id,
      UUID groupId,
      UUID matchId,
      Integer homeScore,
      Integer awayScore,
      Integer points,
      Instant lockedAt) {}

  record ChallengeExport(UUID id, UUID groupId, UUID matchId, String status, Instant createdAt) {}

  record AccountExport(
      AccountRes account,
      List<GroupExport> groups,
      List<PredictionExport> predictions,
      List<ChallengeExport> challenges,
      String notice) {}

  @GetMapping
  AccountRes account(@AuthenticationPrincipal AppUser user) {
    return toAccountRes(user);
  }

  @PatchMapping
  @Transactional
  AccountRes update(@AuthenticationPrincipal AppUser user, @RequestBody UpdateAccountReq request) {
    var email = normalizedEmail(request.email());
    var displayName = normalizedDisplayName(request.displayName());

    users
        .findByEmail(email)
        .filter(existing -> !existing.id.equals(user.id))
        .ifPresent(
            existing -> {
              throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already used");
            });

    user.email = email;
    user.displayName = displayName;
    return toAccountRes(users.save(user));
  }

  @PostMapping("/password")
  @Transactional
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void changePassword(
      @AuthenticationPrincipal AppUser user, @RequestBody ChangePasswordReq request) {
    if (!encoder.matches(request.currentPassword(), user.passwordHash)) {
      throw new BadCredentialsException("Invalid current password");
    }

    if (request.newPassword() == null || request.newPassword().length() < 6) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password must be at least 6 characters");
    }

    user.passwordHash = encoder.encode(request.newPassword());
    users.save(user);
  }

  @GetMapping("/export")
  AccountExport export(@AuthenticationPrincipal AppUser user) {
    var memberRows = members.findByUserId(user.id);
    var userGroups =
        memberRows.stream()
            .map(member -> toGroupExport(member, groups.findById(member.groupId).orElse(null)))
            .toList();
    var userPredictions = predictions.findByUserId(user.id).stream().map(this::toPredictionExport).toList();
    var userChallenges =
        challenges.findByChallengerIdOrOpponentId(user.id, user.id).stream()
            .map(this::toChallengeExport)
            .toList();

    return new AccountExport(
        toAccountRes(user),
        userGroups,
        userPredictions,
        userChallenges,
        "This export contains account data held by the application. Server logs and hosting provider logs may be held separately for security and operations.");
  }

  @DeleteMapping
  @Transactional
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void deleteAccount(@AuthenticationPrincipal AppUser user, @RequestBody DeleteAccountReq request) {
    if (!encoder.matches(request.password(), user.passwordHash)) {
      throw new BadCredentialsException("Invalid password");
    }

    var relatedChallenges = challenges.findByChallengerIdOrOpponentId(user.id, user.id);
    challenges.deleteAll(relatedChallenges);
    predictions.deleteByUserId(user.id);
    members.deleteByUserId(user.id);
    users.delete(user);
  }

  private AccountRes toAccountRes(AppUser user) {
    return new AccountRes(user.id, user.email, user.displayName, user.createdAt);
  }

  private GroupExport toGroupExport(GroupMember member, FriendGroup group) {
    return new GroupExport(
        member.groupId,
        group == null ? "Deleted group" : group.name,
        group == null ? "" : group.inviteCode,
        member.role,
        member.joinedAt);
  }

  private PredictionExport toPredictionExport(Prediction prediction) {
    return new PredictionExport(
        prediction.id,
        prediction.groupId,
        prediction.matchId,
        prediction.homeScore,
        prediction.awayScore,
        prediction.points,
        prediction.lockedAt);
  }

  private ChallengeExport toChallengeExport(Challenge challenge) {
    return new ChallengeExport(
        challenge.id, challenge.groupId, challenge.matchId, challenge.status, challenge.createdAt);
  }

  private String normalizedEmail(String email) {
    if (email == null || email.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
    }
    return email.trim().toLowerCase();
  }

  private String normalizedDisplayName(String displayName) {
    if (displayName == null || displayName.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Display name is required");
    }
    return displayName.trim();
  }
}

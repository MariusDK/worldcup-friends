package com.marius.worldcup.matches;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class MatchSyncJob {
  private final MatchApiSyncService sync;

  MatchSyncJob(MatchApiSyncService sync) {
    this.sync = sync;
  }

  @EventListener(ApplicationReadyEvent.class)
  void syncMatchesOnStartup() {
    sync.syncFromApi();
  }

  @Scheduled(fixedDelayString = "${app.match-api.sync-delay-ms:900000}")
  void syncMatchesAndScorePredictions() {
    sync.syncFromApi();
  }
}

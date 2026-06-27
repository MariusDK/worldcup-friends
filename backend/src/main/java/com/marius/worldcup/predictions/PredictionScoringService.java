package com.marius.worldcup.predictions;

import com.marius.worldcup.matches.WcMatch;
import org.springframework.stereotype.Service;

@Service
public class PredictionScoringService {
  private static final int EXACT_SCORE_POINTS = 3;
  private static final int CORRECT_RESULT_POINTS = 1;

  private final PredictionRepository predictions;

  PredictionScoringService(PredictionRepository predictions) {
    this.predictions = predictions;
  }

  public void scoreFinishedMatch(WcMatch match) {
    if (!isScorable(match)) {
      return;
    }

    var actualWinner = winner(match.homeScore, match.awayScore);
    var matchPredictions = predictions.findByMatchId(match.id);
    var changed = false;

    for (var prediction : matchPredictions) {
      var points = pointsFor(prediction, match, actualWinner);
      if (!points.equals(prediction.points)) {
        prediction.points = points;
        changed = true;
      }
    }

    if (changed) {
      predictions.saveAll(matchPredictions);
    }
  }

  private static boolean isScorable(WcMatch match) {
    return match != null
        && match.id != null
        && "FINISHED".equalsIgnoreCase(match.status)
        && match.homeScore != null
        && match.awayScore != null;
  }

  private static Integer pointsFor(Prediction prediction, WcMatch match, String actualWinner) {
    if (prediction.homeScore == null || prediction.awayScore == null) {
      return 0;
    }
    if (prediction.homeScore.equals(match.homeScore) && prediction.awayScore.equals(match.awayScore)) {
      return EXACT_SCORE_POINTS;
    }
    return actualWinner.equals(prediction.predictedWinner) ? CORRECT_RESULT_POINTS : 0;
  }

  private static String winner(int homeScore, int awayScore) {
    return homeScore > awayScore ? "HOME" : awayScore > homeScore ? "AWAY" : "DRAW";
  }
}

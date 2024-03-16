package com.efervescencia.papalabra;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findTop10ByOrderByScoreDesc();
    Score findByUserId(Long userId);

    default void addPoints(Long userId, int points) {
        Score score = findByUserId(userId);
        if (score == null) {
            score = new Score();
            score.setUserId(userId);
        }
        score.setScore(score.getScore() + points);
        save(score);
    }


}

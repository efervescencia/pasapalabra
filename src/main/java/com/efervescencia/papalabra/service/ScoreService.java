package com.efervescencia.papalabra.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.efervescencia.papalabra.model.Score;
import com.efervescencia.papalabra.repository.IScoreRepository;

@Service
public class ScoreService {

    @Autowired
    private IScoreRepository scoreRepository;

    public void addPoints(Long id, int points) {
        Score score = scoreRepository.findById(id).orElseThrow(() -> new RuntimeException("Score not found"));
        score.setScore(score.getScore() + points);
        scoreRepository.save(score);
    }
}

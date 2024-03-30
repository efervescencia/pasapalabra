package com.efervescencia.papalabra.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.efervescencia.papalabra.model.Score;

@Repository
public interface IScoreRepository  extends JpaRepository<Score, Long>{
    List<Score> findTop10ByOrderByScoreDesc();
    Score findByUserId(Long userId);
}

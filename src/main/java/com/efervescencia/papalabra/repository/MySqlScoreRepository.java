package com.efervescencia.papalabra.repository;

import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import com.efervescencia.papalabra.model.Score;

@Repository
@Profile("mysql")
public interface MySqlScoreRepository extends IScoreRepository {

    List<Score> findTop10ByOrderByScoreDesc();
    Score findByUserId(Long userId);

}

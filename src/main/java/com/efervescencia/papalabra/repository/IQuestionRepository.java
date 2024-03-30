package com.efervescencia.papalabra.repository;

import java.util.List;

import org.springframework.data.repository.query.Param;

import com.efervescencia.papalabra.model.Question;

import java.util.Optional;


public interface IQuestionRepository {
    List<Question> findByLetra(String letter);
    Optional<Question> getAnswerById(@Param("id") int id);
}

package com.efervescencia.papalabra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.efervescencia.papalabra.model.Question;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByLetra(String letra);
    String getAnswerById(int questionId);
}

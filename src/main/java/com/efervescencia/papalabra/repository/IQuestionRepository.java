package com.efervescencia.papalabra.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.efervescencia.papalabra.model.Question;

import java.util.Optional;

@Repository
public interface IQuestionRepository extends JpaRepository<Question, Long>{
    List<Question> findByLetra(String letter);
    Optional<Question> getAnswerById(@Param("id") int id);
}

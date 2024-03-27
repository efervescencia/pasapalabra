package com.efervescencia.papalabra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.efervescencia.papalabra.model.Question;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByLetra(String letra);

    @Query("SELECT q FROM Question q WHERE q.id = :id")
    Optional<Question> getAnswerById(@Param("id") int id);
}

package com.efervescencia.papalabra.repository;

import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.efervescencia.papalabra.model.Question;

import java.util.List;
import java.util.Optional;

@Repository
@Profile("mysql")
public interface MySqlQuestionRepository extends IQuestionRepository {
    List<Question> findByLetra(String letra);

    @Query("SELECT q FROM Question q WHERE q.id = :id")
    Optional<Question> getAnswerById(@Param("id") Long id);
}

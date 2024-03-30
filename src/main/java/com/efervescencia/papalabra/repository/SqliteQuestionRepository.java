package com.efervescencia.papalabra.repository;

import com.efervescencia.papalabra.model.Question;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;
import org.springframework.context.annotation.Profile;

@Repository
@Profile("sqlite")
public class SqliteQuestionRepository implements IQuestionRepository {

        @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Question> findByLetra(String letter) {
        TypedQuery<Question> query = entityManager.createQuery("SELECT q FROM Question q WHERE q.letra = :letter", Question.class);
        query.setParameter("letter", letter);
        return query.getResultList();
    }

    @Override
    public Optional<Question> getAnswerById(int id) {
        Question question = entityManager.find(Question.class, id);
        return Optional.ofNullable(question);
    }

}

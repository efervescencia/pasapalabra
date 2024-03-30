package com.efervescencia.papalabra.service;

import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.efervescencia.papalabra.model.Question;
import com.efervescencia.papalabra.repository.QuestionRepository;



@Service
@Profile("sqlite")
public class SqliteQuestionService implements IQuestionService {

    private final QuestionRepository questionRepository;

    public SqliteQuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public List<Question> findByLetra(String letra) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByLetra'");
    }

    @Override
    public Optional<Question> getAnswerById(int id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAnswerById'");
    }


}

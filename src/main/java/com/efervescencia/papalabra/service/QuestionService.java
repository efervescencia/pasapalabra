package com.efervescencia.papalabra.service;

import java.text.Normalizer;
// Clase QuestionService
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.efervescencia.papalabra.model.Question;
import com.efervescencia.papalabra.repository.QuestionRepository;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    public Question getRandomQuestionByLetter(String letter) {
        List<Question> questions = questionRepository.findByLetra(letter);
        if (questions.isEmpty()) {
            return null; // o manejar de otra manera
        }
        Random rand = new Random();
        return questions.get(rand.nextInt(questions.size()));
    }

public boolean checkAnswer(int questionId, String userAnswer) {
    String respuestaCorrecta = questionRepository.getAnswerById(questionId);

    // Normalizar las cadenas para eliminar acentos y convertir a minúsculas
    String normalizedCorrectAnswer = Normalizer.normalize(respuestaCorrecta, Normalizer.Form.NFD)
        .replaceAll("[^\\p{ASCII}]", "").toLowerCase().trim();
    String normalizedUserAnswer = Normalizer.normalize(userAnswer, Normalizer.Form.NFD)
        .replaceAll("[^\\p{ASCII}]", "").toLowerCase().trim();

    return normalizedCorrectAnswer.equals(normalizedUserAnswer);
}
}

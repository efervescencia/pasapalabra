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
        List<Question> questions = questionRepository.findByLetra(letter.toLowerCase());
        if (questions.isEmpty()) {
            return null; // o manejar de otra manera
        }
        Random rand = new Random();
        Question result =  questions.get(rand.nextInt(questions.size()));
        result.setRespuesta("");
        return result;
    }

    

    public Question getQuestionById(int id) {
        // Usa el método findById del repositorio para obtener la pregunta
        // Este método devuelve un Optional, por lo que usamos orElse(null) para devolver null si la pregunta no se encuentra
        return questionRepository.getAnswerById(id).orElse(null);
    }
}

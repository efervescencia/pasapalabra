package com.efervescencia.papalabra.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.efervescencia.papalabra.model.Question;
import com.efervescencia.papalabra.service.QuestionService;


@RestController
public class QuestionController {


    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }


    @GetMapping("/rosco")
    public Map<String, Question> getRosco() {
        Map<String, Question> rosco = new HashMap<>();
        String alphabet = "ABCDEFGHIJLMNÑOPQRSTUVXYZ";
        for (char letter : alphabet.toCharArray()) {
            Question question = questionService.getRandomQuestionByLetter(String.valueOf(letter));
            if (question != null) {
                rosco.put(String.valueOf(letter), question);
            }
        }
        return rosco;
    }

}

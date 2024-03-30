package com.efervescencia.papalabra.service;

import com.efervescencia.papalabra.model.Question;

public interface IQuestionService {
    Question getRandomQuestionByLetter(String letter);
    Question getQuestionById(int id);
    
}
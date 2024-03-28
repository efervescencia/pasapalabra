package com.efervescencia.papalabra.controller;

import java.text.Normalizer;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.efervescencia.papalabra.model.ComprobarRespuestaRequest;
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


    @PostMapping("/comprobarRespuesta")
    public ResponseEntity<Map<String, String>> comprobarRespuesta(@RequestBody ComprobarRespuestaRequest request) {
        // Obtiene la pregunta usando el ID
        Question question = questionService.getQuestionById(request.getIdPregunta());
    
        // Obtiene la respuesta correcta
        String respuestaCorrecta = question.getRespuesta();
    
        // Obtiene la respuesta del jugador
        String respuestaJugador = request.getRespuesta();
    
        // Convierte ambas respuestas a minúsculas y elimina los acentos
        respuestaCorrecta = Normalizer.normalize(respuestaCorrecta.toLowerCase(), Normalizer.Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        respuestaJugador = Normalizer.normalize(respuestaJugador.toLowerCase(), Normalizer.Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    
        // Comprueba si las respuestas son iguales, o si la respuesta del jugador coincide con la respuesta correcta en masculino, femenino, singular o plural
        Map<String, String> resultado = new HashMap<>();
        if (respuestaCorrecta.equals(respuestaJugador) ||
            respuestaCorrecta.equals(respuestaJugador + "a") ||
            respuestaCorrecta.equals(respuestaJugador + "o") ||
            respuestaCorrecta.equals(respuestaJugador + "s") ||
            respuestaCorrecta.equals(respuestaJugador + "es")) {
            resultado.put("respuesta", "OK");
        } else {
            resultado.put("respuesta", respuestaCorrecta); // Devuelve la respuesta correcta si la respuesta del jugador es incorrecta
        }
    
        return ResponseEntity.ok(resultado);
    }

}

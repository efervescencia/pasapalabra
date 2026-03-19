package com.efervescencia.papalabra.controller;

import java.text.Normalizer;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.efervescencia.papalabra.model.Question;
import com.efervescencia.papalabra.service.QuestionService;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class QuestionAPIController {

    @Autowired
    private QuestionService questionService;

    // ==================== GAME ENDPOINTS ====================
    
    @GetMapping("/game/rosco")
    public ResponseEntity<Map<String, Object>> getRosco() {
        try {
            Map<String, Object> rosco = new HashMap<>();
            String alphabet = "ABCDEFGHIJLMNÑOPQRSTUVXYZ";
            List<Map<String, Object>> questions = new ArrayList<>();
            
            for (char letter : alphabet.toCharArray()) {
                Question question = questionService.getRandomQuestionByLetter(String.valueOf(letter));
                if (question != null) {
                    Map<String, Object> qMap = new HashMap<>();
                    qMap.put("id", question.getId());
                    qMap.put("letter", question.getLetra());
                    qMap.put("text", question.getTexto());
                    qMap.put("tema_id", question.getTema_id());
                    // DO NOT send the answer
                    questions.add(qMap);
                }
            }
            
            rosco.put("success", true);
            rosco.put("questions", questions);
            rosco.put("total", questions.size());
            return ResponseEntity.ok(rosco);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/game/verify-answer")
    public ResponseEntity<Map<String, Object>> verifyAnswer(@RequestBody Map<String, Object> request) {
        try {
            int questionId = (int) request.get("questionId");
            String playerAnswer = (String) request.get("answer");
            
            Question question = questionService.getQuestionById(questionId);
            if (question == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "error", "Question not found"));
            }
            
            String correctAnswer = question.getRespuesta();
            boolean isCorrect = normalizeAndCompare(correctAnswer, playerAnswer);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("isCorrect", isCorrect);
            
            if (!isCorrect) {
                result.put("correctAnswer", correctAnswer);
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/game/stats")
    public ResponseEntity<Map<String, Object>> getGameStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalQuestions", questionService.getTotalQuestions());
            stats.put("success", true);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // ==================== QUESTION ENDPOINTS ====================
    
    @GetMapping("/questions")
    public ResponseEntity<Map<String, Object>> getAllQuestions() {
        try {
            List<Question> questions = questionService.getAllQuestions();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", questions);
            response.put("total", questions.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<Map<String, Object>> getQuestionById(@PathVariable int id) {
        try {
            Question question = questionService.getQuestionById(id);
            if (question == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "error", "Question not found"));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", question);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/questions/letter/{letter}")
    public ResponseEntity<Map<String, Object>> getQuestionByLetter(@PathVariable String letter) {
        try {
            Question question = questionService.getRandomQuestionByLetter(letter.toUpperCase());
            if (question == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "error", "No question found for letter: " + letter));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", question);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // ==================== UTILITY METHODS ====================
    
    private boolean normalizeAndCompare(String correctAnswer, String playerAnswer) {
        // Normalize both answers
        String normalized1 = Normalizer.normalize(correctAnswer.toLowerCase(), Normalizer.Form.NFD)
            .replaceAll("\\p{InCombiningDiacriticalMarks} +", "");
        String normalized2 = Normalizer.normalize(playerAnswer.toLowerCase(), Normalizer.Form.NFD)
            .replaceAll("\\p{InCombiningDiacriticalMarks} +", "");
        
        // Check exact match
        if (normalized1.equals(normalized2)) {
            return true;
        }
        
        // Check variants (gender, number)
        String[] variants = {
            normalized2 + "a",
            normalized2 + "o", 
            normalized2 + "s",
            normalized2 + "es"
        };
        
        for (String variant : variants) {
            if (normalized1.equals(variant)) {
                return true;
            }
        }
        
        return false;
    }
}
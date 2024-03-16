package com.efervescencia.papalabra.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.efervescencia.papalabra.model.Score;
import com.efervescencia.papalabra.repository.ScoreRepository;

@Controller
public class HomeController {

    @Autowired
    private ScoreRepository scoreRepository;

    @GetMapping("/")
    public String index(Model model) {
        List<Score> topScores = scoreRepository.findTop10ByOrderByScoreDesc();
        model.addAttribute("topScores", topScores);
        return "index";
    }

    @GetMapping("/home")
    public String home() {
        return "home";
    }

    @GetMapping("/jugar")
    public String jugar() {
        return "jugar";
    }
}

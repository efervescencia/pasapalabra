package com.efervescencia.papalabra;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

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

package com.efervescencia.papalabra.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.efervescencia.papalabra.model.Score;
import com.efervescencia.papalabra.model.User;
import com.efervescencia.papalabra.repository.IScoreRepository;
import com.efervescencia.papalabra.repository.IUserRepository;

@Controller
public class HomeController {

    @Autowired
    private IScoreRepository scoreRepository;

    @Autowired
    private IUserRepository userRepository;

    @GetMapping("/")
    public String index(Model model) {
        List<Score> topScores = scoreRepository.findTop10ByOrderByScoreDesc();
        if(topScores.size() == 0) {
            topScores.add(new Score("June", 3827, null));
            topScores.add(new Score("David", 2127, null));
            topScores.add(new Score("Julio", 2001, null));
            topScores.add(new Score("Sonia", 1977, null));
            topScores.add(new Score("El Rey", 27, null));
            topScores.add(new Score("San Mamés", 10, null));
        }
        model.addAttribute("topScores", topScores);
        return "index";
    }

    @GetMapping("/home")
    public String home(Model model, Principal principal) {

        User user = userRepository.findByUsername(principal.getName());

        model.addAttribute("username", principal.getName());
        model.addAttribute("aciertos", user.getAciertos());
        return "home";
    }

    @GetMapping("/jugar")
    public String jugar() {
        return "jugar";
    }

    @GetMapping("/logout")
    public String logout() {
        return "logout";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>("No user is currently authenticated", HttpStatus.UNAUTHORIZED);
        }
    
        String username = principal.getName();
        User user = userRepository.findByUsername(username);
    
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    
        Score score = scoreRepository.findByUserId(user.getId());
    
        if (score == null) {
            return new ResponseEntity<>("Score not found", HttpStatus.NOT_FOUND);
        }
    
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("aciertos", score.getScore());
    
        return ResponseEntity.ok(response);
    }

}

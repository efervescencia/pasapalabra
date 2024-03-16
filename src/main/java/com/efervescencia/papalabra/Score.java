package com.efervescencia.papalabra;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Score {
    @Id
    private Long userId;
    private String username;
    private int score;
    private Date registrationDate;

    //Constructors
    public Score() {
    }

    public Score(String username, int score, Date registrationDate) {
        this.username = username;
        this.score = score;
        this.registrationDate = registrationDate;
    }

    // getters and setters...
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    // toString...
    @Override
    public String toString() {
        return "Score [userId=" + userId + ", registrationDate=" + registrationDate + ", score=" + score + ", username=" + username
                + "]";
    }


}

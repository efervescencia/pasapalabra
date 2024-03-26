package com.efervescencia.papalabra.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Clase Question
@Entity
@Table(name = "preguntas")
public class Question {
    @Id
    private int id;
    private String letra;
    private String texto;
    private String respuesta;
    private int tema_id;

    // Constructor sin argumentos
    public Question() {
    }

    // getters y setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLetra() {
        return letra;
    }

    public void setLetra(String letra) {
        this.letra = letra;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    public int getTema_id() {
        return tema_id;
    }

    public void setTema_id(int tema_id) {
        this.tema_id = tema_id;
    }

    // Constructor
    public Question(int id, String letra, String texto, String respuesta, int tema_id) {
        this.id = id;
        this.letra = letra;
        this.texto = texto;
        this.respuesta = respuesta;
        this.tema_id = tema_id;
    }


    //borrar respuesta
    public void borrarRespuesta() {
        this.respuesta = "";
    }
}



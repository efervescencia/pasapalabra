package com.efervescencia.papalabra.model;

public class ComprobarRespuestaRequest {
    private int idPregunta;
    private String respuesta;


    // Constructor vacío
    public ComprobarRespuestaRequest() {
    }

    // Getters y setters

    public int getIdPregunta() {
        return idPregunta;
    }

    public void setIdPregunta(int idPregunta) {
        this.idPregunta = idPregunta;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }
}

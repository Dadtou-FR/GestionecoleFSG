package com.gestionschool.gestionecole;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "emargements")
public class Emargement {
    @Id
    private String id;
    private String eleveId;
    private String coursId;
    private String date;
    private Boolean present;
    // Getters et setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEleveId() { return eleveId; }
    public void setEleveId(String eleveId) { this.eleveId = eleveId; }
    public String getCoursId() { return coursId; }
    public void setCoursId(String coursId) { this.coursId = coursId; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public Boolean getPresent() { return present; }
    public void setPresent(Boolean present) { this.present = present; }
} 
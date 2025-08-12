package com.gestionschool.gestionecole;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cours")
public class Cours {
    @Id
    private String id;
    private String nomCours;
    private String description;
    private Integer duree; // en heures
    private String classe; // Classe correspondante
    // Getters et setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNomCours() { return nomCours; }
    public void setNomCours(String nomCours) { this.nomCours = nomCours; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getDuree() { return duree; }
    public void setDuree(Integer duree) { this.duree = duree; }
    public String getClasse() { return classe; }
    public void setClasse(String classe) { this.classe = classe; }
} 
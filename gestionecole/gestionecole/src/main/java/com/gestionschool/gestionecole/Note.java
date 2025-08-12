package com.gestionschool.gestionecole;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notes")
public class Note {
    @Id
    private String id;
    private String matriculeEleve;
    private String nomCours;
    private String classe; // Classe pour laquelle la note a été donnée
    private Double valeur;
    private String typeEvaluation; // Contrôle, Examen, TP, etc.
    private String dateEvaluation;
    private String observation;
    // Getters et setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getMatriculeEleve() { return matriculeEleve; }
    public void setMatriculeEleve(String matriculeEleve) { this.matriculeEleve = matriculeEleve; }
    public String getNomCours() { return nomCours; }
    public void setNomCours(String nomCours) { this.nomCours = nomCours; }
    public String getClasse() { return classe; }
    public void setClasse(String classe) { this.classe = classe; }
    public Double getValeur() { return valeur; }
    public void setValeur(Double valeur) { this.valeur = valeur; }
    public String getTypeEvaluation() { return typeEvaluation; }
    public void setTypeEvaluation(String typeEvaluation) { this.typeEvaluation = typeEvaluation; }
    public String getDateEvaluation() { return dateEvaluation; }
    public void setDateEvaluation(String dateEvaluation) { this.dateEvaluation = dateEvaluation; }
    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }
} 
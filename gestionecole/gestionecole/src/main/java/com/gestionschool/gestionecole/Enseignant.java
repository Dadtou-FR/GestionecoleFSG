package com.gestionschool.gestionecole;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "enseignants")
public class Enseignant {
    @Id
    private String id;
    private String nomEnseignant;
    private String prenomEnseignant;
    private String specialite;
    private String telephone;
    private String email;
    // Getters et setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNomEnseignant() { return nomEnseignant; }
    public void setNomEnseignant(String nomEnseignant) { this.nomEnseignant = nomEnseignant; }
    public String getPrenomEnseignant() { return prenomEnseignant; }
    public void setPrenomEnseignant(String prenomEnseignant) { this.prenomEnseignant = prenomEnseignant; }
    public String getSpecialite() { return specialite; }
    public void setSpecialite(String specialite) { this.specialite = specialite; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
} 
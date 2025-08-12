package com.gestionschool.gestionecole;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "scolarites")
public class Scolarite {
    @Id
    private String id;
    private String matriculeEleve;
    private String nomEleve;
    private String nomClasse;
    private Double montantAnnuel;
    private Double montantMensuel;
    private String mois;
    private Integer annee;
    private Double montantPaye;
    private String datePaiement;
    private String modePaiement;
    private String statut;
    private String observation;
    
    // Constructeurs
    public Scolarite() {}
    
    public Scolarite(String matriculeEleve, String nomEleve, String nomClasse, Double montantAnnuel, 
                     String mois, Integer annee, Double montantPaye, String datePaiement, 
                     String modePaiement, String statut) {
        this.matriculeEleve = matriculeEleve;
        this.nomEleve = nomEleve;
        this.nomClasse = nomClasse;
        this.montantAnnuel = montantAnnuel;
        this.montantMensuel = montantAnnuel / 12.0;
        this.mois = mois;
        this.annee = annee;
        this.montantPaye = montantPaye;
        this.datePaiement = datePaiement;
        this.modePaiement = modePaiement;
        this.statut = statut;
    }
    
    // Getters et setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getMatriculeEleve() { return matriculeEleve; }
    public void setMatriculeEleve(String matriculeEleve) { this.matriculeEleve = matriculeEleve; }
    
    public String getNomEleve() { return nomEleve; }
    public void setNomEleve(String nomEleve) { this.nomEleve = nomEleve; }
    
    public String getNomClasse() { return nomClasse; }
    public void setNomClasse(String nomClasse) { this.nomClasse = nomClasse; }
    
    public Double getMontantAnnuel() { return montantAnnuel; }
    public void setMontantAnnuel(Double montantAnnuel) { 
        this.montantAnnuel = montantAnnuel; 
        this.montantMensuel = montantAnnuel / 12.0;
    }
    
    public Double getMontantMensuel() { return montantMensuel; }
    public void setMontantMensuel(Double montantMensuel) { this.montantMensuel = montantMensuel; }
    
    public String getMois() { return mois; }
    public void setMois(String mois) { this.mois = mois; }
    
    public Integer getAnnee() { return annee; }
    public void setAnnee(Integer annee) { this.annee = annee; }
    
    public Double getMontantPaye() { return montantPaye; }
    public void setMontantPaye(Double montantPaye) { this.montantPaye = montantPaye; }
    
    public String getDatePaiement() { return datePaiement; }
    public void setDatePaiement(String datePaiement) { this.datePaiement = datePaiement; }
    
    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }
    
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    
    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }
} 
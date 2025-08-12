package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EmargementService {
    @Autowired
    private EmargementRepository emargementRepository;

    public List<Emargement> getAllEmargements() {
        return emargementRepository.findAll();
    }
    public Optional<Emargement> getEmargementById(String id) {
        return emargementRepository.findById(id);
    }
    public Emargement saveEmargement(Emargement emargement) {
        return emargementRepository.save(emargement);
    }
    public void deleteEmargement(String id) {
        emargementRepository.deleteById(id);
    }
} 
package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ScolariteService {
    @Autowired
    private ScolariteRepository scolariteRepository;

    public List<Scolarite> getAllScolarites() {
        return scolariteRepository.findAll();
    }
    public Optional<Scolarite> getScolariteById(String id) {
        return scolariteRepository.findById(id);
    }
    public Scolarite saveScolarite(Scolarite scolarite) {
        return scolariteRepository.save(scolarite);
    }
    public void deleteScolarite(String id) {
        scolariteRepository.deleteById(id);
    }
} 
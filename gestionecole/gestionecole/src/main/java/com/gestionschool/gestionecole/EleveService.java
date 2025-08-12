package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EleveService {
    @Autowired
    private EleveRepository eleveRepository;

    public List<Eleve> getAllEleves() {
        return eleveRepository.findAll();
    }
    public Optional<Eleve> getEleveById(String id) {
        return eleveRepository.findById(id);
    }
    public Eleve saveEleve(Eleve eleve) {
        return eleveRepository.save(eleve);
    }
    public void deleteEleve(String id) {
        eleveRepository.deleteById(id);
    }
} 
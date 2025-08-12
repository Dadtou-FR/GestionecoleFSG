package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CoursService {
    @Autowired
    private CoursRepository coursRepository;

    public List<Cours> getAllCours() {
        return coursRepository.findAll();
    }
    
    public List<Cours> getCoursByClasse(String classe) {
        return coursRepository.findByClasse(classe);
    }
    
    public Optional<Cours> getCoursById(String id) {
        return coursRepository.findById(id);
    }
    public Cours saveCours(Cours cours) {
        return coursRepository.save(cours);
    }
    public void deleteCours(String id) {
        coursRepository.deleteById(id);
    }
} 
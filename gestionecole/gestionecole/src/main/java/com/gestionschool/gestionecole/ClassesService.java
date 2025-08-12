package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClassesService {
    @Autowired
    private ClassesRepository classesRepository;

    public List<Classes> getAllClasses() {
        return classesRepository.findAll();
    }
    public Optional<Classes> getClasseById(String id) {
        return classesRepository.findById(id);
    }
    public Classes saveClasse(Classes classe) {
        return classesRepository.save(classe);
    }
    public void deleteClasse(String id) {
        classesRepository.deleteById(id);
    }
} 
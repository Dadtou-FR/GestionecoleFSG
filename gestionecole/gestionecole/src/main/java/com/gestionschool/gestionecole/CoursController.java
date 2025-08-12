package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cours")
public class CoursController {
    @Autowired
    private CoursService coursService;

    @GetMapping
    public List<Cours> getAllCours() {
        return coursService.getAllCours();
    }
    
    @GetMapping("/classe/{classe}")
    public List<Cours> getCoursByClasse(@PathVariable String classe) {
        return coursService.getCoursByClasse(classe);
    }
    
    @GetMapping("/{id}")
    public Optional<Cours> getCoursById(@PathVariable String id) {
        return coursService.getCoursById(id);
    }
    @PostMapping
    public Cours createCours(@RequestBody Cours cours) {
        return coursService.saveCours(cours);
    }
    @PutMapping("/{id}")
    public Cours updateCours(@PathVariable String id, @RequestBody Cours cours) {
        cours.setId(id);
        return coursService.saveCours(cours);
    }
    @DeleteMapping("/{id}")
    public void deleteCours(@PathVariable String id) {
        coursService.deleteCours(id);
    }
} 
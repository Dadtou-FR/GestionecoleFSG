package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/classes")
public class ClassesController {
    @Autowired
    private ClassesService classesService;

    @GetMapping
    public List<Classes> getAllClasses() {
        return classesService.getAllClasses();
    }
    @GetMapping("/{id}")
    public Optional<Classes> getClasseById(@PathVariable String id) {
        return classesService.getClasseById(id);
    }
    @PostMapping
    public Classes createClasse(@RequestBody Classes classe) {
        return classesService.saveClasse(classe);
    }
    @PutMapping("/{id}")
    public Classes updateClasse(@PathVariable String id, @RequestBody Classes classe) {
        classe.setId(id);
        return classesService.saveClasse(classe);
    }
    @DeleteMapping("/{id}")
    public void deleteClasse(@PathVariable String id) {
        classesService.deleteClasse(id);
    }
} 
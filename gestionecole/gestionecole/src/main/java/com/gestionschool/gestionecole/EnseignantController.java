package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enseignants")
public class EnseignantController {
    @Autowired
    private EnseignantService enseignantService;

    @GetMapping
    public List<Enseignant> getAllEnseignants() {
        return enseignantService.getAllEnseignants();
    }
    @GetMapping("/{id}")
    public Optional<Enseignant> getEnseignantById(@PathVariable String id) {
        return enseignantService.getEnseignantById(id);
    }
    @PostMapping
    public Enseignant createEnseignant(@RequestBody Enseignant enseignant) {
        return enseignantService.saveEnseignant(enseignant);
    }
    @PutMapping("/{id}")
    public Enseignant updateEnseignant(@PathVariable String id, @RequestBody Enseignant enseignant) {
        enseignant.setId(id);
        return enseignantService.saveEnseignant(enseignant);
    }
    @DeleteMapping("/{id}")
    public void deleteEnseignant(@PathVariable String id) {
        enseignantService.deleteEnseignant(id);
    }
} 
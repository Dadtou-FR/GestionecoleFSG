package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/emargements")
public class EmargementController {
    @Autowired
    private EmargementService emargementService;

    @GetMapping
    public List<Emargement> getAllEmargements() {
        return emargementService.getAllEmargements();
    }
    @GetMapping("/{id}")
    public Optional<Emargement> getEmargementById(@PathVariable String id) {
        return emargementService.getEmargementById(id);
    }
    @PostMapping
    public Emargement createEmargement(@RequestBody Emargement emargement) {
        return emargementService.saveEmargement(emargement);
    }
    @PutMapping("/{id}")
    public Emargement updateEmargement(@PathVariable String id, @RequestBody Emargement emargement) {
        emargement.setId(id);
        return emargementService.saveEmargement(emargement);
    }
    @DeleteMapping("/{id}")
    public void deleteEmargement(@PathVariable String id) {
        emargementService.deleteEmargement(id);
    }
} 
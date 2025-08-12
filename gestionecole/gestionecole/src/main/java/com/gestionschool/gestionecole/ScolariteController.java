package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/scolarites")
public class ScolariteController {
    @Autowired
    private ScolariteService scolariteService;

    @GetMapping
    public List<Scolarite> getAllScolarites() {
        return scolariteService.getAllScolarites();
    }
    @GetMapping("/{id}")
    public Optional<Scolarite> getScolariteById(@PathVariable String id) {
        return scolariteService.getScolariteById(id);
    }
    @PostMapping
    public Scolarite createScolarite(@RequestBody Scolarite scolarite) {
        return scolariteService.saveScolarite(scolarite);
    }
    @PutMapping("/{id}")
    public Scolarite updateScolarite(@PathVariable String id, @RequestBody Scolarite scolarite) {
        scolarite.setId(id);
        return scolariteService.saveScolarite(scolarite);
    }
    @DeleteMapping("/{id}")
    public void deleteScolarite(@PathVariable String id) {
        scolariteService.deleteScolarite(id);
    }
} 
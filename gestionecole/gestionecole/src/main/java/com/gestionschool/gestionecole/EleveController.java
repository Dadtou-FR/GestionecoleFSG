package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/eleves")
public class EleveController {
    @Autowired
    private EleveService eleveService;

    @GetMapping
    public List<Eleve> getAllEleves() {
        return eleveService.getAllEleves();
    }
    @GetMapping("/{id}")
    public Optional<Eleve> getEleveById(@PathVariable String id) {
        return eleveService.getEleveById(id);
    }
    @PostMapping
    public Eleve createEleve(@RequestBody Eleve eleve) {
        return eleveService.saveEleve(eleve);
    }
    @PutMapping("/{id}")
    public Eleve updateEleve(@PathVariable String id, @RequestBody Eleve eleve) {
        eleve.setId(id);
        return eleveService.saveEleve(eleve);
    }
    @DeleteMapping("/{id}")
    public void deleteEleve(@PathVariable String id) {
        eleveService.deleteEleve(id);
    }
} 
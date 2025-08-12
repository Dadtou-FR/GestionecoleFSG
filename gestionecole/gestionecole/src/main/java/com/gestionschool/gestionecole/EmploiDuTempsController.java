package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/emploisdutemps")
public class EmploiDuTempsController {
    @Autowired
    private EmploiDuTempsService emploiDuTempsService;

    @GetMapping
    public List<EmploiDuTemps> getAllEmploisDuTemps() {
        return emploiDuTempsService.getAllEmploisDuTemps();
    }
    @GetMapping("/{id}")
    public Optional<EmploiDuTemps> getEmploiDuTempsById(@PathVariable String id) {
        return emploiDuTempsService.getEmploiDuTempsById(id);
    }
    @PostMapping
    public EmploiDuTemps createEmploiDuTemps(@RequestBody EmploiDuTemps emploiDuTemps) {
        return emploiDuTempsService.saveEmploiDuTemps(emploiDuTemps);
    }
    @PutMapping("/{id}")
    public EmploiDuTemps updateEmploiDuTemps(@PathVariable String id, @RequestBody EmploiDuTemps emploiDuTemps) {
        emploiDuTemps.setId(id);
        return emploiDuTempsService.saveEmploiDuTemps(emploiDuTemps);
    }
    @DeleteMapping("/{id}")
    public void deleteEmploiDuTemps(@PathVariable String id) {
        emploiDuTempsService.deleteEmploiDuTemps(id);
    }
} 
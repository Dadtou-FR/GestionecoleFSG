package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EmploiDuTempsService {
    @Autowired
    private EmploiDuTempsRepository emploiDuTempsRepository;

    public List<EmploiDuTemps> getAllEmploisDuTemps() {
        return emploiDuTempsRepository.findAll();
    }
    public Optional<EmploiDuTemps> getEmploiDuTempsById(String id) {
        return emploiDuTempsRepository.findById(id);
    }
    public EmploiDuTemps saveEmploiDuTemps(EmploiDuTemps emploiDuTemps) {
        return emploiDuTempsRepository.save(emploiDuTemps);
    }
    public void deleteEmploiDuTemps(String id) {
        emploiDuTempsRepository.deleteById(id);
    }
} 
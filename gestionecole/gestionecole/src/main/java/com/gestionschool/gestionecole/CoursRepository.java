package com.gestionschool.gestionecole;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CoursRepository extends MongoRepository<Cours, String> {
    List<Cours> findByClasse(String classe);
} 
package com.gestionschool.gestionecole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NoteService {
    @Autowired
    private NoteRepository noteRepository;

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }
    public Optional<Note> getNoteById(String id) {
        return noteRepository.findById(id);
    }
    public Note saveNote(Note note) {
        return noteRepository.save(note);
    }
    public void deleteNote(String id) {
        noteRepository.deleteById(id);
    }
} 
package com.plotrend.backend.controller;

import com.plotrend.backend.importer.ImdbDataImporter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/import")
public class ImportController {

    private final ImdbDataImporter importer;

    public ImportController(ImdbDataImporter importer) {
        this.importer = importer;
    }

    @PostMapping
    public ResponseEntity<String> triggerImport() {
        try {
            importer.runImport();
            return ResponseEntity.ok("Import started successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Import failed: " + e.getMessage());
        }
    }
}
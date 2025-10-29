package com.avinash.urlshortener.controller;

import com.avinash.urlshortener.model.UrlEntity;
import com.avinash.urlshortener.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // ✅ allow all frontend origins
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    // 🔹 Create a new short URL
    @PostMapping("/shorten")
    public ResponseEntity<UrlEntity> shortenUrl(@RequestBody Map<String, String> request) {
        String originalUrl = request.get("originalUrl"); // ✅ matches frontend JSON key

        if (originalUrl == null || originalUrl.isBlank()) {
            throw new IllegalArgumentException("Original URL cannot be empty");
        }

        UrlEntity entity = new UrlEntity();
        entity.setLongUrl(originalUrl); // ✅ set long URL before saving

        UrlEntity saved = urlService.createShortUrl(entity);
        return ResponseEntity.ok(saved);
    }

    // 🔹 Redirect or fetch long URL
    @GetMapping("/{shortCode}")
    public ResponseEntity<String> getOriginalUrl(@PathVariable String shortCode) {
        String longUrl = urlService.getOriginalUrl(shortCode);
        return ResponseEntity.ok(longUrl);
    }

    // 🔹 Get all URLs
    @GetMapping("/all")
    public ResponseEntity<List<UrlEntity>> getAllUrls() {
        return ResponseEntity.ok(urlService.findAll());
    }

    // 🔹 Delete by short code
    @DeleteMapping("/{shortCode}")
    public ResponseEntity<String> deleteUrl(@PathVariable String shortCode) {
        boolean deleted = urlService.deleteByShortCode(shortCode);
        if (deleted) {
            return ResponseEntity.ok("Deleted successfully");
        } else {
            return ResponseEntity.badRequest().body("Short code not found");
        }
    }
}

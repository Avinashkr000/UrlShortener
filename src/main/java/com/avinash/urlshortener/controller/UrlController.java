package com.avinash.urlshortener.controller;

import com.avinash.urlshortener.dto.ShortenRequest;
import com.avinash.urlshortener.dto.ShortenResponse;
import com.avinash.urlshortener.exception.NotFoundException;
import com.avinash.urlshortener.model.UrlEntity;
import com.avinash.urlshortener.service.UrlService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    @GetMapping("/{code}")
    public void redirect(@PathVariable("code") String code, HttpServletResponse response) throws IOException {
        try {
            String original = urlService.findByShortCode(code).getLongUrl();
            response.setStatus(HttpServletResponse.SC_FOUND); // 302
            response.setHeader("Location", original);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Short URL not found");
        }
    }

    // 🔹 Create short URL
    @PostMapping("/shorten")
    public ResponseEntity<ShortenResponse> shortenUrl(@Valid @RequestBody ShortenRequest req) {
        UrlEntity entity = new UrlEntity();
        entity.setLongUrl(req.getLongUrl());
        entity.setExpiryAt(req.getExpiryAt());

        UrlEntity saved = urlService.createShortUrl(entity);

        String shortUrl = baseUrl.endsWith("/")
                ? baseUrl + saved.getShortCode()
                : baseUrl + "/" + saved.getShortCode();

        return ResponseEntity.created(URI.create(shortUrl))
                .body(new ShortenResponse(saved.getShortCode(), shortUrl));
    }

    // 🔹 Get all URLs (with full short URL dynamically)
    @GetMapping("/all")
    public List<UrlEntity> findAll() {
        List<UrlEntity> urls = urlService.findAll();
        urls.forEach(url -> {
            String fullShortUrl = baseUrl.endsWith("/")
                    ? baseUrl + url.getShortCode()
                    : baseUrl + "/" + url.getShortCode();
            url.setShortUrl(fullShortUrl);
        });
        return urls;
    }

    // 🔹 Delete URL by shortCode (case-insensitive)
    @DeleteMapping("/{shortCode}")
    public ResponseEntity<Void> delete(@PathVariable String shortCode) {
        boolean removed = urlService.deleteByShortCode(shortCode.trim());
        if (!removed) {
            throw new NotFoundException("Short code not found: " + shortCode);
        }
        return ResponseEntity.noContent().build();
    }
}

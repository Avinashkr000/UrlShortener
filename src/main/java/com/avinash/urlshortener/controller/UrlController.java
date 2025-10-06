package com.avinash.urlshortener.controller;

import com.avinash.urlshortener.dto.ShortenRequest;
import com.avinash.urlshortener.model.UrlEntity;
import com.avinash.urlshortener.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/url")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    @PostMapping("/shorten")
    public ResponseEntity<?> shortenUrl(@RequestBody /*@Valid if you have validation*/ ShortenRequest req) {
        // map DTO -> entity
        UrlEntity entity = new UrlEntity();
        entity.setLongUrl(req.getLongUrl());
        if (req.getExpiryAt() != null) {
            entity.setExpiryAt(req.getExpiryAt());
        } else {
            entity.setExpiryAt(LocalDateTime.now().plusDays(30));
        }
        UrlEntity saved = urlService.createShortUrl(entity);
        return ResponseEntity.status(201).body(saved);
    }
}

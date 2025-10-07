package com.avinash.urlshortener.controller;

import com.avinash.urlshortener.dto.ShortenRequest;
import com.avinash.urlshortener.dto.ShortenResponse;
import com.avinash.urlshortener.model.UrlEntity;
import com.avinash.urlshortener.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/url")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    @Value("${app.base-url:http://localhost:8080/}")
    private String baseUrl;

    @PostMapping("/shorten")
    public ResponseEntity<ShortenResponse> shortenUrl(@Valid @RequestBody ShortenRequest req) {
        UrlEntity entity = new UrlEntity();
        entity.setLongUrl(req.getLongUrl());
        entity.setExpiryAt(req.getExpiryAt()); // may be null -> service sets default
        UrlEntity saved = urlService.createShortUrl(entity);
        String shortUrl = baseUrl.endsWith("/") ? baseUrl + saved.getShortCode() : baseUrl + "/" + saved.getShortCode();
        return ResponseEntity.status(201).body(new ShortenResponse(saved.getShortCode(), shortUrl));
    }
}

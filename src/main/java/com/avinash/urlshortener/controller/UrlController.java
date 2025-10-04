package com.avinash.urlshortener.controller;

import com.avinash.urlshortener.dto.ShortenRequest;
import com.avinash.urlshortener.dto.ShortenResponse;
import com.avinash.urlshortener.model.UrlEntity;
import com.avinash.urlshortener.service.UrlService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/url")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    @PostMapping("/shorten")
    public ResponseEntity<ShortenResponse> shortenUrl(@Valid @RequestBody ShortenRequest request) {
        String shortUrl = urlService.createShortUrl(request);
        return new ResponseEntity<>(new ShortenResponse(shortUrl), HttpStatus.CREATED);
    }

    @GetMapping("/info/{alias}")
    public ResponseEntity<?> getUrlInfo(@PathVariable String alias) {
        UrlEntity url = urlService.getUrlByAlias(alias);
        if (url == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Alias not found"));
        }
        return ResponseEntity.ok(url);
    }

}
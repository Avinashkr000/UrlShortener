package com.avinash.urlshortener.controller;

import com.avinash.urlshortener.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class RedirectController {

    private final UrlService urlService;

    @GetMapping("/{code}")
    public void redirect(@PathVariable("code") String code, HttpServletResponse response) throws IOException {
        try {
            String original = urlService.getOriginalUrl(code);
            response.setStatus(HttpServletResponse.SC_FOUND); // 302
            response.setHeader("Location", original);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Short URL not found");
        }
    }
}

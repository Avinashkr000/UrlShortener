package com.avinash.urlshortener.controller;

import com.avinash.urlshortener.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@RequiredArgsConstructor
public class RedirectController {

    private final UrlService urlService;

    @GetMapping("/{code}")
    public void redirect(@PathVariable("code") String code, HttpServletResponse response) {
        try {
            String original = urlService.getOriginalUrl(code);
            response.setStatus(HttpServletResponse.SC_FOUND); // 302
            response.setHeader("Location", original);
        } catch (Exception ex) {
            // return 404 if not found
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Short URL not found");
        }
    }
}

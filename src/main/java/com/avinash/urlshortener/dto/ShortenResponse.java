package com.avinash.urlshortener.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShortenResponse {
    private final String shortCode;
    private final String shortUrl;
}

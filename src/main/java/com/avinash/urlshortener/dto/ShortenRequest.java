package com.avinash.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ShortenRequest {
    @NotBlank
    private String longUrl;

    // optional expiry
    private LocalDateTime expiryAt;
}

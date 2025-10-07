package com.avinash.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ShortenRequest {

    @NotBlank(message = "Long URL is required")
    private String longUrl;

    // optional custom alias (like bit.ly/mybrand)
    @Pattern(regexp = "^[a-zA-Z0-9-_]{3,32}$", message = "Alias can only contain letters, digits, -, _")
    private String customAlias;

    // optional expiry in days (default from properties)
    private Integer expiryInDays;

    public LocalDateTime getExpiryAt() {
        if (expiryInDays == null) {
            return null;
        }
        return LocalDateTime.now().plusDays(expiryInDays);
    }

    public void getExpiryInDays(LocalDateTime localDateTime) {

    }
}

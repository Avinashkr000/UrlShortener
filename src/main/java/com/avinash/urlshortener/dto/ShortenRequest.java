package com.avinash.urlshortener.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class ShortenRequest {

    @NotBlank(message = "URL must not be blank")
    @Size(max = 2048, message = "URL is too long")
    @Pattern(regexp = "^(https?://).+", message = "URL must start with http:// or https://")
    private String longUrl;

    @Future(message = "Expiry must be in the future")
    private LocalDateTime expiryAt;

    public String getLongUrl() { return longUrl; }
    public void setLongUrl(String longUrl) { this.longUrl = longUrl; }
    public LocalDateTime getExpiryAt() { return expiryAt; }
    public void setExpiryAt(LocalDateTime expiryAt) { this.expiryAt = expiryAt; }
}

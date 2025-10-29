package com.avinash.urlshortener.service;

import com.avinash.urlshortener.exception.NotFoundException;
import com.avinash.urlshortener.model.UrlEntity;
import com.avinash.urlshortener.repository.UrlRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;

@Service
@RequiredArgsConstructor
public class UrlService {

    private final UrlRepository urlRepository;
    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();
    private ScheduledExecutorService cleaner;

    @Value("${app.cache.ttl-hours:6}")
    private long ttlHours;

    @Value("${app.default-expiry-days:30}")
    private long defaultExpiryDays;

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final char[] BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".toCharArray();

    @PostConstruct
    public void init() {
        cleaner = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r);
            t.setDaemon(true);
            t.setName("cache-cleaner");
            return t;
        });
        cleaner.scheduleAtFixedRate(this::cleanupCache, 1, 1, TimeUnit.MINUTES);
    }

    @PreDestroy
    public void shutdown() {
        if (cleaner != null) cleaner.shutdown();
    }

    // 🔹 Create a new short URL
    public UrlEntity createShortUrl(UrlEntity entity) {
        if (entity.getLongUrl() == null || entity.getLongUrl().isBlank()) {
            throw new IllegalArgumentException("Long URL cannot be null or empty");
        }

        if (entity.getExpiryAt() == null) {
            entity.setExpiryAt(LocalDateTime.now().plusDays(defaultExpiryDays));
        }

        String shortCode = generateUniqueShortCode();
        entity.setShortCode(shortCode);
        entity.setCreatedAt(LocalDateTime.now());
        if (entity.getClickCount() == null) entity.setClickCount(0L);

        UrlEntity saved = urlRepository.save(entity);
        cache.put(shortCode, new CacheEntry(saved.getLongUrl(), LocalDateTime.now().plusHours(ttlHours)));
        return saved;
    }

    // 🔹 Delete URL safely (case-insensitive)
    public boolean deleteByShortCode(String shortCode) {
        return urlRepository.findByShortCodeIgnoreCase(shortCode)
                .map(entity -> {
                    urlRepository.delete(entity);
                    cache.remove(shortCode);
                    return true;
                })
                .orElse(false);
    }

    // 🔹 Find by shortCode (with cache)
    public UrlEntity findByShortCode(String shortCode) {
        CacheEntry ce = cache.get(shortCode);
        if (ce != null && !ce.isExpired()) {
            incrementClickCount(shortCode);
            return urlRepository.findByShortCodeIgnoreCase(shortCode)
                    .orElseThrow(() -> new NotFoundException("Short code not found: " + shortCode));
        }

        return urlRepository.findByShortCodeIgnoreCase(shortCode)
                .map(entity -> {
                    cache.put(shortCode, new CacheEntry(entity.getLongUrl(), LocalDateTime.now().plusHours(ttlHours)));
                    incrementClickCount(shortCode);
                    return entity;
                })
                .orElseThrow(() -> new NotFoundException("Short code not found: " + shortCode));
    }

    // 🔹 Get original URL
    public String getOriginalUrl(String shortCode) {
        UrlEntity entity = findByShortCode(shortCode);
        return entity.getLongUrl();
    }

    // 🔹 Get all URLs
    public List<UrlEntity> findAll() {
        return urlRepository.findAll();
    }

    // 🔹 Cleanup expired URLs
    public int cleanupExpiredUrls(LocalDateTime now) {
        return urlRepository.deleteByExpiryAtBefore(now);
    }

    // 🔹 Increment click count
    private void incrementClickCount(String shortCode) {
        urlRepository.incrementClicks(shortCode, LocalDateTime.now());
    }

    // 🔹 Generate a unique short code
    private String generateUniqueShortCode() {
        String code;
        int attempts = 0;
        do {
            code = generateShortCode();
            attempts++;
        } while (urlRepository.existsByShortCode(code) && attempts < 50);

        if (attempts >= 50)
            throw new IllegalStateException("Unable to generate unique short code");

        return code;
    }

    // 🔹 Base62 short code generator
    private String generateShortCode() {
        byte[] bytes = new byte[5];
        RANDOM.nextBytes(bytes);
        return toBase62(bytes).substring(0, 6);
    }

    private String toBase62(byte[] input) {
        StringBuilder sb = new StringBuilder();
        long num = 0;
        for (byte b : input) num = (num << 8) | (b & 0xFF);
        while (num > 0) {
            int idx = (int) (num % 62);
            sb.append(BASE62[idx]);
            num /= 62;
        }
        return sb.reverse().toString();
    }

    // 🔹 Background cache cleaner
    private void cleanupCache() {
        LocalDateTime now = LocalDateTime.now();
        cache.entrySet().removeIf(e -> e.getValue().isExpiredAt(now));
    }

    // 🔹 Cache Entry Inner Class
    private static class CacheEntry {
        final String value;
        final LocalDateTime expiryAt;

        CacheEntry(String v, LocalDateTime expiryAt) {
            this.value = v;
            this.expiryAt = expiryAt;
        }

        boolean isExpired() {
            return isExpiredAt(LocalDateTime.now());
        }

        boolean isExpiredAt(LocalDateTime t) {
            return !expiryAt.isAfter(t);
        }
    }
}

package com.avinash.urlshortener.service;


import com.avinash.urlshortener.model.UrlEntity;
import com.avinash.urlshortener.repository.UrlRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UrlService {

    private final UrlRepository urlRepository;
    private final RedisTemplate<String, String> redisTemplate;

    public UrlEntity createShortUrl(UrlEntity entity) {
        if (entity.getShortCode() == null || entity.getShortCode().isBlank()) {
            entity.setShortCode(generateShortCode());
        }
        if (entity.getClickCount() == null) {
            entity.setClickCount(0L);
        }
        return urlRepository.save(entity);
    }

    public UrlEntity resolveShortCode(String shortCode) {
        // returns UrlEntity or throw if not present
        return urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short code not found"));
    }

    public String getOriginalUrl(String shortCode) {
        String cacheKey = "url:" + shortCode;
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            // increment click count in background / sync
            incrementClickCount(shortCode);
            return cached;
        }

        UrlEntity entity = resolveShortCode(shortCode);
        // cache the long URL for 24 hours (adjust as needed)
        redisTemplate.opsForValue().set(cacheKey, entity.getLongUrl(), Duration.ofHours(24));
        incrementClickCount(shortCode);
        return entity.getLongUrl();
    }

    private void incrementClickCount(String shortCode) {
        urlRepository.findByShortCode(shortCode).ifPresent(entity -> {
            entity.setClickCount(entity.getClickCount() + 1);
            entity.setLastClickedAt(LocalDateTime.now());
            urlRepository.save(entity);
        });
    }

    private String generateShortCode() {
        // Simple generator — replace with collision-resistant logic in production
        return Long.toString(System.currentTimeMillis(), 36).substring(6);
    }
}

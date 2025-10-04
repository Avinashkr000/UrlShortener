package com.avinash.urlshortener.service;

import com.avinash.urlshortener.dto.ShortenRequest;
import com.avinash.urlshortener.model.UrlEntity;
import com.avinash.urlshortener.repository.UrlRepository;
import com.avinash.urlshortener.util.Base62;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class UrlService {

    private final UrlRepository urlRepository;
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.default-expiry-days:30}")
    private int defaultExpiryDays;

    private AtomicLong counter = new AtomicLong();

    @PostConstruct
    public void init() {
        // initialize counter with highest existing ID
        Long maxId = urlRepository.findAll().stream()
                .mapToLong(UrlEntity::getId)
                .max()
                .orElse(0L);
        counter.set(maxId + 1);
    }

    @Transactional
    public String createShortUrl(ShortenRequest request) {
        // if custom alias requested
        if (request.getCustomAlias() != null && !request.getCustomAlias().isBlank()) {
            if (urlRepository.existsByShortCode(request.getCustomAlias())) {
                throw new RuntimeException("Custom alias already in use");
            }
            UrlEntity customEntity = UrlEntity.builder()
                    .shortCode(request.getCustomAlias())
                    .longUrl(request.getLongUrl())
                    .createdAt(LocalDateTime.now())
                    .expiryAt(expiryDate(request.getExpiryInDays()))
                    .clickCount(0L)
                    .build();
            urlRepository.save(customEntity);
            redisTemplate.opsForValue().set(request.getCustomAlias(), request.getLongUrl());
            return baseUrl + request.getCustomAlias();
        }

        // generate random code
        long id = counter.getAndIncrement();
        String shortCode = Base62.encode(id);

        UrlEntity entity = UrlEntity.builder()
                .shortCode(shortCode)
                .longUrl(request.getLongUrl())
                .createdAt(LocalDateTime.now())
                .expiryAt(expiryDate(request.getExpiryInDays()))
                .clickCount(0L)
                .build();

        urlRepository.save(entity);
        redisTemplate.opsForValue().set(shortCode, request.getLongUrl());

        return baseUrl + shortCode;
    }

    private LocalDateTime expiryDate(Integer days) {
        return LocalDateTime.now().plusDays(days != null ? days : defaultExpiryDays);
    }

    @Transactional
    public String resolveShortCode(String shortCode) {
        // check cache first
        String cachedUrl = redisTemplate.opsForValue().get(shortCode);
        if (cachedUrl != null) {
            updateAnalytics(shortCode);
            return cachedUrl;
        }

        UrlEntity entity = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short URL not found"));

        if (entity.getExpiryAt() != null && entity.getExpiryAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Short URL expired");
        }

        redisTemplate.opsForValue().set(shortCode, entity.getLongUrl());
        updateAnalytics(entity);
        return entity.getLongUrl();
    }

    private void updateAnalytics(String shortCode) {
        urlRepository.findByShortCode(shortCode)
                .ifPresent(this::updateAnalytics);
    }

    private void updateAnalytics(UrlEntity entity) {
        entity.setClickCount(entity.getClickCount() + 1);
        entity.setLastClickedAt(LocalDateTime.now());
        urlRepository.save(entity);
    }

    public UrlEntity getUrlByAlias(String alias) {
        return urlRepository.findByShortCode(alias).orElse(null);
    }

}

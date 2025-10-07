package com.avinash.urlshortener.service;

import com.avinash.urlshortener.model.UrlEntity;
import com.avinash.urlshortener.repository.UrlRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.*;

@Service
@RequiredArgsConstructor
public class UrlService {

    private final UrlRepository urlRepository;

    // Simple in-memory cache to avoid external dependencies; key->(value, expiry)
    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();

    // Scheduled executor to cleanup expired cache entries
    private ScheduledExecutorService cleaner;

    // default cache TTL
    private static final Duration CACHE_TTL = Duration.ofHours(6);

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

    public UrlEntity createShortUrl(UrlEntity entity) {
        // create unique short code
        String shortCode = generateShortCode();
        int safety = 0;
        while (urlRepository.existsByShortCode(shortCode) && safety++ < 10) {
            shortCode = generateShortCode();
        }
        entity.setShortCode(shortCode);
        entity.setCreatedAt(LocalDateTime.now());
        if (entity.getClickCount() == null) entity.setClickCount(0L);
        if (entity.getExpiryAt() == null) entity.setExpiryAt(LocalDateTime.now().plusDays(30));
        UrlEntity saved = urlRepository.save(entity);

        // cache for quick lookup
        cache.put(shortCode, new CacheEntry(saved.getLongUrl(), LocalDateTime.now().plus(CACHE_TTL)));
        return saved;
    }

    public UrlEntity findByShortCode(String shortCode) {
        // check cache
        CacheEntry ce = cache.get(shortCode);
        if (ce != null && !ce.isExpired()) {
            // still fetch entity to update clicks etc.
            Optional<UrlEntity> maybe = urlRepository.findByShortCode(shortCode);
            if (maybe.isPresent()) {
                incrementClickCount(shortCode);
                return maybe.get();
            } else {
                cache.remove(shortCode);
            }
        }

        // fallback to DB
        return urlRepository.findByShortCode(shortCode).map(entity -> {
            cache.put(shortCode, new CacheEntry(entity.getLongUrl(), LocalDateTime.now().plus(CACHE_TTL)));
            incrementClickCount(shortCode);
            return entity;
        }).orElseThrow(() -> new RuntimeException("Short code not found: " + shortCode));
    }

    public String getOriginalUrl(String shortCode) {
        UrlEntity ent = findByShortCode(shortCode);
        return ent.getLongUrl();
    }

    public int cleanupExpiredUrls(LocalDateTime now) {
        return urlRepository.deleteByExpiryAtBefore(now);
    }

    private void incrementClickCount(String shortCode) {
        urlRepository.findByShortCode(shortCode).ifPresent(entity -> {
            if (entity.getClickCount() == null) entity.setClickCount(0L);
            entity.setClickCount(entity.getClickCount() + 1);
            entity.setLastClickedAt(LocalDateTime.now());
            urlRepository.save(entity);
        });
    }

    private void cleanupCache() {
        LocalDateTime now = LocalDateTime.now();
        for (Map.Entry<String, CacheEntry> e : cache.entrySet()) {
            if (e.getValue().isExpiredAt(now)) {
                cache.remove(e.getKey());
            }
        }
    }

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
            return expiryAt.isBefore(t) || expiryAt.isEqual(t);
        }
    }

    private String generateShortCode() {
        // base36 of current time ms, last 6 chars
        String s = Long.toString(System.currentTimeMillis(), 36);
        if (s.length() > 6) return s.substring(s.length() - 6);
        return String.format("%6s", s).replace(' ', '0');
    }
}

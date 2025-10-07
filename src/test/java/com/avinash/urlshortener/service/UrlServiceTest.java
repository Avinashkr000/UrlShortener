package com.avinash.urlshortener.service;

import com.avinash.urlshortener.dto.ShortenRequest;
import com.avinash.urlshortener.model.UrlEntity;
import com.avinash.urlshortener.repository.UrlRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ActiveProfiles("test")

class UrlServiceTest {

    @Mock
    private UrlRepository urlRepository;

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private UrlService urlService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testShortenUrlSuccess() {
        ShortenRequest request = new ShortenRequest();
        request.setLongUrl("https://github.com/");
        request.setExpiryAt(LocalDateTime.now().plusDays(30));

        UrlEntity savedEntity = new UrlEntity();
        savedEntity.setShortCode("abc123");
        savedEntity.setLongUrl(request.getLongUrl());
        savedEntity.setExpiryAt(request.getExpiryAt());

        when(urlRepository.save(any(UrlEntity.class))).thenReturn(savedEntity);

        UrlEntity result = urlService.shortenUrl(request);
        assertNotNull(result);
        assertEquals("https://github.com/", result.getLongUrl());
    }

    @Test
    void testFindByShortCodeFromDB() {
        UrlEntity entity = new UrlEntity();
        entity.setShortCode("xyz");
        entity.setLongUrl("https://google.com");

        when(redisTemplate.opsForValue().get("xyz")).thenReturn(null);
        when(urlRepository.findByShortCode("xyz")).thenReturn(Optional.of(entity));

        UrlEntity result = urlService.findByShortCode("xyz");
        assertNotNull(result);
        assertEquals("https://google.com", result.getLongUrl());
    }

    @Test
    void testFindByShortCodeFromCache() {
        when(redisTemplate.opsForValue().get("cached")).thenReturn("https://cached.com");

        UrlEntity result = urlService.findByShortCode("cached");
        assertNotNull(result);
        assertEquals("https://cached.com", result.getLongUrl());
    }

    @Test
    void testFindByShortCodeNotFound() {
        when(redisTemplate.opsForValue().get("invalid")).thenReturn(null);
        when(urlRepository.findByShortCode("invalid")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> urlService.findByShortCode("invalid"));
    }
}

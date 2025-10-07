package com.avinash.urlshortener.scheduler;

import com.avinash.urlshortener.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@EnableScheduling
public class UrlCleanupScheduler {

    private final UrlService urlService;

    // runs every hour
    @Scheduled(cron = "0 0 * * * *")
    public void cleanupExpired() {
        urlService.cleanupExpiredUrls(LocalDateTime.now());
    }
}

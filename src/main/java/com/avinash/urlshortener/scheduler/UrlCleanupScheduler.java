package com.avinash.urlshortener.scheduler;

import com.avinash.urlshortener.repository.UrlRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class UrlCleanupScheduler {

    private final UrlRepository urlRepository;

    // Run every night at 12 AM
    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteExpiredUrls() {
        int deletedCount = urlRepository.deleteByExpiryAtBefore(LocalDateTime.now());
        log.info("🧹 Cleanup complete: {} expired URLs deleted", deletedCount);
    }
}

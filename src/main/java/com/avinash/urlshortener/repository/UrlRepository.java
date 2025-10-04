package com.avinash.urlshortener.repository;

import com.avinash.urlshortener.model.UrlEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UrlRepository extends JpaRepository<UrlEntity, Long> {
    Optional<UrlEntity> findByShortCode(String shortCode);
    boolean existsByShortCode(String shortCode);

    int deleteByExpiryAtBefore(LocalDateTime dateTime);
}

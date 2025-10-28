package com.avinash.urlshortener.repository;

import com.avinash.urlshortener.model.UrlEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UrlRepository extends JpaRepository<UrlEntity, Long> {

    Optional<UrlEntity> findByShortCodeIgnoreCase(String shortCode); // ✅ ignore case

    boolean existsByShortCode(String shortCode);

    int deleteByExpiryAtBefore(LocalDateTime cutoff);

    @Modifying
    @Transactional
    @Query("UPDATE UrlEntity u SET u.clickCount = COALESCE(u.clickCount, 0) + 1, u.lastClickedAt = :now WHERE LOWER(u.shortCode) = LOWER(:code)")
    int incrementClicks(@Param("code") String code, @Param("now") LocalDateTime now);
}

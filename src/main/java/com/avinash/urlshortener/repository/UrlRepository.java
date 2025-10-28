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

    Optional<UrlEntity> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);

    int deleteByExpiryAtBefore(LocalDateTime cutoff);

    @Modifying
    @Transactional
    @Query("update UrlEntity u set u.clickCount = coalesce(u.clickCount,0) + 1, u.lastClickedAt = :now where u.shortCode = :code")
    int incrementClicks(@Param("code") String code, @Param("now") LocalDateTime now);
}

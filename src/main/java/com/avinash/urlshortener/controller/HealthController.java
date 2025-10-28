package com.avinash.urlshortener.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getDetailedHealth() {
        Map<String, Object> health = new HashMap<>();
        boolean dbHealthy = isDatabaseHealthy();
        boolean redisHealthy = isRedisHealthy();
        String status = (dbHealthy && (redisTemplate == null || redisHealthy)) ? "UP" : "DOWN";
        health.put("status", status);
        health.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        health.put("components", Map.of(
                "database", Map.of("status", dbHealthy ? "UP" : "DOWN"),
                "redis", Map.of("status", redisTemplate == null ? "DISABLED" : (redisHealthy ? "UP" : "DOWN"))
        ));
        return ResponseEntity.ok(health);
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "pong");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    private boolean isDatabaseHealthy() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(5);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isRedisHealthy() {
        if (redisTemplate == null) return false;
        try {
            redisTemplate.opsForValue().set("health:check", "ok");
            Object result = redisTemplate.opsForValue().get("health:check");
            redisTemplate.delete("health:check");
            return "ok".equals(result);
        } catch (Exception e) {
            return false;
        }
    }
}

@Component
class CustomHealthIndicator implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public Health health() {
        boolean dbHealthy = isDatabaseHealthy();
        boolean redisHealthy = isRedisHealthy();
        Health.Builder b = dbHealthy ? Health.up() : Health.down();
        b.withDetail("database", dbHealthy ? "Connected" : "Disconnected");
        b.withDetail("redis", redisTemplate == null ? "Not configured" : (redisHealthy ? "Connected" : "Disconnected"));
        b.withDetail("timestamp", LocalDateTime.now());
        return b.build();
    }

    private boolean isDatabaseHealthy() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(5);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isRedisHealthy() {
        if (redisTemplate == null) return false;
        try {
            redisTemplate.opsForValue().set("health:indicator:check", "ok");
            Object result = redisTemplate.opsForValue().get("health:indicator:check");
            redisTemplate.delete("health:indicator:check");
            return "ok".equals(result);
        } catch (Exception e) {
            return false;
        }
    }
}

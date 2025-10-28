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

    @Autowired(required = false)  // Make Redis optional
    private RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getDetailedHealth() {
        Map<String, Object> health = new HashMap<>();

        try {
            boolean dbHealthy = isDatabaseHealthy();
            boolean redisHealthy = isRedisHealthy();
            String status = (dbHealthy && (redisTemplate == null || redisHealthy)) ? "UP" : "DOWN";

            health.put("status", status);
            health.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            health.put("components", Map.of(
                    "database", Map.of(
                            "status", dbHealthy ? "UP" : "DOWN",
                            "details", dbHealthy ? "MySQL connection successful" : "MySQL connection failed"
                    ),
                    "redis", Map.of(
                            "status", redisTemplate != null ? (redisHealthy ? "UP" : "DOWN") : "DISABLED",
                            "details", redisTemplate != null ?
                                    (redisHealthy ? "Redis connection successful" : "Redis connection failed") :
                                    "Redis not configured"
                    )
            ));
            health.put("application", Map.of(
                    "name", "URL Shortener Service",
                    "version", "1.0.0",
                    "java.version", System.getProperty("java.version"),
                    "spring.version", "3.3.x"
            ));

            return ResponseEntity.ok(health);

        } catch (Exception e) {
            health.put("status", "DOWN");
            health.put("error", e.getMessage());
            health.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            return ResponseEntity.status(503).body(health);
        }
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "pong");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("service", "URL Shortener API");
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
        if (redisTemplate == null) {
            return false;
        }
        try {
            redisTemplate.opsForValue().set("health:check", "ok");
            String result = (String) redisTemplate.opsForValue().get("health:check");
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

    @Autowired(required = false)  // Make Redis optional
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public Health health() {
        try {
            boolean dbHealthy = isDatabaseHealthy();
            boolean redisHealthy = isRedisHealthy();

            if (dbHealthy) {
                return Health.up()
                        .withDetail("database", "Connected")
                        .withDetail("redis", redisTemplate != null ?
                                (redisHealthy ? "Connected" : "Disconnected") : "Not configured")
                        .withDetail("service", "URL Shortener")
                        .withDetail("timestamp", LocalDateTime.now())
                        .build();
            } else {
                return Health.down()
                        .withDetail("database", "Disconnected")
                        .withDetail("redis", redisTemplate != null ?
                                (redisHealthy ? "Connected" : "Disconnected") : "Not configured")
                        .withDetail("service", "URL Shortener")
                        .build();
            }
        } catch (Exception e) {
            return Health.down(e)
                    .withDetail("service", "URL Shortener")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }

    private boolean isDatabaseHealthy() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(5);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isRedisHealthy() {
        if (redisTemplate == null) {
            return false;
        }
        try {
            redisTemplate.opsForValue().set("health:actuator:check", "ok");
            String result = (String) redisTemplate.opsForValue().get("health:actuator:check");
            redisTemplate.delete("health:actuator:check");
            return "ok".equals(result);
        } catch (Exception e) {
            return false;
        }
    }
}

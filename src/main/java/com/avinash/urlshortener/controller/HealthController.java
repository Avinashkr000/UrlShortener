package com.avinash.urlshortener.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuator.health.Health;
import org.springframework.boot.actuator.health.HealthIndicator;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
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
public class HealthController implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getDetailedHealth() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            // Check database connection
            boolean dbHealthy = isDatabaseHealthy();
            
            // Check Redis connection
            boolean redisHealthy = isRedisHealthy();
            
            // Overall status
            String status = (dbHealthy && redisHealthy) ? "UP" : "DOWN";
            
            health.put("status", status);
            health.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            health.put("components", Map.of(
                "database", Map.of(
                    "status", dbHealthy ? "UP" : "DOWN",
                    "details", dbHealthy ? "MySQL connection successful" : "MySQL connection failed"
                ),
                "redis", Map.of(
                    "status", redisHealthy ? "UP" : "DOWN",
                    "details", redisHealthy ? "Redis connection successful" : "Redis connection failed"
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
            return ResponseEntity.status(503).body(health);
        }
    }

    @Override
    public Health health() {
        try {
            boolean dbHealthy = isDatabaseHealthy();
            boolean redisHealthy = isRedisHealthy();
            
            if (dbHealthy && redisHealthy) {
                return Health.up()
                    .withDetail("database", "UP")
                    .withDetail("redis", "UP")
                    .withDetail("timestamp", LocalDateTime.now())
                    .build();
            } else {
                return Health.down()
                    .withDetail("database", dbHealthy ? "UP" : "DOWN")
                    .withDetail("redis", redisHealthy ? "UP" : "DOWN")
                    .build();
            }
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }

    private boolean isDatabaseHealthy() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(5); // 5 second timeout
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isRedisHealthy() {
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
package com.avinash.urlshortener.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void testHandleGenericException() {
        Exception ex = new Exception("Something went wrong");
        ResponseEntity<?> response = handler.handleGlobalException(ex);
        assertEquals(500, response.getStatusCode().value());
    }
}

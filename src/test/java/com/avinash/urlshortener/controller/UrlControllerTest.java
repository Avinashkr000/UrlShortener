package com.avinash.urlshortener.controller;

import com.avinash.urlshortener.dto.ShortenRequest;
import com.avinash.urlshortener.model.UrlEntity;
import com.avinash.urlshortener.service.UrlService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = UrlController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc
class UrlControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UrlService urlService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testShortenUrl_ShouldReturnCreatedShortUrl() throws Exception {
        ShortenRequest request = new ShortenRequest();
        request.setLongUrl("https://github.com/");
        request.getExpiryInDays(LocalDateTime.now().plusDays(7));

        UrlEntity mockEntity = new UrlEntity();
        mockEntity.setId(1L);
        mockEntity.setShortCode("abc123");
        mockEntity.setLongUrl("https://github.com/");
        mockEntity.setExpiryAt(request.getExpiryAt());
        mockEntity.setClickCount(0l);

        Mockito.when(urlService.createShortUrl(Mockito.any(UrlEntity.class)))
                .thenReturn(mockEntity);

        mockMvc.perform(post("/api/url/shorten")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))

                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.shortCode", is("abc123")))
                .andExpect(jsonPath("$.longUrl", is("https://github.com/")))
                .andExpect(jsonPath("$.expiryAt", notNullValue()))
                .andExpect(jsonPath("$.clickCount", is(0)));
    }
}

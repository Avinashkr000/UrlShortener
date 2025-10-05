package com.avinash.urlshortener.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("URL Shortener API 🚀")
                        .version("1.0.0")
                        .description("API documentation for the URL Shortener project built using Java & Spring Boot.")
                        .contact(new Contact()
                                .name("Avinash Kumar")
                                .email("ak749299.ak@gmail.com")
                                .url("https://github.com/Avinashkr000"))
                        .contact(new Contact()
                                .url("https://www.linkedin.com/in/avinash-java-backend/"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://springdoc.org")));
    }
}

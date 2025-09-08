package com.hexaware.BookManagementSystem.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String SCHEME_NAME = "basicAuth";

        return new OpenAPI()
                .info(new Info().title("Book Management API").version("1.0"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes(SCHEME_NAME,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("basic")
                                        .description("HTTP Basic Authentication")
                        )
                )
                .addSecurityItem(new SecurityRequirement().addList(SCHEME_NAME));
    }
}

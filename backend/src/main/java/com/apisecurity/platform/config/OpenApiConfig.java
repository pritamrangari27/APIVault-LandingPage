package com.apisecurity.platform.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI specGuardOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SpecGuard API")
                        .description(
                                "Smart API Security Testing Platform. " +
                                        "Upload your OpenAPI spec and get an instant " +
                                        "security audit powered by OWASP rules and AI.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("SpecGuard Team")
                                .email("team@specguard.dev"))
                        .license(new License()
                                .name("MIT")));
    }
}

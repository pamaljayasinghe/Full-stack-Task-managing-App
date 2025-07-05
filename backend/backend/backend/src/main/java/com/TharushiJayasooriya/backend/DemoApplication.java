package com.TharushiJayasooriya.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.TharushiJayasooriya.backend", "config", "controller", "service", "entity", "repository", "dto", "util", "exception"})
@EnableJpaRepositories(basePackages = "repository")
@EntityScan(basePackages = "entity")
public class DemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
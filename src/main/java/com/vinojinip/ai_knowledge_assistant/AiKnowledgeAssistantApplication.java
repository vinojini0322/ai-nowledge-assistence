package com.vinojinip.ai_knowledge_assistant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiKnowledgeAssistantApplication {

	public static void main(String[] args) {
		String jwtSecret = System.getenv("JWT_SECRET");

		System.out.println(
				"JWT_SECRET configured = "
						+ (jwtSecret != null && !jwtSecret.isBlank())
		);

		System.out.println(
				"ACTIVE PROFILE = "
						+ System.getenv("SPRING_PROFILES_ACTIVE")
		);
		SpringApplication.run(AiKnowledgeAssistantApplication.class, args);
	}
}

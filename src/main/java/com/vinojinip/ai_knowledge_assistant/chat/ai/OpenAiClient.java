package com.vinojinip.ai_knowledge_assistant.chat.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OpenAiClient {

    private static final String SYSTEM_PROMPT =
            """
            You are a helpful AI knowledge assistant.
            Give accurate, concise, and clearly structured answers.
            If you are uncertain, say so.
            """;

    private final RestClient.Builder restClientBuilder;

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.base-url}")
    private String baseUrl;

    public String generateResponse(List<OpenAiMessage> conversationMessages) {

        RestClient restClient = restClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + apiKey
                )
                .build();

        List<OpenAiMessage> messages = new ArrayList<>();
        messages.add(new OpenAiMessage("system", SYSTEM_PROMPT));
        messages.addAll(conversationMessages);

        OpenAiChatRequest request = new OpenAiChatRequest(
                model,
                messages,
                1000
        );

        OpenAiChatResponse response = restClient
                .post()
                .uri("/v1/chat/completions")
                .body(request)
                .retrieve()
                .body(OpenAiChatResponse.class);

        if (response.choices() == null || response.choices().isEmpty() || response.choices().getFirst().message() == null || response.choices().getFirst().message().content() == null) {

            throw new IllegalStateException(
                    "OpenAI returned an empty response"
            );
        }

        return response.choices()
                .getFirst()
                .message()
                .content()
                .trim();
    }
}
package com.vinojinip.ai_knowledge_assistant.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ChatRequest(@NotNull(message = "Conversation id is required")
                          UUID conversationId,

                          @NotBlank(message = "Message is required")
                          @Size(max = 10_000, message = "Message must not exceed 10000 characters")
                          String message) {
}

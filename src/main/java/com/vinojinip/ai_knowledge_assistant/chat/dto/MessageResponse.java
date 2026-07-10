package com.vinojinip.ai_knowledge_assistant.chat.dto;

import com.vinojinip.ai_knowledge_assistant.chat.enums.MessageRole;

import java.time.Instant;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        MessageRole role,
        String content,
        Instant createdAt
) {
}
package com.vinojinip.ai_knowledge_assistant.chat.dto;

public record ChatResponse(MessageResponse userMessage,
                           MessageResponse assistantMessage) {
}

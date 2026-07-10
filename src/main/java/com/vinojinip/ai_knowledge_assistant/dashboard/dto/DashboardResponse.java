package com.vinojinip.ai_knowledge_assistant.dashboard.dto;

public record DashboardResponse(
        long conversationCount,
        long messageCount,
        long documentCount
) {
}
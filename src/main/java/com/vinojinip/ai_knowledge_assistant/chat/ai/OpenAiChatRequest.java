package com.vinojinip.ai_knowledge_assistant.chat.ai;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record OpenAiChatRequest(
        String model,
        List<OpenAiMessage> messages,
        @JsonProperty("max_tokens")
        Integer maxToken
) {
}

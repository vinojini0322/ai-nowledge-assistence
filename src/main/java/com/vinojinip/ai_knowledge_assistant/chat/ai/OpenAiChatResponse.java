package com.vinojinip.ai_knowledge_assistant.chat.ai;

import java.util.List;

public record OpenAiChatResponse(
        List<Choice> choices
) {

    public record Choice(
            OpenAiMessage message
    ) {
    }
}
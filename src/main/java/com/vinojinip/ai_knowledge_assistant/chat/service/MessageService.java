package com.vinojinip.ai_knowledge_assistant.chat.service;

import com.vinojinip.ai_knowledge_assistant.chat.ai.OpenAiClient;
import com.vinojinip.ai_knowledge_assistant.chat.entity.Conversation;
import com.vinojinip.ai_knowledge_assistant.chat.entity.Message;
import com.vinojinip.ai_knowledge_assistant.chat.enums.MessageRole;
import com.vinojinip.ai_knowledge_assistant.chat.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationService conversationService;

    @Transactional
    public List<Message> chat(
            UUID conversationId,
            String content
    ) {
        Conversation conversation =
                conversationService.getById(conversationId);

        Message userMessage = new Message();
        userMessage.setConversation(conversation);
        userMessage.setRole(MessageRole.USER);
        userMessage.setContent(content.trim());

        Message savedUserMessage =
                messageRepository.save(userMessage);

        String assistantContent =
                "This is a mock AI response. " +
                        "OpenAI integration will be enabled after configuring a valid API key.";

        Message assistantMessage = new Message();
        assistantMessage.setConversation(conversation);
        assistantMessage.setRole(MessageRole.ASSISTANT);
        assistantMessage.setContent(assistantContent);

        Message savedAssistantMessage =
                messageRepository.save(assistantMessage);

        return List.of(
                savedUserMessage,
                savedAssistantMessage
        );
    }

    public List<Message> getConversationMessages(UUID conversationId) {
        conversationService.getById(conversationId);

        return messageRepository
                .findByConversation_IdOrderByCreatedAtAsc(conversationId);
    }
}
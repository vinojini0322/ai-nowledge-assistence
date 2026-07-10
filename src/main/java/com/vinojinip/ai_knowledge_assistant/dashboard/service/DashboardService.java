package com.vinojinip.ai_knowledge_assistant.dashboard.service;

import com.vinojinip.ai_knowledge_assistant.chat.repository.ConversationRepository;
import com.vinojinip.ai_knowledge_assistant.chat.repository.MessageRepository;
import com.vinojinip.ai_knowledge_assistant.chat.service.CurrentUserService;
import com.vinojinip.ai_knowledge_assistant.dashboard.dto.DashboardResponse;
import com.vinojinip.ai_knowledge_assistant.document.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final DocumentRepository documentRepository;
    private final CurrentUserService currentUserService;

    public DashboardResponse getSummary() {
        UUID userId = currentUserService.getCurrentUser().getId();

        long conversationCount =
                conversationRepository.countByUser_Id(userId);

        long messageCount =
                messageRepository.countByConversation_User_Id(userId);

        long documentCount =
                documentRepository.countByUser_Id(userId);

        return new DashboardResponse(
                conversationCount,
                messageCount,
                documentCount
        );
    }
}
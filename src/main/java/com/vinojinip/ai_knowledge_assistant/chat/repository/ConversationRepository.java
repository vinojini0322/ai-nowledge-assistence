package com.vinojinip.ai_knowledge_assistant.chat.repository;

import com.vinojinip.ai_knowledge_assistant.chat.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    List<Conversation> findByUser_IdOrderByUpdatedAtDesc(UUID userId);

    Optional<Conversation> findByIdAndUser_Id(
            UUID id,
            UUID userId
    );

    long countByUser_Id(UUID userId);
}
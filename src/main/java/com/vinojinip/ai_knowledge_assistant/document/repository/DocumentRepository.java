package com.vinojinip.ai_knowledge_assistant.document.repository;

import com.vinojinip.ai_knowledge_assistant.document.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {

    List<Document> findByUser_IdOrderByCreatedAtDesc(UUID userId);

    Optional<Document> findByIdAndUser_Id(
            UUID documentId,
            UUID userId
    );

    long countByUser_Id(UUID userId);
}
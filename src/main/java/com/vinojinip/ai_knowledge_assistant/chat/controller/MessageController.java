package com.vinojinip.ai_knowledge_assistant.chat.controller;

import com.vinojinip.ai_knowledge_assistant.chat.dto.ChatRequest;
import com.vinojinip.ai_knowledge_assistant.chat.dto.ChatResponse;
import com.vinojinip.ai_knowledge_assistant.chat.dto.MessageResponse;
import com.vinojinip.ai_knowledge_assistant.chat.entity.Message;
import com.vinojinip.ai_knowledge_assistant.chat.mapper.MessageMapper;
import com.vinojinip.ai_knowledge_assistant.chat.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/messages")
public class MessageController {

    private final MessageService messageService;
    private final MessageMapper messageMapper;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @Valid @RequestBody ChatRequest request
    ) {
        List<Message> messages = messageService.chat(
                request.conversationId(),
                request.message()
        );

        MessageResponse userMessage =
                messageMapper.toResponse(messages.get(0));

        MessageResponse assistantMessage =
                messageMapper.toResponse(messages.get(1));

        return ResponseEntity.ok(
                new ChatResponse(
                        userMessage,
                        assistantMessage
                )
        );
    }

    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<List<MessageResponse>> getConversationMessages(
            @PathVariable UUID conversationId
    ) {
        List<MessageResponse> response =
                messageService.getConversationMessages(conversationId)
                        .stream()
                        .map(messageMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }
}
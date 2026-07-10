package com.vinojinip.ai_knowledge_assistant.auth.dto;

import java.util.UUID;

public record LoginResponse(String token,
                            String type,
                            UUID id,
                            String email,
                            String firstName,
                            String lastName) {
}

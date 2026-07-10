package com.vinojinip.ai_knowledge_assistant.chat.mapper;

import com.vinojinip.ai_knowledge_assistant.chat.dto.MessageResponse;
import com.vinojinip.ai_knowledge_assistant.chat.entity.Message;
import com.vinojinip.ai_knowledge_assistant.common.config.MapperConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfiguration.class)
public interface MessageMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "conversation", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Message toEntity(String content);

    MessageResponse toResponse(Message message);
}

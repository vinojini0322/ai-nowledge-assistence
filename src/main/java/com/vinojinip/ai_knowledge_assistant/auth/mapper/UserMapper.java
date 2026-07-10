package com.vinojinip.ai_knowledge_assistant.auth.mapper;

import com.vinojinip.ai_knowledge_assistant.auth.dto.RegisterRequest;
import com.vinojinip.ai_knowledge_assistant.auth.dto.UserResponse;
import com.vinojinip.ai_knowledge_assistant.auth.entity.User;
import com.vinojinip.ai_knowledge_assistant.common.config.MapperConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfiguration.class)
public interface UserMapper {


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", source = "encodedPassword")
    User toEntity(RegisterRequest request);

    UserResponse toResponse(User user);
}

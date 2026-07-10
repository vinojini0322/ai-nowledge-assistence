package com.vinojinip.ai_knowledge_assistant.auth.service;

import com.vinojinip.ai_knowledge_assistant.auth.dto.RegisterRequest;
import com.vinojinip.ai_knowledge_assistant.auth.entity.User;
import com.vinojinip.ai_knowledge_assistant.auth.mapper.UserMapper;
import com.vinojinip.ai_knowledge_assistant.auth.repository.UserRepository;
import com.vinojinip.ai_knowledge_assistant.common.exception.EmailAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User findById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }
        String encodedPassword = passwordEncoder.encode(request.password());

        User user = UserMapper.toEntity(request, encodedPassword);
        return userRepository.save(user);
    }
}

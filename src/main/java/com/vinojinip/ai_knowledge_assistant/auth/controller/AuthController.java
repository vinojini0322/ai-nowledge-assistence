package com.vinojinip.ai_knowledge_assistant.auth.controller;

import com.vinojinip.ai_knowledge_assistant.auth.dto.LoginRequest;
import com.vinojinip.ai_knowledge_assistant.auth.dto.LoginResponse;
import com.vinojinip.ai_knowledge_assistant.auth.dto.RegisterRequest;
import com.vinojinip.ai_knowledge_assistant.auth.dto.UserResponse;
import com.vinojinip.ai_knowledge_assistant.auth.entity.User;
import com.vinojinip.ai_knowledge_assistant.auth.mapper.UserMapper;
import com.vinojinip.ai_knowledge_assistant.auth.service.AuthService;
import com.vinojinip.ai_knowledge_assistant.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {


    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        User savedUser = userService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserMapper.toResponse(savedUser));
    }

    @GetMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }



}

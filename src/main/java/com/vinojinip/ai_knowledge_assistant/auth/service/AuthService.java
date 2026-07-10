package com.vinojinip.ai_knowledge_assistant.auth.service;


import com.vinojinip.ai_knowledge_assistant.auth.dto.LoginRequest;
import com.vinojinip.ai_knowledge_assistant.auth.dto.LoginResponse;
import com.vinojinip.ai_knowledge_assistant.auth.entity.User;
import com.vinojinip.ai_knowledge_assistant.auth.repository.UserRepository;
import com.vinojinip.ai_knowledge_assistant.security.jwt.JwtService;
import com.vinojinip.ai_knowledge_assistant.security.modal.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        String token = jwtService.generateToken(
                new CustomUserDetails(user)
        );

        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
    }

}

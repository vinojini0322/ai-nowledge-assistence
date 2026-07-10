package com.vinojinip.ai_knowledge_assistant.dashboard.controller;

import com.vinojinip.ai_knowledge_assistant.dashboard.dto.DashboardResponse;
import com.vinojinip.ai_knowledge_assistant.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getSummary() {
        return ResponseEntity.ok(
                dashboardService.getSummary()
        );
    }
}
package com.vibra.tickets.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.reactive.function.client.WebClientResponseException;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@Slf4j
public class TicketAnalysisService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final RuleBasedAnalysisService ruleBasedAnalysisService;

    @Value("${gemini.api-key:}")
    private String apiKey;

    public TicketAnalysisService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper, RuleBasedAnalysisService ruleBasedAnalysisService) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
        this.objectMapper = objectMapper;
        this.ruleBasedAnalysisService = ruleBasedAnalysisService;
    }

    public Map<String, String> analyzeTicket(String text, String base64Image) {
        if (apiKey != null && apiKey.length() > 4) {
            log.info("Starting ticket analysis. API Key detected (starts with: {}...{})", 
                apiKey.substring(0, 4), apiKey.substring(apiKey.length() - 4));
        } else {
            log.warn("Gemini API Key is missing or too short.");
            return ruleBasedAnalysisService.analyzeText(text);
        }

        return callGemini(text, base64Image);
    }

    private Map<String, String> callGemini(String text, String base64Image) {
        try {
            log.info("Calling Gemini API...");
            
            String prompt = "Extraia o nome do evento, data (ISO), local e tipo de ingresso deste documento em JSON: { \"eventTitle\": \"...\", \"eventDate\": \"...\", \"location\": \"...\", \"ticketType\": \"...\" }. Use 'Não identificado' para campos ausentes. Responda APENAS o JSON.";

            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> parts = new ArrayList<>();
            
            parts.add(Map.of("text", prompt + "\n\nTexto Extraído do Documento: " + (text != null ? text : "")));
            
            if (base64Image != null && base64Image.contains(",")) {
                String[] split = base64Image.split(",");
                String mimeType = split[0].split(":")[1].split(";")[0];
                String pureBase64 = split[1];
                
                parts.add(Map.of("inline_data", Map.of(
                    "mime_type", mimeType,
                    "data", pureBase64
                )));
                log.info("Sending image ({}) to Gemini.", mimeType);
            }

            requestBody.put("contents", List.of(Map.of("parts", parts)));

            // Ajuste na construção da URI para garantir que o path e a key coexistam
            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1/models/gemini-2.5-flash:generateContent")
                            .queryParam("key", apiKey)
                            .build())
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("Gemini response received.");
            
            JsonNode root = objectMapper.readTree(response);
            String aiText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            // Limpeza robusta de markdown
            aiText = aiText.replaceAll("(?s).*?\\{", "{").replaceAll("\\}.*?$", "}");
            
            JsonNode data = objectMapper.readTree(aiText);
            
            Map<String, String> result = new HashMap<>();
            result.put("eventTitle", data.path("eventTitle").asText("Não identificado"));
            result.put("eventDate", data.path("eventDate").asText("Não identificado"));
            result.put("location", data.path("location").asText("Não identificado"));
            result.put("ticketType", data.path("ticketType").asText("Não identificado"));
            
            return result;

        } catch (WebClientResponseException e) {
            log.error("Gemini API Error: {} - Response: {}", e.getStatusCode(), e.getResponseBodyAsString());
            return ruleBasedAnalysisService.analyzeText(text);
        } catch (Exception e) {
            log.error("Error processing AI response: {}", e.getMessage());
            return ruleBasedAnalysisService.analyzeText(text);
        }
    }

    // Mantendo o método antigo para compatibilidade temporária se necessário
    public Map<String, String> analyzeTicketText(String text) {
        return analyzeTicket(text, null);
    }
}

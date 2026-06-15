package com.vibra.tickets.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Arrays;
import java.util.List;

@Service
public class RuleBasedAnalysisService {

    private static final List<Pattern> DATE_PATTERNS = Arrays.asList(
            Pattern.compile("\\d{2}/\\d{2}/\\d{4}"),
            Pattern.compile("\\d{2}/\\d{2}/\\d{2}"),
            Pattern.compile("\\d{2}\\s+de\\s+[a-zA-ZçÇ]+\\s+de\\s+\\d{4}", Pattern.CASE_INSENSITIVE)
    );

    private static final List<String> TICKET_TYPES = Arrays.asList(
            "Pista", "VIP", "Camarote", "Backstage", "Front Stage", "Meia", "Inteira", "Solidário", "Open Bar"
    );

    public Map<String, String> analyzeText(String text) {
        Map<String, String> result = new HashMap<>();
        
        if (text == null || text.trim().isEmpty()) {
            return fallback();
        }

        String[] lines = text.split("\\n");
        
        // 1. Título (Pega a primeira linha longa e limpa)
        String title = "Não identificado";
        for (String line : lines) {
            String cleanLine = line.trim();
            if (cleanLine.length() > 5 && !isDate(cleanLine) && !cleanLine.toLowerCase().contains("r$")) {
                title = cleanLine;
                break;
            }
        }
        result.put("eventTitle", title);

        // 2. Data
        String date = "Não identificado";
        for (Pattern pattern : DATE_PATTERNS) {
            Matcher matcher = pattern.matcher(text);
            if (matcher.find()) {
                date = matcher.group();
                break;
            }
        }
        result.put("eventDate", date);

        // 3. Tipo
        String type = "Voucher Externo";
        for (String keyword : TICKET_TYPES) {
            if (text.toLowerCase().contains(keyword.toLowerCase())) {
                type = keyword;
                break;
            }
        }
        result.put("ticketType", type);
        
        // 4. Local
        String location = "Não identificado";
        for (String line : lines) {
            if (line.toLowerCase().contains("local:") || line.toLowerCase().contains("endereço:")) {
                location = line.replaceAll("(?i)local:|endereço:", "").trim();
                break;
            }
        }
        result.put("location", location);

        return result;
    }

    private boolean isDate(String text) {
        for (Pattern p : DATE_PATTERNS) {
            if (p.matcher(text).find()) return true;
        }
        return false;
    }

    private Map<String, String> fallback() {
        Map<String, String> result = new HashMap<>();
        result.put("eventTitle", "Ingresso Importado");
        result.put("eventDate", "Não identificado");
        result.put("location", "Não identificado");
        result.put("ticketType", "Voucher Externo");
        return result;
    }
}

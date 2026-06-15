package com.vibra.identity.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UserTest {

    @Test
    @DisplayName("Should handle preferences JSONB correctly")
    void shouldHandlePreferencesJsonbCorrectly() {
        Map<String, Object> preferences = new HashMap<>();
        preferences.put("idade", 25);
        preferences.put("genero", "MASCULINO");
        preferences.put("vibes", List.of("TECH", "ROCK", "NIGHT"));
        
        Map<String, Object> matchPrefs = new HashMap<>();
        matchPrefs.put("faixa_etaria", List.of(18, 30));
        matchPrefs.put("genero_interesse", "FEMININO");
        
        preferences.put("preferencias_match", matchPrefs);

        User user = User.builder()
                .email("test@vibra.com")
                .preferences(preferences)
                .build();

        assertNotNull(user.getPreferences());
        assertEquals(25, user.getPreferences().get("idade"));
        assertEquals("MASCULINO", user.getPreferences().get("genero"));
        
        @SuppressWarnings("unchecked")
        List<String> vibes = (List<String>) user.getPreferences().get("vibes");
        assertEquals(3, vibes.size());
        assertTrue(vibes.contains("TECH"));

        @SuppressWarnings("unchecked")
        Map<String, Object> savedMatchPrefs = (Map<String, Object>) user.getPreferences().get("preferencias_match");
        assertNotNull(savedMatchPrefs);
        assertEquals("FEMININO", savedMatchPrefs.get("genero_interesse"));
    }
}

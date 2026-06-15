package com.vibra.identity.service;

import com.vibra.identity.service.impl.CPFServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CPFServiceTest {

    private CPFService cpfService;

    @BeforeEach
    void setUp() {
        cpfService = new CPFServiceImpl();
    }

    @Test
    @DisplayName("Should validate correct CPF")
    void shouldValidateCorrectCpf() {
        // CPFs gerados para teste
        assertTrue(cpfService.isValid("52998224725"));
        assertTrue(cpfService.isValid("529.982.247-25"));
    }

    @Test
    @DisplayName("Should reject invalid CPF")
    void shouldRejectInvalidCpf() {
        assertFalse(cpfService.isValid("11111111111"));
        assertFalse(cpfService.isValid("12345678901"));
        assertFalse(cpfService.isValid("123"));
        assertFalse(cpfService.isValid(null));
    }
}

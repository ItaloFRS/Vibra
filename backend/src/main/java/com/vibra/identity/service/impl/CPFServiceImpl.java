package com.vibra.identity.service.impl;

import com.vibra.identity.service.CPFService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CPFServiceImpl implements CPFService {

    @Override
    public boolean isValid(String cpf) {
        if (cpf == null) return false;
        String cleanCpf = cpf.replaceAll("\\D", "");
        if (cleanCpf.length() != 11) return false;

        // Standard Mod11 algorithm validation
        if (!isMod11Valid(cleanCpf)) return false;

        // Mocking External API call
        log.info("CPF {} validated by algorithm. Simulating external API check...", cleanCpf);
        return true; 
    }

    private boolean isMod11Valid(String cpf) {
        if (cpf.matches("(\\d)\\1{10}")) return false;

        try {
            int d1 = 0, d2 = 0;
            int digit1, digit2, rest;
            int nDig;

            for (int nCount = 1; nCount < cpf.length() - 1; nCount++) {
                nDig = Integer.parseInt(cpf.substring(nCount - 1, nCount));
                d1 = d1 + (11 - nCount) * nDig;
                d2 = d2 + (12 - nCount) * nDig;
            }

            rest = (d1 % 11);
            if (rest < 2) digit1 = 0;
            else digit1 = 11 - rest;

            d2 = d2 + 2 * digit1;
            rest = (d2 % 11);
            if (rest < 2) digit2 = 0;
            else digit2 = 11 - rest;

            String result = String.valueOf(digit1) + String.valueOf(digit2);
            return cpf.substring(cpf.length() - 2).equals(result);
        } catch (Exception e) {
            return false;
        }
    }
}

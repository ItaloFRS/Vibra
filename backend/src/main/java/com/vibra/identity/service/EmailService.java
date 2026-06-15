package com.vibra.identity.service;

public interface EmailService {
    void sendVerificationCode(String to, String code);
}

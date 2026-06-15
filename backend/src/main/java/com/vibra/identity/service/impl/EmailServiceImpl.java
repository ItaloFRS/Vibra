package com.vibra.identity.service.impl;

import com.vibra.identity.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendVerificationCode(String to, String code) {
        log.info("**************************************************");
        log.info("CÓDIGO DE VERIFICAÇÃO PARA {}: {}", to, code);
        log.info("**************************************************");

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@vibra.com");
            message.setTo(to);
            message.setSubject("Vibra - Código de Verificação");
            message.setText("Seu código de verificação é: " + code + "\nEste código expira em 10 minutos.");
            mailSender.send(message);
            log.info("E-mail enviado com sucesso para {}", to);
        } catch (Exception e) {
            log.error("Falha ao enviar e-mail para {}: {}. O código foi logado acima para fins de desenvolvimento.", to, e.getMessage());
        }
    }
}

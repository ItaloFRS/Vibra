package com.vibra.tickets.service;

import com.mercadopago.client.common.AddressRequest;
import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.common.PhoneRequest;
import com.mercadopago.client.payment.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.vibra.tickets.config.MPConfig;
import com.vibra.tickets.dto.PaymentRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class MercadoPagoService {

    private final PaymentClient client = new PaymentClient();
    private final MPConfig mpConfig;

    public MercadoPagoService(MPConfig mpConfig) {
        this.mpConfig = mpConfig;
    }

    public Payment processPayment(UUID ticketId, String eventTitle, BigDecimal price, PaymentRequest request) {
        try {
            // Limitar o statement descriptor a 22 caracteres
            String statementPrefix = "VIBRA*";
            String eventName = eventTitle.length() > (22 - statementPrefix.length()) 
                ? eventTitle.substring(0, 22 - statementPrefix.length()) 
                : eventTitle;

            PaymentCreateRequest paymentCreateRequest = PaymentCreateRequest.builder()
                    .transactionAmount(price)
                    .token(request.getToken()) // Token do cartão gerado no frontend (nulo para PIX)
                    .description("Ingresso: " + eventTitle)
                    .installments(request.getInstallments())
                    .paymentMethodId(request.getPaymentMethodId())
                    .payer(PaymentPayerRequest.builder()
                            .email(request.getPayerEmail())
                            .firstName(request.getFirstName())
                            .lastName(request.getLastName())
                            .identification(IdentificationRequest.builder()
                                    .type(request.getIdentificationType())
                                    .number(request.getIdentificationNumber())
                                    .build())
                            .build())
                    // Additional Info é CRUCIAL para evitar rejeições por fraude
                    .additionalInfo(PaymentAdditionalInfoRequest.builder()
                            .items(List.of(PaymentItemRequest.builder()
                                    .id(ticketId.toString())
                                    .title(eventTitle)
                                    .quantity(1)
                                    .unitPrice(price)
                                    .build()))
                            .payer(PaymentAdditionalInfoPayerRequest.builder()
                                    .firstName(request.getFirstName())
                                    .lastName(request.getLastName())
                                    .phone(PhoneRequest.builder()
                                            .areaCode(request.getPhoneAreaCode())
                                            .number(request.getPhoneNumber())
                                            .build())
                                    .address(AddressRequest.builder()
                                            .streetName(request.getStreetName())
                                            .streetNumber(request.getStreetNumber())
                                            .zipCode(request.getZipCode())
                                            .build())
                                    .build())
                            .build())
                    .statementDescriptor(statementPrefix + eventName)
                    .binaryMode(true) // Apenas aprovado ou rejeitado (ideal para ingressos)
                    .externalReference(ticketId.toString())
                    .notificationUrl(mpConfig.getNotificationUrl())
                    .build();

            return client.create(paymentCreateRequest);

        } catch (MPApiException e) {
            System.err.println("Erro API Mercado Pago Content: " + e.getApiResponse().getContent());
            throw new RuntimeException("Erro ao processar pagamento no Mercado Pago: " + e.getApiResponse().getContent(), e);
        } catch (MPException e) {
            throw new RuntimeException("Erro ao processar pagamento no Mercado Pago: " + e.getMessage(), e);
        }
    }

    public Payment getPaymentById(Long paymentId) {
        try {
            return client.get(paymentId);
        } catch (MPException | MPApiException e) {
            throw new RuntimeException("Erro ao buscar pagamento no Mercado Pago: " + e.getMessage(), e);
        }
    }
}

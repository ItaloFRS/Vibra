package com.vibra.tickets.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    
    private String token; // Obrigatório para Cartão, nulo para Pix
    
    @NotBlank
    private String paymentMethodId; // Ex: "visa", "master", "pix"
    
    @NotNull
    private Integer installments; // Parcelas (1 para Pix)
    
    @NotBlank
    @Email
    private String payerEmail;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String identificationType = "CPF";

    @NotBlank
    private String identificationNumber; // CPF ou CNPJ

    // Dados para Antifraude e PIX
    private String phoneAreaCode;
    private String phoneNumber;
    
    // Endereço (Opcional, mas recomendado para antifraude de cartão)
    private String streetName;
    private String streetNumber;
    private String zipCode;
    private String neighborhood;
    private String city;
    private String state;
}

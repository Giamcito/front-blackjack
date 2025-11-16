package com.blackjack.conteo.delivery.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for registering a card value.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterCardRequest {
    
    @JsonProperty("value")
    private int value;
}

package com.blackjack.conteo.delivery.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for initializing the card counter.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InitCounterRequest {
    
    @JsonProperty("num_decks")
    private int numDecks;
}

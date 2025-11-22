package com.blackjack.conteo.delivery.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for getting a recommendation.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationRequest {
    
    @JsonProperty("player_total")
    private int playerTotal;
    
    @JsonProperty("dealer_up_value")
    private int dealerUpValue;
}

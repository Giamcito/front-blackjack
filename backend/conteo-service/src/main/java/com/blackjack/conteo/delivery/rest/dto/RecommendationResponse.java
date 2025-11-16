package com.blackjack.conteo.delivery.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response payload for recommendation.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationResponse {
    
    @JsonProperty("recommendation")
    private String recommendation;
}

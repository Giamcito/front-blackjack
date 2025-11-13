package com.blackjack.conteo.delivery.rest.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response payload for count history record.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CountHistoryResponse {
    
    @JsonProperty("id")
    private Long id;
    
    @JsonProperty("running_count")
    private Integer runningCount;
    
    @JsonProperty("true_count")
    private Integer trueCount;
    
    @JsonProperty("card_value")
    private Integer cardValue;
    
    @JsonProperty("decks_in_play")
    private Integer decksInPlay;
    
    @JsonProperty("timestamp")
    private LocalDateTime timestamp;
    
    @JsonProperty("notes")
    private String notes;
}

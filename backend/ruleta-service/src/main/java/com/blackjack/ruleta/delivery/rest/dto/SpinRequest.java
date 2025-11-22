package com.blackjack.ruleta.delivery.rest.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpinRequest {
    private List<Bet> bets;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Bet {
        private String type;  // STRAIGHT, COLOR, EVEN_ODD, HIGH_LOW, DOZEN, COLUMN
        private String value; // e.g., "17" for STRAIGHT, "RED"/"BLACK", "EVEN"/"ODD", "HIGH"/"LOW", "1"/"2"/"3"
        private int amount;   // stake in units
    }
}

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
public class SpinResult {
    private int number;       // 0-36
    private String color;     // GREEN/RED/BLACK
    private boolean even;     // true if even (0 -> false)
    private boolean zero;     // true if 0
    private int totalStake;   // sum of amounts
    private int totalPayout;  // total winnings incl. stake returns
    private int net;          // totalPayout - totalStake
    private List<BetPayout> breakdown;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BetPayout {
        private SpinRequest.Bet bet;
        private boolean win;
        private int payout; // amount returned for this bet (includes stake if win)
        private String reason;
    }
}

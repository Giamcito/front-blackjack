package com.blackjack.ruleta.delivery.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blackjack.ruleta.delivery.rest.dto.SpinRequest;
import com.blackjack.ruleta.delivery.rest.dto.SpinResult;
import com.blackjack.ruleta.domain.service.RouletteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/roulette")
@RequiredArgsConstructor
public class RouletteController {

    private final RouletteService rouletteService;

    @GetMapping("/status")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok("Roulette service up");
    }

    @PostMapping("/spin")
    public ResponseEntity<SpinResult> spin(@RequestBody SpinRequest request) {
        int number = rouletteService.spinNumber();
        String color = rouletteService.colorOf(number);
        boolean even = rouletteService.isEven(number);
        boolean zero = number == 0;

        List<SpinResult.BetPayout> breakdown = new ArrayList<>();
        int totalStake = 0;
        int totalPayout = 0;
        if (request.getBets() != null) {
            for (SpinRequest.Bet bet : request.getBets()) {
                totalStake += bet.getAmount();
                PayoutResult pr = evaluateBet(bet, number, color, even, zero);
                totalPayout += pr.payout;
                breakdown.add(SpinResult.BetPayout.builder()
                    .bet(bet)
                    .win(pr.win)
                    .payout(pr.payout)
                    .reason(pr.reason)
                    .build());
            }
        }

        SpinResult result = SpinResult.builder()
            .number(number)
            .color(color)
            .even(even)
            .zero(zero)
            .totalStake(totalStake)
            .totalPayout(totalPayout)
            .net(totalPayout - totalStake)
            .breakdown(breakdown)
            .build();
        return ResponseEntity.ok(result);
    }

    static class PayoutResult { boolean win; int payout; String reason; }

    private PayoutResult evaluateBet(SpinRequest.Bet bet, int number, String color, boolean even, boolean zero) {
        PayoutResult pr = new PayoutResult();
        pr.win = false; pr.payout = 0; pr.reason = "";
        String type = safeUpper(bet.getType());
        String val = safeUpper(bet.getValue());
        int amt = Math.max(0, bet.getAmount());

        switch (type) {
            case "STRAIGHT": {
                if (!zero && isInteger(val)) {
                    int chosen = Integer.parseInt(val);
                    if (chosen == number) { pr.win = true; pr.payout = amt * (35 + 1); pr.reason = "35:1"; }
                } else if ("0".equals(val) && number == 0) { pr.win = true; pr.payout = amt * (35 + 1); pr.reason = "35:1"; }
                break;
            }
            case "COLOR": {
                if (!zero && ("RED".equals(val) || "BLACK".equals(val))) {
                    if (val.equals(color)) { pr.win = true; pr.payout = amt * 2; pr.reason = "1:1"; }
                }
                break;
            }
            case "EVEN_ODD": {
                if (!zero && ("EVEN".equals(val) || "ODD".equals(val))) {
                    boolean isOdd = !even;
                    if (("EVEN".equals(val) && even) || ("ODD".equals(val) && isOdd)) { pr.win = true; pr.payout = amt * 2; pr.reason = "1:1"; }
                }
                break;
            }
            case "HIGH_LOW": {
                if (!zero && ("HIGH".equals(val) || "LOW".equals(val))) {
                    boolean isHigh = number >= 19 && number <= 36;
                    boolean isLow = number >= 1 && number <= 18;
                    if (("HIGH".equals(val) && isHigh) || ("LOW".equals(val) && isLow)) { pr.win = true; pr.payout = amt * 2; pr.reason = "1:1"; }
                }
                break;
            }
            case "DOZEN": {
                if (!zero && ("1".equals(val) || "2".equals(val) || "3".equals(val))) {
                    int dozen = Integer.parseInt(val); // 1: 1-12, 2: 13-24, 3: 25-36
                    boolean hit = (dozen == 1 && number >= 1 && number <= 12)
                               || (dozen == 2 && number >= 13 && number <= 24)
                               || (dozen == 3 && number >= 25 && number <= 36);
                    if (hit) { pr.win = true; pr.payout = amt * 3; pr.reason = "2:1"; }
                }
                break;
            }
            case "COLUMN": {
                if (!zero && ("1".equals(val) || "2".equals(val) || "3".equals(val))) {
                    int col = Integer.parseInt(val); // columns by (number-1)%3 + 1
                    int numberCol = ((number - 1) % 3) + 1;
                    if (numberCol == col) { pr.win = true; pr.payout = amt * 3; pr.reason = "2:1"; }
                }
                break;
            }
            default: {
                pr.reason = "Unknown bet type";
            }
        }
        if (!pr.win && pr.reason.isEmpty()) pr.reason = "Lose";
        return pr;
    }

    private static String safeUpper(String s) { return s == null ? "" : s.trim().toUpperCase(); }
    private static boolean isInteger(String s) {
        try { Integer.parseInt(s); return true; } catch (Exception e) { return false; }
    }
}

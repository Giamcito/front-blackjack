package com.blackjack.ruleta.domain.service;

import java.security.SecureRandom;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class RouletteService {
    private final SecureRandom random = new SecureRandom();

    private static final Set<Integer> REDS = new HashSet<>(Arrays.asList(
        1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
    ));

    public int spinNumber() {
        return random.nextInt(37); // 0-36 inclusive
    }

    public String colorOf(int number) {
        if (number == 0) return "GREEN";
        return REDS.contains(number) ? "RED" : "BLACK";
    }

    public boolean isEven(int number) {
        return number != 0 && (number % 2 == 0);
    }
}

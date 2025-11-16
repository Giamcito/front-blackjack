package com.blackjack.conteo.domain.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.blackjack.conteo.domain.exception.CardCounterException;

/**
 * Unit tests for CardCounterService.
 */
@SpringBootTest
class CardCounterServiceTest {
    
    @Autowired
    private CardCounterService cardCounterService;
    
    @BeforeEach
    void setUp() {
        // Reset before each test
        if (cardCounterService.isInitialized()) {
            cardCounterService.resetCounter();
        }
    }
    
    @Test
    void testInitCounterSuccess() {
        assertDoesNotThrow(() -> cardCounterService.initCounter(2));
        assertTrue(cardCounterService.isInitialized());
    }
    
    @Test
    void testInitCounterWithInvalidDecks() {
        assertThrows(CardCounterException.class, () -> cardCounterService.initCounter(0));
        assertThrows(CardCounterException.class, () -> cardCounterService.initCounter(-1));
    }
    
    @Test
    void testRegisterCardWithoutInit() {
        assertThrows(CardCounterException.class, () -> cardCounterService.registerCard(5));
    }
    
    @Test
    void testRegisterCardSuccess() {
        cardCounterService.initCounter(1);
        assertDoesNotThrow(() -> cardCounterService.registerCard(5));
    }
    
    @Test
    void testRegisterCardWithInvalidValue() {
        cardCounterService.initCounter(1);
        assertThrows(CardCounterException.class, () -> cardCounterService.registerCard(1));
        assertThrows(CardCounterException.class, () -> cardCounterService.registerCard(12));
    }
    
    @Test
    void testGetRunningCountWithoutInit() {
        assertThrows(CardCounterException.class, () -> cardCounterService.getRunningCount());
    }
    
    @Test
    void testGetRunningCountSuccess() {
        cardCounterService.initCounter(1);
        assertDoesNotThrow(() -> cardCounterService.getRunningCount());
    }
    
    @Test
    void testGetTrueCountWithoutInit() {
        assertThrows(CardCounterException.class, () -> cardCounterService.getTrueCount());
    }
    
    @Test
    void testGetTrueCountSuccess() {
        cardCounterService.initCounter(1);
        assertDoesNotThrow(() -> cardCounterService.getTrueCount());
    }
    
    @Test
    void testResetCounterSuccess() {
        cardCounterService.initCounter(1);
        assertDoesNotThrow(() -> cardCounterService.resetCounter());
    }
    
    @Test
    void testRecommendWithoutInit() {
        assertThrows(CardCounterException.class, () -> cardCounterService.recommend(12, 5));
    }
    
    @Test
    void testRecommendWithInvalidPlayerTotal() {
        cardCounterService.initCounter(1);
        assertThrows(CardCounterException.class, () -> cardCounterService.recommend(3, 5));
        assertThrows(CardCounterException.class, () -> cardCounterService.recommend(22, 5));
    }
    
    @Test
    void testRecommendWithInvalidDealerValue() {
        cardCounterService.initCounter(1);
        assertThrows(CardCounterException.class, () -> cardCounterService.recommend(12, 1));
        assertThrows(CardCounterException.class, () -> cardCounterService.recommend(12, 12));
    }
    
    @Test
    void testRecommendSuccess() {
        cardCounterService.initCounter(1);
        String recommendation = cardCounterService.recommend(12, 5);
        assertNotNull(recommendation);
        assertTrue(recommendation.equals("HIT") || recommendation.equals("STAND"));
    }
}

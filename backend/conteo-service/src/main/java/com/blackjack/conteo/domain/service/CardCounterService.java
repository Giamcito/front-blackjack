package com.blackjack.conteo.domain.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.blackjack.conteo.domain.exception.CardCounterException;
import com.blackjack.conteo.domain.model.CountHistory;
import com.blackjack.conteo.domain.repository.CountHistoryRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service for card counting operations using the native libcard_counter library.
 * Coordinates with the C library through JNA to manage counting state.
 * Also tracks count history in the database for analysis.
 */
@Slf4j
@Service
public class CardCounterService {
    
    private static final int MIN_CARD_VALUE = 2;
    private static final int MAX_CARD_VALUE = 11;
    private static final int MIN_PLAYER_TOTAL = 4;
    private static final int MAX_PLAYER_TOTAL = 21;
    private static final int MIN_DEALER_VALUE = 2;
    private static final int MAX_DEALER_VALUE = 11;
    
    private boolean initialized = false;
    private int numDecks = 0;
    
    private final CountHistoryRepository countHistoryRepository;
    
    /**
     * Constructor with dependency injection.
     * @param countHistoryRepository Repository for count history
     */
    public CardCounterService(CountHistoryRepository countHistoryRepository) {
        this.countHistoryRepository = countHistoryRepository;
    }
    
    /**
     * Initializes the card counter for a given number of decks.
     * @param numDecks Number of decks (must be positive)
     * @throws CardCounterException if initialization fails
     */
    public void initCounter(int numDecks) {
        if (numDecks <= 0) {
            throw new CardCounterException("Number of decks must be positive. Received: " + numDecks);
        }
        
        try {
            log.info("Initializing card counter with {} decks", numDecks);
            this.numDecks = numDecks;
            com.blackjack.conteo.domain.native_lib.CardCounterLoader.get().cc_init(numDecks);
            initialized = true;
            log.debug("Card counter initialized successfully");
        } catch (Exception e) {
            log.error("Failed to initialize card counter", e);
            throw new CardCounterException("Failed to initialize card counter: " + e.getMessage(), e);
        }
    }
    
    /**
     * Registers a card value as seen and saves to history.
     * @param cardValue Card value (2-11, where 11 = Ace)
     * @throws CardCounterException if not initialized or invalid value
     */
    public void registerCard(int cardValue) {
        ensureInitialized();
        
        if (cardValue < MIN_CARD_VALUE || cardValue > MAX_CARD_VALUE) {
            throw new CardCounterException(
                String.format("Invalid card value: %d. Must be between %d and %d", 
                    cardValue, MIN_CARD_VALUE, MAX_CARD_VALUE)
            );
        }
        
        try {
            log.debug("Registering card with value: {}", cardValue);
            com.blackjack.conteo.domain.native_lib.CardCounterLoader.get().cc_register_card_value(cardValue);
            
            // Save to history database
            int runningCount = com.blackjack.conteo.domain.native_lib.CardCounterLoader.get().cc_get_running_count();
            int trueCount = com.blackjack.conteo.domain.native_lib.CardCounterLoader.get().cc_get_true_count();
            
            CountHistory history = CountHistory.builder()
                .cardValue(cardValue)
                .runningCount(runningCount)
                .trueCount(trueCount)
                .decksInPlay(numDecks)
                .timestamp(LocalDateTime.now())
                .notes("Card " + cardValue + " registered")
                .build();
            
            countHistoryRepository.save(history);
            log.debug("Card history saved: running={}, true={}", runningCount, trueCount);
        } catch (Exception e) {
            log.error("Failed to register card value: {}", cardValue, e);
            throw new CardCounterException("Failed to register card: " + e.getMessage(), e);
        }
    }
    
    /**
     * Returns the current running count.
     * @return Running count value
     * @throws CardCounterException if not initialized
     */
    public int getRunningCount() {
        ensureInitialized();
        
        try {
            int count = com.blackjack.conteo.domain.native_lib.CardCounterLoader.get().cc_get_running_count();
            log.debug("Retrieved running count: {}", count);
            return count;
        } catch (Exception e) {
            log.error("Failed to get running count", e);
            throw new CardCounterException("Failed to get running count: " + e.getMessage(), e);
        }
    }
    
    /**
     * Returns the true count adjusted by remaining decks.
     * @return True count value
     * @throws CardCounterException if not initialized
     */
    public int getTrueCount() {
        ensureInitialized();
        
        try {
            int count = com.blackjack.conteo.domain.native_lib.CardCounterLoader.get().cc_get_true_count();
            log.debug("Retrieved true count: {}", count);
            return count;
        } catch (Exception e) {
            log.error("Failed to get true count", e);
            throw new CardCounterException("Failed to get true count: " + e.getMessage(), e);
        }
    }
    
    /**
     * Resets the counter to initial state.
     * @throws CardCounterException if not initialized
     */
    public void resetCounter() {
        ensureInitialized();
        
        try {
            log.info("Resetting card counter");
            com.blackjack.conteo.domain.native_lib.CardCounterLoader.get().cc_reset();
            log.debug("Card counter reset successfully");
        } catch (Exception e) {
            log.error("Failed to reset card counter", e);
            throw new CardCounterException("Failed to reset counter: " + e.getMessage(), e);
        }
    }
    
    /**
     * Recommends an action based on player total and dealer up card.
     * @param playerTotal Player's hand total (4-21)
     * @param dealerUpValue Dealer's up card value (2-11)
     * @return Recommendation ("HIT" or "STAND")
     * @throws CardCounterException if not initialized or invalid parameters
     */
    public String recommend(int playerTotal, int dealerUpValue) {
        ensureInitialized();
        
        if (playerTotal < MIN_PLAYER_TOTAL || playerTotal > MAX_PLAYER_TOTAL) {
            throw new CardCounterException(
                String.format("Invalid player total: %d. Must be between %d and %d", 
                    playerTotal, MIN_PLAYER_TOTAL, MAX_PLAYER_TOTAL)
            );
        }
        
        if (dealerUpValue < MIN_DEALER_VALUE || dealerUpValue > MAX_DEALER_VALUE) {
            throw new CardCounterException(
                String.format("Invalid dealer up value: %d. Must be between %d and %d", 
                    dealerUpValue, MIN_DEALER_VALUE, MAX_DEALER_VALUE)
            );
        }
        
        try {
            log.debug("Getting recommendation for player total: {}, dealer up: {}", playerTotal, dealerUpValue);
            String recommendation = com.blackjack.conteo.domain.native_lib.CardCounterLoader.get().cc_recommend(playerTotal, dealerUpValue);
            log.debug("Recommendation: {}", recommendation);
            return recommendation;
        } catch (Exception e) {
            log.error("Failed to get recommendation", e);
            throw new CardCounterException("Failed to get recommendation: " + e.getMessage(), e);
        }
    }
    
    /**
     * Checks if the counter is initialized.
     * @return true if initialized, false otherwise
     */
    public boolean isInitialized() {
        return initialized;
    }
    
    /**
     * Gets the count history repository.
     * @return CountHistoryRepository for querying history
     */
    public CountHistoryRepository getCountHistoryRepository() {
        return countHistoryRepository;
    }
    
    /**
     * Ensures the counter is initialized before operations.
     * @throws CardCounterException if not initialized
     */
    private void ensureInitialized() {
        if (!initialized) {
            throw new CardCounterException("Card counter is not initialized. Call initCounter() first.");
        }
    }
}

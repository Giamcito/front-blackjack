package com.blackjack.conteo.domain.native_lib;

import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Platform;

/**
 * JNA interface for libcard_counter.so C library.
 * Maps C functions to Java method signatures.
 */
public interface CardCounterLibrary extends Library {
    
    // Load the native library
    CardCounterLibrary INSTANCE = Native.load(
        "card_counter",
        CardCounterLibrary.class
    );
    
    /**
     * Initializes the card counter for a given number of decks.
     * @param num_decks Number of decks to initialize
     */
    void cc_init(int num_decks);
    
    /**
     * Registers a card value as seen.
     * @param value Card value (2-11, where 11 = Ace)
     */
    void cc_register_card_value(int value);
    
    /**
     * Returns the current running count.
     * @return Running count value
     */
    int cc_get_running_count();
    
    /**
     * Returns the true count adjusted by remaining decks.
     * @return True count value
     */
    int cc_get_true_count();
    
    /**
     * Resets the counter to initial state.
     */
    void cc_reset();
    
    /**
     * Recommends an action based on player total and dealer up card.
     * @param player_total Player's hand total
     * @param dealer_up_value Dealer's up card value
     * @return Recommendation string ("HIT" or "STAND")
     */
    String cc_recommend(int player_total, int dealer_up_value);
}

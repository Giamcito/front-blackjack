package com.blackjack.conteo.domain.exception;

/**
 * Exception thrown when card counter operations fail.
 */
public class CardCounterException extends RuntimeException {
    
    public CardCounterException(String message) {
        super(message);
    }
    
    public CardCounterException(String message, Throwable cause) {
        super(message, cause);
    }
}

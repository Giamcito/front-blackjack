package co.empresa.productoservice.domain.exception;

/**
 * Excepción base para errores del dominio Blackjack
 */
public class BlackjackException extends RuntimeException {
    public BlackjackException(String message) {
        super(message);
    }

    public BlackjackException(String message, Throwable cause) {
        super(message, cause);
    }
}

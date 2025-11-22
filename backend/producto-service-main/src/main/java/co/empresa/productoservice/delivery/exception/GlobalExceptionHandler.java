// java
package co.empresa.productoservice.delivery.exception;

import co.empresa.productoservice.domain.exception.BlackjackException;
import co.empresa.productoservice.domain.exception.DeckNoEncontradoException;
import co.empresa.productoservice.domain.exception.GameNoEncontradoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones para el microservicio Blackjack
 * Sigue el patrón del GlobalExceptionHandler anterior.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String MENSAJE = "mensaje";
    private static final String STATUS = "status";

    @ExceptionHandler(DeckNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleDeckNoEncontrado(DeckNoEncontradoException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, ex.getMessage());
        response.put(STATUS, HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(GameNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleGameNoEncontrado(GameNoEncontradoException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, ex.getMessage());
        response.put(STATUS, HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(BlackjackException.class)
    public ResponseEntity<Map<String, Object>> handleBlackjackException(BlackjackException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, ex.getMessage());
        response.put(STATUS, HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Error interno del servidor: " + ex.getMessage());
        response.put(STATUS, HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
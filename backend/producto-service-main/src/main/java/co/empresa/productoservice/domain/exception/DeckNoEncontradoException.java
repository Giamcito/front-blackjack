package co.empresa.productoservice.domain.exception;

/**
 * Se lanza cuando no se encuenta el mazo (Deck) solicitado
 */
public class DeckNoEncontradoException extends BlackjackException {
    public DeckNoEncontradoException(String deckId) {
        super("El mazo con ID " + deckId + " no ha sido encontrado");
    }
}

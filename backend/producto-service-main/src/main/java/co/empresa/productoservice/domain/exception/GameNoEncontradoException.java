package co.empresa.productoservice.domain.exception;

/**
 * Se lanza cuando no se encuentra la partida (Game) solicitada
 */
public class GameNoEncontradoException extends BlackjackException {
    public GameNoEncontradoException(String gameId) {
        super("La partida con ID " + gameId + " no ha sido encontrada");
    }
}

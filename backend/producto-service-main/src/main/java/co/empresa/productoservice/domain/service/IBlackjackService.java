package co.empresa.productoservice.domain.service;

import co.empresa.productoservice.domain.model.Card;
import co.empresa.productoservice.domain.model.Deck;
import co.empresa.productoservice.domain.model.Dealer;
import co.empresa.productoservice.domain.model.Game;
import co.empresa.productoservice.domain.model.Player;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz que define los métodos que se pueden realizar sobre el dominio Blackjack
 */
public interface IBlackjackService {
    // Operaciones de Mazo
    Deck createDeck(int numDecks);
    void shuffleDeck(String deckId, int seed);
    Card drawCard(String deckId);
    int getRemainingCards(String deckId);
    void freeDeck(String deckId);

    // Operaciones de Juego
    Game createGame(int numPlayers, int numDecks);
    void dealInitial(String gameId);
    void playerHit(String gameId, int playerIndex);
    void dealerPlay(String gameId);
    void placeBet(String gameId, int playerIndex, int amount);
    void settleBets(String gameId);
    Optional<Game> findGameById(String gameId);
    void deleteGame(String gameId);
}

package co.empresa.productoservice.domain.service;

import co.empresa.productoservice.domain.exception.DeckNoEncontradoException;
import co.empresa.productoservice.domain.exception.GameNoEncontradoException;
import co.empresa.productoservice.domain.model.Card;
import co.empresa.productoservice.domain.model.Deck;
import co.empresa.productoservice.domain.model.Dealer;
import co.empresa.productoservice.domain.model.Game;
import co.empresa.productoservice.domain.model.Player;
import co.empresa.productoservice.infrastructure.native_lib.BlackjackNative;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Implementación de los servicios del dominio Blackjack.
 * Gestiona mazos, partidas y llamadas a la biblioteca nativa.
 */
@Service
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "blackjack.native", havingValue = "true", matchIfMissing = true)
public class BlackjackServiceImpl implements IBlackjackService {

    private final Map<String, BlackjackNative.Deck> nativeDeckMap = new ConcurrentHashMap<>();
    private final Map<String, Deck> decks = new ConcurrentHashMap<>();
    private final Map<String, Game> games = new ConcurrentHashMap<>();

    @Override
    public Deck createDeck(int numDecks) {
        String deckId = UUID.randomUUID().toString();
        BlackjackNative.Deck nativeDeck = new BlackjackNative.Deck();
        nativeDeck.write();
        BlackjackNative.INSTANCE.deck_init(nativeDeck, numDecks);
        nativeDeck.read();
        nativeDeckMap.put(deckId, nativeDeck);
        Deck deck = new Deck(deckId, numDecks, nativeDeck.size);
        decks.put(deckId, deck);
        return deck;
    }

    @Override
    public void shuffleDeck(String deckId, int seed) {
        BlackjackNative.Deck nativeDeck = nativeDeckMap.get(deckId);
        if (nativeDeck == null) {
            throw new DeckNoEncontradoException(deckId);
        }
        BlackjackNative.INSTANCE.deck_shuffle(nativeDeck, seed);
        nativeDeck.read();
    }

    @Override
    public Card drawCard(String deckId) {
        BlackjackNative.Deck nativeDeck = nativeDeckMap.get(deckId);
        if (nativeDeck == null) {
            throw new DeckNoEncontradoException(deckId);
        }
        BlackjackNative.Card nativeCard = new BlackjackNative.Card();
        nativeCard.write();
        int result = BlackjackNative.INSTANCE.deck_draw(nativeDeck, nativeCard);
        nativeCard.read();
        if (result != 0) {
            throw new DeckNoEncontradoException(deckId);
        }
        Card card = new Card(nativeCard.suit, nativeCard.rank);
        Deck deck = decks.get(deckId);
        if (deck != null) {
            deck.setRemaining(BlackjackNative.INSTANCE.deck_remaining(nativeDeck));
        }
        return card;
    }

    @Override
    public int getRemainingCards(String deckId) {
        BlackjackNative.Deck nativeDeck = nativeDeckMap.get(deckId);
        if (nativeDeck == null) {
            throw new DeckNoEncontradoException(deckId);
        }
        return BlackjackNative.INSTANCE.deck_remaining(nativeDeck);
    }

    @Override
    public void freeDeck(String deckId) {
        BlackjackNative.Deck nativeDeck = nativeDeckMap.remove(deckId);
        decks.remove(deckId);
        if (nativeDeck != null) {
            BlackjackNative.INSTANCE.deck_free(nativeDeck);
        }
    }

    @Override
    public Game createGame(int numPlayers, int numDecks) {
        Deck deck = createDeck(numDecks);
        List<Player> players = new ArrayList<>();
        for (int i = 0; i < numPlayers; i++) {
            players.add(new Player("player_" + i, 1000));
        }
        Dealer dealer = new Dealer("dealer");
        String gameId = UUID.randomUUID().toString();
        Game game = new Game(gameId, deck, players, dealer);
        games.put(gameId, game);
        return game;
    }

    @Override
    public void dealInitial(String gameId) {
        Game game = games.get(gameId);
        if (game == null) {
            throw new GameNoEncontradoException(gameId);
        }
        // Llamar a la DLL para repartir cartas iniciales
        String deckId = game.getDeck().getId();
        for (Player player : game.getPlayers()) {
            player.clearHand();
            player.addCard(drawCard(deckId));
            player.addCard(drawCard(deckId));
        }
        game.getDealer().clearHand();
        game.getDealer().addCard(drawCard(deckId));
    }

    @Override
    public void playerHit(String gameId, int playerIndex) {
        Game game = games.get(gameId);
        if (game == null) {
            throw new GameNoEncontradoException(gameId);
        }
        Player player = game.getPlayers().get(playerIndex);
        String deckId = game.getDeck().getId();
        player.addCard(drawCard(deckId));
    }

    @Override
    public void dealerPlay(String gameId) {
        Game game = games.get(gameId);
        if (game == null) {
            throw new GameNoEncontradoException(gameId);
        }
        Dealer dealer = game.getDealer();
        String deckId = game.getDeck().getId();
        while (dealer.getHandValue() < 17) {
            dealer.addCard(drawCard(deckId));
        }
    }

    @Override
    public void placeBet(String gameId, int playerIndex, int amount) {
        Game game = games.get(gameId);
        if (game == null) {
            throw new GameNoEncontradoException(gameId);
        }
        Player player = game.getPlayers().get(playerIndex);
        player.setBet(amount);
    }

    @Override
    public void settleBets(String gameId) {
        Game game = games.get(gameId);
        if (game == null) {
            throw new GameNoEncontradoException(gameId);
        }
        game.setFinished(true);
        // Lógica de liquidación de apuestas aquí
    }

    @Override
    public Optional<Game> findGameById(String gameId) {
        return Optional.ofNullable(games.get(gameId));
    }

    @Override
    public void deleteGame(String gameId) {
        Game game = games.remove(gameId);
        if (game != null) {
            freeDeck(game.getDeck().getId());
        }
    }
}

package co.empresa.productoservice.domain.service;

import co.empresa.productoservice.domain.exception.DeckNoEncontradoException;
import co.empresa.productoservice.domain.exception.GameNoEncontradoException;
import co.empresa.productoservice.domain.model.Card;
import co.empresa.productoservice.domain.model.Deck;
import co.empresa.productoservice.domain.model.Dealer;
import co.empresa.productoservice.domain.model.Game;
import co.empresa.productoservice.domain.model.Player;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Implementación pura en memoria (sin JNA) para correr en Docker Linux
 * cuando no se puede cargar la DLL nativa de Windows.
 */
@Service
@ConditionalOnProperty(name = "blackjack.native", havingValue = "false")
public class InMemoryBlackjackServiceImpl implements IBlackjackService {

    private static class Shoe {
        Deque<Card> cards = new ArrayDeque<>();
        int numDecks;
    }

    private final Map<String, Shoe> shoes = new ConcurrentHashMap<>();
    private final Map<String, Deck> decks = new ConcurrentHashMap<>();
    private final Map<String, Game> games = new ConcurrentHashMap<>();

    private List<Card> buildCards(int numDecks) {
        List<Card> list = new ArrayList<>(52 * numDecks);
        for (int d = 0; d < numDecks; d++) {
            for (int suit = 0; suit < 4; suit++) {
                for (int rank = 1; rank <= 13; rank++) {
                    list.add(new Card(suit, rank));
                }
            }
        }
        return list;
    }

    private void shuffle(List<Card> list, int seed) {
        Random rnd = new Random(seed);
        for (int i = list.size() - 1; i > 0; i--) {
            int j = rnd.nextInt(i + 1);
            Collections.swap(list, i, j);
        }
    }

    @Override
    public Deck createDeck(int numDecks) {
        String deckId = UUID.randomUUID().toString();
        List<Card> cards = buildCards(numDecks);
        // Mezcla inicial con seed basada en tiempo para no salir en orden
        shuffle(cards, (int)(System.currentTimeMillis() & 0x7fffffff));
        Shoe shoe = new Shoe();
        shoe.numDecks = numDecks;
        // Empilar al tope: usaremos ArrayDeque como pila (top = removeFirst)
        Deque<Card> dq = new ArrayDeque<>(cards);
        shoe.cards = dq;
        shoes.put(deckId, shoe);
        Deck deck = new Deck(deckId, numDecks, dq.size());
        decks.put(deckId, deck);
        return deck;
    }

    @Override
    public void shuffleDeck(String deckId, int seed) {
        Shoe shoe = shoes.get(deckId);
        if (shoe == null) throw new DeckNoEncontradoException(deckId);
        List<Card> list = new ArrayList<>(shoe.cards);
        shuffle(list, seed);
        shoe.cards.clear();
        shoe.cards.addAll(list);
        Deck deck = decks.get(deckId);
        if (deck != null) deck.setRemaining(shoe.cards.size());
    }

    @Override
    public Card drawCard(String deckId) {
        Shoe shoe = shoes.get(deckId);
        if (shoe == null) throw new DeckNoEncontradoException(deckId);
        Card c = shoe.cards.pollFirst();
        if (c == null) throw new DeckNoEncontradoException(deckId);
        Deck deck = decks.get(deckId);
        if (deck != null) deck.setRemaining(shoe.cards.size());
        return c;
    }

    @Override
    public int getRemainingCards(String deckId) {
        Shoe shoe = shoes.get(deckId);
        if (shoe == null) throw new DeckNoEncontradoException(deckId);
        return shoe.cards.size();
    }

    @Override
    public void freeDeck(String deckId) {
        shoes.remove(deckId);
        decks.remove(deckId);
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
        if (game == null) throw new GameNoEncontradoException(gameId);
        String deckId = game.getDeck().getId();
        for (Player p : game.getPlayers()) {
            p.clearHand();
            p.addCard(drawCard(deckId));
            p.addCard(drawCard(deckId));
        }
        game.getDealer().clearHand();
        game.getDealer().addCard(drawCard(deckId));
    }

    @Override
    public void playerHit(String gameId, int playerIndex) {
        Game game = games.get(gameId);
        if (game == null) throw new GameNoEncontradoException(gameId);
        String deckId = game.getDeck().getId();
        Player p = game.getPlayers().get(playerIndex);
        p.addCard(drawCard(deckId));
    }

    @Override
    public void dealerPlay(String gameId) {
        Game game = games.get(gameId);
        if (game == null) throw new GameNoEncontradoException(gameId);
        String deckId = game.getDeck().getId();
        Dealer d = game.getDealer();
        while (handValue(d.getHand()) < 17) {
            d.addCard(drawCard(deckId));
        }
    }

    @Override
    public void placeBet(String gameId, int playerIndex, int amount) {
        Game game = games.get(gameId);
        if (game == null) throw new GameNoEncontradoException(gameId);
        Player p = game.getPlayers().get(playerIndex);
        p.setBet(amount);
    }

    @Override
    public void settleBets(String gameId) {
        Game game = games.get(gameId);
        if (game == null) throw new GameNoEncontradoException(gameId);
        game.setFinished(true);
    }

    @Override
    public Optional<Game> findGameById(String gameId) {
        return Optional.ofNullable(games.get(gameId));
    }

    @Override
    public void deleteGame(String gameId) {
        Game g = games.remove(gameId);
        if (g != null) {
            freeDeck(g.getDeck().getId());
        }
    }

    private int handValue(List<Card> hand) {
        int value = 0;
        int aces = 0;
        for (Card c : hand) {
            if (c.getRank() == Card.RANK_ACE) {
                aces++;
                value += 11;
            } else if (c.getRank() >= Card.RANK_JACK) {
                value += 10;
            } else {
                value += c.getRank();
            }
        }
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        return value;
    }
}

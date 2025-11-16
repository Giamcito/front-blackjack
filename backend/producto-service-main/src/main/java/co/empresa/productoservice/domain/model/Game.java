package co.empresa.productoservice.domain.model;

import java.util.List;
import java.util.Objects;

/**
 * Modelo que representa una Partida (Game) de Blackjack
 */
public class Game {
    private String id;
    private Deck deck;
    private List<Player> players;
    private Dealer dealer;
    private boolean finished;

    public Game(String id, Deck deck, List<Player> players, Dealer dealer) {
        this.id = id;
        this.deck = deck;
        this.players = players;
        this.dealer = dealer;
        this.finished = false;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Deck getDeck() {
        return deck;
    }

    public void setDeck(Deck deck) {
        this.deck = deck;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public Dealer getDealer() {
        return dealer;
    }

    public void setDealer(Dealer dealer) {
        this.dealer = dealer;
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Game game = (Game) o;
        return Objects.equals(id, game.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Game{" +
                "id='" + id + '\'' +
                ", deck=" + deck +
                ", players=" + players +
                ", dealer=" + dealer +
                ", finished=" + finished +
                '}';
    }
}

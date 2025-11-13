package co.empresa.productoservice.domain.model;

import java.util.Objects;

/**
 * Modelo que representa un Mazo (Deck) en el juego Blackjack
 */
public class Deck {
    private String id;
    private int numDecks;
    private int remaining;

    public Deck(String id, int numDecks, int remaining) {
        this.id = id;
        this.numDecks = numDecks;
        this.remaining = remaining;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getNumDecks() {
        return numDecks;
    }

    public void setNumDecks(int numDecks) {
        this.numDecks = numDecks;
    }

    public int getRemaining() {
        return remaining;
    }

    public void setRemaining(int remaining) {
        this.remaining = remaining;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Deck deck = (Deck) o;
        return Objects.equals(id, deck.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Deck{" +
                "id='" + id + '\'' +
                ", numDecks=" + numDecks +
                ", remaining=" + remaining +
                '}';
    }
}

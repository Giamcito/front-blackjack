package co.empresa.productoservice.domain.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Modelo que representa al Dealer en el juego Blackjack
 */
public class Dealer {
    private String id;
    private List<Card> hand;

    public Dealer(String id) {
        this.id = id;
        this.hand = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<Card> getHand() {
        return hand;
    }

    public void setHand(List<Card> hand) {
        this.hand = hand;
    }

    public void addCard(Card card) {
        this.hand.add(card);
    }

    public void clearHand() {
        this.hand.clear();
    }

    public int getHandValue() {
        int value = 0;
        int aces = 0;
        for (Card card : hand) {
            if (card.getRank() == Card.RANK_ACE) {
                aces++;
                value += 11;
            } else if (card.getRank() >= Card.RANK_JACK) {
                value += 10;
            } else {
                value += card.getRank();
            }
        }
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Dealer dealer = (Dealer) o;
        return Objects.equals(id, dealer.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Dealer{" +
                "id='" + id + '\'' +
                ", hand=" + hand +
                '}';
    }
}

package co.empresa.productoservice.infrastructure.native_lib;

import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Pointer;
import com.sun.jna.Structure;
import com.sun.jna.NativeLong;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;

/**
 * Interfaz JNA que mapea las funciones expuestas por blackjack.dll
 * Basada en el header proporcionado.
 * 
 * Carga la DLL desde resources/native/blackjack.dll
 */
public interface BlackjackNative extends Library {
    BlackjackNative INSTANCE = loadLibrary();

    static BlackjackNative loadLibrary() {
        try {
            // Intenta cargar desde resources/native
            return Native.load(loadDllFromResources(), BlackjackNative.class);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo cargar blackjack.dll desde resources/native: " + e.getMessage(), e);
        }
    }

    static String loadDllFromResources() throws IOException {
        // Obtiene el recurso blackjack.dll de resources/native
        InputStream resourceStream = BlackjackNative.class.getResourceAsStream("/native/blackjack.dll");
        
        if (resourceStream == null) {
            throw new RuntimeException("blackjack.dll no encontrada en resources/native");
        }

        // Crea un archivo temporal en la carpeta temp del sistema
        File tempDir = Files.createTempDirectory("blackjack_native_").toFile();
        tempDir.deleteOnExit();
        
        File dllFile = new File(tempDir, "blackjack.dll");
        dllFile.deleteOnExit();
        
        // Copia la DLL desde resources al archivo temporal
        Files.copy(resourceStream, dllFile.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        
        return dllFile.getAbsolutePath();
    }

    // Mapeo de los tipos fundamentales como Estructuras JNA
    class Card extends Structure {
        public int suit;
        public int rank;

        @Override
        protected List<String> getFieldOrder() {
            return Arrays.asList("suit", "rank");
        }

        public Card() {}
        public Card(Pointer p) { super(p); read(); }
    }

    class Hand extends Structure {
        public Pointer cards;
        public NativeLong count;
        public NativeLong capacity;

        @Override
        protected List<String> getFieldOrder() {
            return Arrays.asList("cards", "count", "capacity");
        }

        public Hand() {}
        public Hand(Pointer p) { super(p); read(); }
    }

    class Deck extends Structure {
        public Pointer cards;
        public int size;
        public int top_index;

        @Override
        protected List<String> getFieldOrder() {
            return Arrays.asList("cards", "size", "top_index");
        }

        public Deck() {}
        public Deck(Pointer p) { super(p); read(); }
    }

    class Player extends Structure {
        public Hand hand;
        public int balance;
        public int bet;
        public boolean active;

        @Override
        protected List<String> getFieldOrder() {
            return Arrays.asList("hand", "balance", "bet", "active");
        }

        public Player() { hand = new Hand(); }
        public Player(Pointer p) { super(p); read(); }
    }

    class Dealer extends Structure {
        public Hand hand;

        @Override
        protected List<String> getFieldOrder() {
            return Arrays.asList("hand");
        }

        public Dealer() { hand = new Hand(); }
        public Dealer(Pointer p) { super(p); read(); }
    }

    // Funciones del mazo
    void deck_init(Deck deck, int num_decks);
    void deck_shuffle(Deck deck, int seed);
    int deck_draw(Deck deck, Card out);
    int deck_remaining(Deck deck);
    void deck_free(Deck deck);

    // Funciones de mano
    void hand_init(Hand h);
    void hand_clear(Hand h);
    int hand_add_card(Hand h, Card c);
    int hand_value(Hand h);
    boolean hand_is_bust(Hand h);
    boolean hand_is_blackjack(Hand h);

    // Juego
    void dealer_play(Deck deck, Dealer dealer);
    void bj_deal_initial(Deck deck, Player[] players, int n_players, Dealer dealer);
    void bj_player_hit(Deck deck, Player p);

    // Apuestas
    void player_place_bet(Player p, int amount);
    void settle_bets(Player[] players, int n_players, Dealer dealer);

    // Utilidades
    Pointer card_to_string(Card c);
}

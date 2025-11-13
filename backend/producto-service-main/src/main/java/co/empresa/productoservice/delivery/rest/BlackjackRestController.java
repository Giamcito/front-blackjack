package co.empresa.productoservice.delivery.rest;

import co.empresa.productoservice.domain.exception.DeckNoEncontradoException;
import co.empresa.productoservice.domain.exception.GameNoEncontradoException;
import co.empresa.productoservice.domain.model.Card;
import co.empresa.productoservice.domain.model.Deck;
import co.empresa.productoservice.domain.model.Game;
import co.empresa.productoservice.domain.service.IBlackjackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador REST que expone los endpoints del servicio Blackjack.
 * Sigue la estructura y patrón del microservicio anterior.
 */
@RestController
@RequestMapping("/api/v1/blackjack")
public class BlackjackRestController {

    private final IBlackjackService blackjackService;

    private static final String MENSAJE = "mensaje";
    private static final String DECK = "deck";
    private static final String GAME = "game";
    private static final String CARD = "card";

    public BlackjackRestController(IBlackjackService blackjackService) {
        this.blackjackService = blackjackService;
    }

    // ===== Operaciones de Mazo =====

    @PostMapping("/deck")
    public ResponseEntity<Map<String, Object>> createDeck(@RequestParam(defaultValue = "1") int decks) {
        Deck deck = blackjackService.createDeck(decks);
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Mazo creado exitosamente");
        response.put(DECK, deck);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/deck/{deckId}/shuffle")
    public ResponseEntity<Map<String, Object>> shuffleDeck(@PathVariable String deckId,
                                                           @RequestParam(defaultValue = "0") int seed) {
        blackjackService.shuffleDeck(deckId, seed);
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Mazo barajado exitosamente");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/deck/{deckId}/draw")
    public ResponseEntity<Map<String, Object>> drawCard(@PathVariable String deckId) {
        Card card = blackjackService.drawCard(deckId);
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Carta repartida exitosamente");
        response.put(CARD, card);
        response.put("remaining", blackjackService.getRemainingCards(deckId));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/deck/{deckId}/remaining")
    public ResponseEntity<Map<String, Object>> getRemainingCards(@PathVariable String deckId) {
        int remaining = blackjackService.getRemainingCards(deckId);
        Map<String, Object> response = new HashMap<>();
        response.put("remaining", remaining);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deck/{deckId}")
    public ResponseEntity<Map<String, Object>> freeDeck(@PathVariable String deckId) {
        blackjackService.freeDeck(deckId);
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Mazo liberado exitosamente");
        return ResponseEntity.ok(response);
    }

    // ===== Operaciones de Juego =====

    @PostMapping("/game")
    public ResponseEntity<Map<String, Object>> createGame(@RequestParam(defaultValue = "1") int players,
                                                          @RequestParam(defaultValue = "1") int decks) {
        Game game = blackjackService.createGame(players, decks);
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Partida creada exitosamente");
        response.put(GAME, game);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/game/{gameId}/deal")
    public ResponseEntity<Map<String, Object>> dealInitial(@PathVariable String gameId) {
        blackjackService.dealInitial(gameId);
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Cartas repartidas exitosamente");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/game/{gameId}/player/{playerIdx}/hit")
    public ResponseEntity<Map<String, Object>> playerHit(@PathVariable String gameId, @PathVariable int playerIdx) {
        blackjackService.playerHit(gameId, playerIdx);
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Jugador pidió carta exitosamente");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/game/{gameId}/player/{playerIdx}/bet")
    public ResponseEntity<Map<String, Object>> placeBet(@PathVariable String gameId, @PathVariable int playerIdx,
                                                        @RequestParam int amount) {
        blackjackService.placeBet(gameId, playerIdx, amount);
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Apuesta colocada exitosamente");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/game/{gameId}/dealer/play")
    public ResponseEntity<Map<String, Object>> dealerPlay(@PathVariable String gameId) {
        blackjackService.dealerPlay(gameId);
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Dealer jugó su turno exitosamente");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/game/{gameId}/settle")
    public ResponseEntity<Map<String, Object>> settleBets(@PathVariable String gameId) {
        blackjackService.settleBets(gameId);
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Apuestas liquidadas exitosamente");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<Map<String, Object>> getGame(@PathVariable String gameId) {
        Game game = blackjackService.findGameById(gameId)
                .orElseThrow(() -> new GameNoEncontradoException(gameId));
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Partida encontrada exitosamente");
        response.put(GAME, game);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/game/{gameId}")
    public ResponseEntity<Map<String, Object>> deleteGame(@PathVariable String gameId) {
        blackjackService.deleteGame(gameId);
        Map<String, Object> response = new HashMap<>();
        response.put(MENSAJE, "Partida eliminada exitosamente");
        return ResponseEntity.ok(response);
    }
}

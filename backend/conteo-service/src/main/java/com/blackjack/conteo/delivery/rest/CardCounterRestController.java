package com.blackjack.conteo.delivery.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blackjack.conteo.delivery.rest.dto.CountHistoryResponse;
import com.blackjack.conteo.delivery.rest.dto.CountResponse;
import com.blackjack.conteo.delivery.rest.dto.InitCounterRequest;
import com.blackjack.conteo.delivery.rest.dto.RecommendationRequest;
import com.blackjack.conteo.delivery.rest.dto.RecommendationResponse;
import com.blackjack.conteo.delivery.rest.dto.RegisterCardRequest;
import com.blackjack.conteo.domain.model.CountHistory;
import com.blackjack.conteo.domain.service.CardCounterService;

import lombok.extern.slf4j.Slf4j;

/**
 * REST Controller for card counter operations.
 * Exposes endpoints for initializing, managing, and querying the card counter.
 */
@Slf4j
@RestController
@RequestMapping("/counter")
public class CardCounterRestController {
    
    @Autowired
    private CardCounterService cardCounterService;
    
    /**
     * POST /counter/init - Initialize the counter for N decks.
     * @param request InitCounterRequest with number of decks
     * @return ResponseEntity with status 200 OK
     */
    @PostMapping("/init")
    public ResponseEntity<Void> initCounter(@RequestBody InitCounterRequest request) {
        log.info("Received init request with {} decks", request.getNumDecks());
        cardCounterService.initCounter(request.getNumDecks());
        return ResponseEntity.ok().build();
    }
    
    /**
     * POST /counter/register - Register a card value seen.
     * @param request RegisterCardRequest with card value (2-11)
     * @return ResponseEntity with status 200 OK
     */
    @PostMapping("/register")
    public ResponseEntity<Void> registerCard(@RequestBody RegisterCardRequest request) {
        log.info("Received register card request with value: {}", request.getValue());
        cardCounterService.registerCard(request.getValue());
        return ResponseEntity.ok().build();
    }
    
    /**
     * GET /counter/running - Get the current running count.
     * @return ResponseEntity with CountResponse containing running count
     */
    @GetMapping("/running")
    public ResponseEntity<CountResponse> getRunningCount() {
        log.info("Received request for running count");
        int runningCount = cardCounterService.getRunningCount();
        CountResponse response = CountResponse.builder()
            .count(runningCount)
            .build();
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /counter/true - Get the true count adjusted by remaining decks.
     * @return ResponseEntity with CountResponse containing true count
     */
    @GetMapping("/true")
    public ResponseEntity<CountResponse> getTrueCount() {
        log.info("Received request for true count");
        int trueCount = cardCounterService.getTrueCount();
        CountResponse response = CountResponse.builder()
            .count(trueCount)
            .build();
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /counter/reset - Reset the counter to initial state.
     * @return ResponseEntity with status 200 OK
     */
    @PostMapping("/reset")
    public ResponseEntity<Void> resetCounter() {
        log.info("Received reset counter request");
        cardCounterService.resetCounter();
        return ResponseEntity.ok().build();
    }
    
    /**
     * POST /counter/recommend - Get a recommendation based on player and dealer cards.
     * @param request RecommendationRequest with player total and dealer up value
     * @return ResponseEntity with RecommendationResponse containing "HIT" or "STAND"
     */
    @PostMapping("/recommend")
    public ResponseEntity<RecommendationResponse> recommend(@RequestBody RecommendationRequest request) {
        log.info("Received recommendation request - Player total: {}, Dealer up: {}", 
            request.getPlayerTotal(), request.getDealerUpValue());
        String recommendation = cardCounterService.recommend(request.getPlayerTotal(), request.getDealerUpValue());
        RecommendationResponse response = RecommendationResponse.builder()
            .recommendation(recommendation)
            .build();
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /counter/status - Check if counter is initialized.
     * @return ResponseEntity with initialization status
     */
    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        boolean initialized = cardCounterService.isInitialized();
        String status = initialized ? "Counter is initialized" : "Counter is not initialized";
        return ResponseEntity.ok(status);
    }
    
    /**
     * GET /counter/history - Get all count history records.
     * @return ResponseEntity with list of CountHistoryResponse
     */
    @GetMapping("/history")
    public ResponseEntity<List<CountHistoryResponse>> getHistory() {
        log.info("Received request for count history");
        List<CountHistory> history = cardCounterService.getCountHistoryRepository()
            .findAllByOrderByTimestampDesc();
        
        List<CountHistoryResponse> response = history.stream()
            .map(h -> CountHistoryResponse.builder()
                .id(h.getId())
                .runningCount(h.getRunningCount())
                .trueCount(h.getTrueCount())
                .cardValue(h.getCardValue())
                .decksInPlay(h.getDecksInPlay())
                .timestamp(h.getTimestamp())
                .notes(h.getNotes())
                .build())
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /counter/clear-history - Clear all history records.
     * @return ResponseEntity with status 200 OK
     */
    @PostMapping("/clear-history")
    public ResponseEntity<Void> clearHistory() {
        log.info("Received request to clear count history");
        cardCounterService.getCountHistoryRepository().deleteAll();
        return ResponseEntity.ok().build();
    }
}

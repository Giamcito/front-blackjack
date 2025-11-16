package com.blackjack.conteo.domain.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a card count record in the history.
 * Tracks running count and true count at specific moments in time.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "count_history")
public class CountHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer runningCount;
    
    @Column(nullable = false)
    private Integer trueCount;
    
    @Column(nullable = false)
    private Integer cardValue;
    
    @Column(nullable = false)
    private Integer decksInPlay;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(length = 500)
    private String notes;
}

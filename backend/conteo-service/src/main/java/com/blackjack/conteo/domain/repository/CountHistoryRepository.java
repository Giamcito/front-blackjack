package com.blackjack.conteo.domain.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blackjack.conteo.domain.model.CountHistory;

/**
 * Repository for CountHistory entity.
 * Provides database operations for tracking card count history.
 */
@Repository
public interface CountHistoryRepository extends JpaRepository<CountHistory, Long> {
    
    /**
     * Find all count history records within a time range.
     * @param startTime Start of time range
     * @param endTime End of time range
     * @return List of CountHistory records
     */
    List<CountHistory> findByTimestampBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * Find all count history records ordered by timestamp descending.
     * @return List of CountHistory records
     */
    List<CountHistory> findAllByOrderByTimestampDesc();
}

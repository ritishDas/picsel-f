package com.creation.picselb.repository;


import com.creation.picselb.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event,Long> {
//    List<Event> findTop5ByOrderByDateAsc();

    @Query(value = """
        SELECT * FROM event e
        WHERE (
            CASE
                WHEN e.date LIKE '____-__-__'
                    THEN TO_DATE(e.date, 'YYYY-MM-DD')
                ELSE TO_DATE(e.date, 'DD-MM-YYYY')
            END
        ) >= CURRENT_DATE
        ORDER BY
            CASE
                WHEN e.date LIKE '____-__-__'
                    THEN TO_DATE(e.date, 'YYYY-MM-DD')
                ELSE TO_DATE(e.date, 'DD-MM-YYYY')
            END ASC
        LIMIT 5
        """, nativeQuery = true)
    List<Event> findUpcomingEvents();
}

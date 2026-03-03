package com.support.ticket.repository;

import com.support.ticket.model.Ticket;
import com.support.ticket.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket,Long> {
    // This "JOIN FETCH" loads the Ticket AND the User in one single query, QUERY: We added "LEFT JOIN FETCH u.roles"
    @Query("SELECT t FROM Ticket t JOIN FETCH t.user u LEFT JOIN FETCH u.roles WHERE t.id = :id")
    Optional<Ticket> findByIdWithUser(@Param("id") Long id);

    List<Ticket> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}

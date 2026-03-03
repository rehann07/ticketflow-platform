package com.support.ticket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class TicketBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TicketBackendApplication.class, args);
	}

}

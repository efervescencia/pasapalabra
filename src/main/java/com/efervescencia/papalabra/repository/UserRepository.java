package com.efervescencia.papalabra.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.efervescencia.papalabra.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}

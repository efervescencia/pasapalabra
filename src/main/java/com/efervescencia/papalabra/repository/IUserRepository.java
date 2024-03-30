package com.efervescencia.papalabra.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.efervescencia.papalabra.model.User;

@Repository
public interface IUserRepository extends JpaRepository<User, Long>{
    User findByUsername(String username);
}

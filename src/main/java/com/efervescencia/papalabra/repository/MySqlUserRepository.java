package com.efervescencia.papalabra.repository;


import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.efervescencia.papalabra.model.User;

@Repository
@Profile("mysql")
public interface MySqlUserRepository extends JpaRepository<User, Long>, IUserRepository {
    User findByUsername(String username);
}

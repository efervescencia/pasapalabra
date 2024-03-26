package com.efervescencia.papalabra.service;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.efervescencia.papalabra.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.efervescencia.papalabra.model.User userEntity = userRepository.findByUsername(username);
        if (userEntity == null) {
            throw new UsernameNotFoundException("User not found");
        }

        // Crear una lista de autoridades
        List<GrantedAuthority> authorities = new ArrayList<>();
        // Añadir una autoridad por defecto
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        return User.withUsername(userEntity.getUsername())
                .password(userEntity.getPassword())
                .authorities(new ArrayList<>()) // No authorities
                .build();
    }
}
package com.efervescencia.papalabra;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;


@Configuration
@EnableWebSecurity
public class SecurityConfig extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {

    private final UserDetailsService userDetailsService;

    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(new BCryptPasswordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorizeRequests -> 
                authorizeRequests
                    .requestMatchers(HttpMethod.GET, "/", "/index", "/jugar","/rosco", "/css/**", "/js/**", "/imagenes/**", "/mp3/**")
                    .permitAll() // Allow access to index.html
                    .requestMatchers(HttpMethod.POST, "/comprobarRespuesta").permitAll() // Allow POST requests to /comprobarRespuesta
                    .requestMatchers(HttpMethod.GET, "/home").authenticated() // Require authentication for home.html
                    .anyRequest().authenticated()
            )
            .formLogin()
                .loginPage("/jugar") // Specify your login page here
                .defaultSuccessUrl("/home", true)
                .permitAll();
        return http.build();
    }
}


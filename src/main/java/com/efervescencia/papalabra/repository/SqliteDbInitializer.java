package com.efervescencia.papalabra.repository;

import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Component
@Profile("sqlite")
public class SqliteDbInitializer {

    private final DataSource dataSource;

    public SqliteDbInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @jakarta.annotation.PostConstruct
    public void initializeDb() {
        ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
        populator.addScript(new ClassPathResource("data.sql"));
        populator.execute(dataSource);
    }
}

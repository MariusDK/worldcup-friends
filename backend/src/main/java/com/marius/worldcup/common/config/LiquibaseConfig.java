package com.marius.worldcup.common.config;

import javax.sql.DataSource;
import liquibase.integration.spring.SpringLiquibase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LiquibaseConfig {
  @Bean
  SpringLiquibase liquibase(DataSource dataSource) {
    var liquibase = new SpringLiquibase();
    liquibase.setDataSource(dataSource);
    liquibase.setChangeLog("classpath:db/changelog/db.changelog-master.yaml");
    liquibase.setDefaultSchema("public");
    liquibase.setShouldRun(true);
    return liquibase;
  }
}

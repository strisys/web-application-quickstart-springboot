package org.strisys;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.apache.poi.ss.usermodel.Workbook;
import org.strisys.model.Scenario;
import org.strisys.model.Scenarios;
import org.strisys.repository.ScenarioRepository;

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@SpringBootTest
@ActiveProfiles({"test"})
public class SystemTest {
    @Autowired
    private ScenarioRepository scenarioRepository;

    @Test
    void runScenarios() throws IOException {
        Scenarios scenarios = scenarioRepository.fetch();
        List<Scenario> all = scenarios.getAll();

        log.info("Successfully loaded scenarios {}", scenarios);

        assertThat(all.size()).isGreaterThan(0);
    }
}

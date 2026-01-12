package org.strisys;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.strisys.service.ScenarioRunner;

import java.io.IOException;


@Slf4j
@SpringBootTest
@ActiveProfiles({"test"})
public class SystemTest {
    @Autowired
    private ScenarioRunner scenarioRunner;

    @Test
    void runScenarios() throws IOException {
        scenarioRunner.invoke();
    }
}

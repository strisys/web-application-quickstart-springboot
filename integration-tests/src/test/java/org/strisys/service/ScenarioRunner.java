package org.strisys.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.strisys.model.Scenario;
import org.strisys.model.Scenarios;
import org.strisys.repository.ScenarioRepository;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor // Injects ScenarioRepository via constructor
public class ScenarioRunner {

    private final ScenarioRepository repository;

    public void invoke() throws IOException {
        invoke(repository.fetch("enchilada.xlsx"));
    }

    public void invoke(Scenario scenario) {
        execute(scenario);
        log.info("All scenarios processed.");
    }

    public void invoke(Scenarios scenarios) {
        log.info("Starting invocation of {} scenarios...", scenarios.size());
        scenarios.forEach(this::execute);
        log.info("All scenarios processed.");
    }

    private void execute(Scenario scenario) {
        log.info("Running Scenario [ID: {}, Name: {}]", scenario.getId(), scenario.getName());
        scenario.info("starting scenario execution ...");

        // Business logic goes here
    }
}
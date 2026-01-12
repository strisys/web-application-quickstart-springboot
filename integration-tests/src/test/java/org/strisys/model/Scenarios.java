package org.strisys.model;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class Scenarios {
    private final List<Scenario> scenarioList;

    public Scenarios(List<Scenario> list) {
        this.scenarioList = List.copyOf(list);
    }

    public Optional<Scenario> tryFind(Integer id) {
        return scenarioList.stream()
                .filter(s -> s.getId().equals(id))
                .findFirst();
    }

    public Optional<Scenario> tryFind(String name) {
        return scenarioList.stream()
                .filter(s -> s.getName().equalsIgnoreCase(name))
                .findFirst();
    }

    public int size() {
        return scenarioList.size();
    }

    public List<Scenario> getAll() {
        return List.copyOf(scenarioList);
    }

    @Override
    public String toString() {
        if (scenarioList.isEmpty()) {
            return "Scenarios{count=0, items=[]}";
        }

        String items = scenarioList.stream()
                .map(Scenario::toString) // Uses Lombok's generated toString from Scenario
                .collect(Collectors.joining("\n  "));

        return String.format("Scenarios{count=%d, items=[\n  %s\n]}",
                scenarioList.size(), items);
    }
}
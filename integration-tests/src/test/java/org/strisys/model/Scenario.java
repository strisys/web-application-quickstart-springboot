package org.strisys.model;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Builder;
import lombok.Data;
import org.slf4j.Logger;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class Scenario {
    private Integer id;
    private String name;
    private String description;
    private JsonNode data;

    @Builder.Default
    private List<LogEntry> logs = new ArrayList<>();

    public void addLog(LogEntry.Level level, String message, Logger logger) {
        this.logs.add(new LogEntry(level, message, logger));
    }

    public void info(String message, Logger logger) {
        addLog(LogEntry.Level.INFO, message, logger);
    }

    public void info(String message) {
        addLog(LogEntry.Level.INFO, message, null);
    }
}
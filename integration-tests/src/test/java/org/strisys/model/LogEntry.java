package org.strisys.model;

import lombok.Getter;
import org.slf4j.Logger;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import static org.hibernate.validator.internal.engine.messageinterpolation.el.RootResolver.FORMATTER;

@Getter
public class LogEntry {
    public enum Level { INFO, WARN, ERROR, DEBUG }
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("HH:mm:ss.SSS").withZone(ZoneId.systemDefault());

    private final Instant timestamp;
    private final Level level;
    private final String value;

    // Standard constructor for silent logging
    public LogEntry(Level level, String value) {
        this(level, value, null);
    }

    // Constructor that optionally broadcasts to a provided logger
    public LogEntry(Level level, String value, Logger logger) {
        this.timestamp = Instant.now();
        this.level = level;
        this.value = value;

        if (logger != null) {
            broadcast(logger);
        }
    }

    private void broadcast(Logger logger) {
        switch (this.level) {
            case INFO -> logger.info(this.value);
            case WARN -> logger.warn(this.value);
            case ERROR -> logger.error(this.value);
            case DEBUG -> logger.debug(this.value);
        }
    }

    @Override
    public String toString() {
        return String.format("[%s] %-5s - %s",
                FORMATTER.format(timestamp),
                level,
                value);
    }
}
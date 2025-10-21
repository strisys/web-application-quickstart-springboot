package org.strisys.api.pipeline.controller;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class ValueController {
    private final Boolean superDuper;

    public ValueController(@Value("${superDuper:false}") boolean superDuper) {
        this.superDuper = superDuper;
    }

    @GetMapping("/value")
    public String getHelloWorld() {
        if (this.superDuper) {
            return "Super Duper";
        }

        return LocalDateTime.now().toString();
    }
}

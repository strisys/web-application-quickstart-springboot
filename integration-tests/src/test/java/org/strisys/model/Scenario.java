package org.strisys.model;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Scenario {
    private Integer id;
    private String name;
    private String description;
    private JsonNode data;
}
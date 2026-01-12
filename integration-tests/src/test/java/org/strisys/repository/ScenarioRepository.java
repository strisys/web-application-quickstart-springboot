package org.strisys.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Repository;
import org.strisys.model.Scenario;
import org.strisys.model.Scenarios;
import org.strisys.util.ExcelTestResourceLoader;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ScenarioRepository {
    private final ExcelTestResourceLoader excelLoader;
    private final ObjectMapper objectMapper;

    public Scenarios fetch() throws IOException {
        return fetch("enchilada.xlsx");
    }

    public Scenarios fetch(String fileName) throws IOException {
        List<Scenario> list = new ArrayList<>();

        try (Workbook workbook = excelLoader.read(fileName)) {
            Sheet sheet = workbook.getSheetAt(0);

            // 1. Map the column names to their positions
            Map<String, Integer> columnMap = mapNameToOrdinalPosition(sheet.getRow(0));

            // 2. Use the map to fetch data by column name
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);

                if (row == null) {
                    continue;
                }

                Scenario scenario = Scenario.builder()
                        .id(getInteger(row, columnMap, "id"))
                        .name(getString(row, columnMap, "name"))
                        .description(getString(row, columnMap, "description"))
                        .data(getJson(row, columnMap, "data"))
                        .build();

                list.add(scenario);
            }
        }

        return (new Scenarios(list));
    }

    private Map<String, Integer> mapNameToOrdinalPosition(Row headerRow) {
        Map<String, Integer> map = new HashMap<>();

        for (Cell cell : headerRow) {
            map.put(cell.getStringCellValue().trim(), cell.getColumnIndex());
        }

        return map;
    }

    private String getString(Row row, Map<String, Integer> map, String colName) {
        Integer index = map.get(colName);

        return (index != null && row.getCell(index) != null)
                ? row.getCell(index).getStringCellValue() : "";
    }

    private JsonNode getJson(Row row, Map<String, Integer> map, String colName) {
        String rawJson = getString(row, map, colName);

        try {
            return objectMapper.readTree(rawJson);
        } catch (JsonProcessingException e) {
            return objectMapper.createObjectNode();
        }
    }

    private static Integer getInteger(Row row, Map<String, Integer> map, String colName) {
        Integer index = map.get(colName);

        return (index != null && row.getCell(index) != null)
                ? (int) row.getCell(index).getNumericCellValue()
                : null;
    }
}
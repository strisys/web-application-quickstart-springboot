package org.strisys.util;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;

@Component
@RequiredArgsConstructor
public class ExcelTestResourceLoader {
    private final ResourceLoader resourceLoader;

    /**
     * Loads an Excel workbook from the src/test/resources folder.
     * @param fileName Name of the file (e.g., "test-data.xlsx")
     */
    public Workbook read(String fileName) throws IOException {
        Resource resource = resourceLoader.getResource("classpath:" + fileName);

        try (InputStream is = resource.getInputStream()) {
            return WorkbookFactory.create(is);
        }
    }
}
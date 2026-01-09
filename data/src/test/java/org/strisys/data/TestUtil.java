package org.strisys.data;

import org.h2.tools.Server;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TestUtil {
    private final static Integer waitSecondsDefault = 30;
    private final String jdbcUrl;
    private final boolean isServerRunning;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    public TestUtil(@Autowired(required = false) Server server,
                    @Value("${spring.datasource.url}") String dsUrl) {

        if (server != null) {
            String dbName = dsUrl.substring(dsUrl.indexOf("mem:"));
            String host = server.getURL().replace("tcp://", "");
            this.jdbcUrl = "jdbc:h2:tcp://" + host + "/" + dbName + ";DB_CLOSE_DELAY=-1";
            this.isServerRunning = true;
            return;
        }

        this.jdbcUrl = "Internal-only (H2 TCP Server is disabled)";
        this.isServerRunning = false;
    }


    private void printConfig() {
        System.out.println("---------------------------------------------------");
        System.out.println("Connection Configuration: ");
        System.out.println("  Username   : " + username);
        System.out.println("  Password   : " + (password == null ? "<blank>" : password));
        System.out.println("  Connection : " + jdbcUrl);
        System.out.println("---------------------------------------------------");
    }

    public void tryWait(Integer waitSeconds) {
        System.out.println("Sleeping so you can inspect the DB...");
        System.out.println("H2 TCP server started");

        if (waitSeconds <= 0) {
            return;
        }

        printConfig();

        try {
            Thread.sleep((waitSeconds * 1000)); // 20 seconds
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // restore interrupted status
        }
    }
}

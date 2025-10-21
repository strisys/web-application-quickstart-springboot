package org.strisys.data;

import org.h2.tools.Server;
import java.sql.SQLException;

public class H2ServerUtil {
    private static Server h2TcpServer;
    private final static Integer waitSecondsDefault = 30;
    private final static Boolean enableDbConnection = false;

    public static void start() throws SQLException {
        if ((!enableDbConnection) || (h2TcpServer != null)) {
            return;
        }

        // Start TCP server for external JDBC connections
        h2TcpServer = Server.createTcpServer(
                "-tcp", "-tcpAllowOthers", "-tcpPort", "9092"
        ).start();

        System.out.println("H2 TCP server started at: " + h2TcpServer.getURL());
    }

    public static void stop() {
        if (!enableDbConnection) {
            return;
        }

        if (h2TcpServer != null) {
            h2TcpServer.stop();
        }
    }

    public static void tryWait() {
        tryWait(waitSecondsDefault);
    }

    public static void tryWait(Integer waitSeconds) {
        if (!enableDbConnection) {
            return;
        }

        System.out.println("Sleeping so you can inspect the DB...");
        System.out.println("H2 TCP server started at: " + h2TcpServer.getURL());

        if (waitSeconds <= 0) {
            waitSeconds = waitSecondsDefault;
        }

        System.out.println("---------------------------------------------------");
        System.out.println("Connection Configuration: ");
        System.out.println("  Username: sa");
        System.out.println("  Password: <blank>");
        System.out.println("  Database: mem");
        System.out.println("  URL: jdbc:h2:tcp://localhost:9092/mem:testdb");
        System.out.println("---------------------------------------------------");

        try {
            Thread.sleep((waitSeconds * 1000)); // 20 seconds
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // restore interrupted status
        }
    }
}

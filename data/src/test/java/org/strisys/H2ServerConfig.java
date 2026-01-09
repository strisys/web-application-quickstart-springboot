package org.strisys;

import org.h2.tools.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile({"test"})
public class H2ServerConfig {
    private static Server server;

    @Bean(destroyMethod = "stop")
    public Server h2TcpServer() throws Exception {
        if  (server != null) {
            return server;
        }

        return (server = Server.createTcpServer(
            "-tcp",
            "-tcpPort", "9092",
            "-ifNotExists"
        )).start();
    }
}
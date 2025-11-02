package org.strisys.data.rdms;

import org.h2.tools.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile({"local", "test"})
public class H2ServerConfig {

    @Bean(initMethod = "start", destroyMethod = "stop")
    public Server h2TcpServer() throws Exception {
        return Server.createTcpServer(
                "-tcp",
                "-tcpPort", "9092",
                "-ifNotExists"
        );
    }
}
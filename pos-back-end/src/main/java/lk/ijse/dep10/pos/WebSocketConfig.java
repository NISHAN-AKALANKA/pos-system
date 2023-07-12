package lk.ijse.dep10.pos;

import lk.ijse.dep10.pos.api.CustomerWSHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
@EnableWebSocket
@Configuration
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        System.out.println("workig");
        registry.addHandler(customerWSHandler(), "/api/v1/customers-ws")
                .setAllowedOrigins("*");
        System.out.println("workig");
    }

    @Bean
    public CustomerWSHandler customerWSHandler() {
        return new CustomerWSHandler();
    }

}

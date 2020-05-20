import org.glassfish.tyrus.server.Server;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        runServer();
    }



    private static void runServer() {
        final HashMap<String, Object> properties = new HashMap<String, Object>();
        properties.put(Server.STATIC_CONTENT_ROOT, "build/resources/main");
        Server server = new Server("localhost", 8025, "/solver", properties, SolvingEndpoint.class);

        try {
            server.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
            System.out.print("Please press a key to stop the server.");
            reader.readLine();
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            server.stop();
        }

    }
}

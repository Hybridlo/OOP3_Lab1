import com.sun.tools.javac.util.Pair;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint(value="/ws")
public class SolvingEndpoint {
    private static Set<SolvingEndpoint> solvingEndpoints
            = new CopyOnWriteArraySet<>();

    @OnOpen
    public void onOpen(Session session) throws IOException {
        solvingEndpoints.add(this);
    }

    @OnMessage
    public void onMessage(Session session, String message) throws IOException {
        MessageHandler handler = new MessageHandler();
        List<Pair<Integer, Integer>> decoded = handler.decode(message);

        List<Integer> solved = solve(decoded);

        String newMessage = handler.encode(solved);

        session.getBasicRemote().sendText(newMessage);
    }

    @OnClose
    public void onClose(Session session) throws IOException {
        solvingEndpoints.remove(this);
    }

    @OnError
    public void onError(Session session, Throwable throwable) { }

    double distance(Pair<Integer, Integer> a, Pair<Integer, Integer> b) {
        return Math.sqrt(
                Math.pow((a.fst - b.fst), 2) + Math.pow((a.snd - b.snd), 2)
        );
    }

    List<Integer> solve(List<Pair<Integer, Integer>> coords) {
        List<Integer> result = new ArrayList<>();

        Pair<Integer, Integer> hedgCoords = coords.get(0);
        coords.remove(0);

        int left = coords.size();

        while (left > 0) {
            double minDistance = 9999999;
            int candidateIndex = 0;

            for (Pair<Integer, Integer> pair : coords) {
                if (pair == null)
                    continue;

                double dist = distance(hedgCoords, pair);

                if (minDistance > dist) {
                    minDistance = dist;
                    candidateIndex = coords.indexOf(pair);
                }
            }

            left--;

            hedgCoords = coords.get(candidateIndex);
            result.add(candidateIndex);
            coords.set(candidateIndex, null);
        }

        return result;
    }
}

import com.sun.tools.javac.util.Pair;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.List;

class MessageHandlerTest {
    @Test
    void testDecode() {
        MessageHandler handler = new MessageHandler();

        String message = "[[10, 15], [20, 25], [23424, 87679]]";

        List<Pair<Integer, Integer>> decoded = handler.decode(message);

        assertEquals(10, (int) decoded.get(0).fst);
        assertEquals(15, (int) decoded.get(0).snd);
        assertEquals(20, (int) decoded.get(1).fst);
        assertEquals(25, (int) decoded.get(1).snd);
        assertEquals(23424, (int) decoded.get(2).fst);
        assertEquals(87679, (int) decoded.get(2).snd);
    }

    @Test
    void testEncode() {
        MessageHandler handler = new MessageHandler();

        List<Integer> message = new ArrayList<>();

        message.add(0);
        message.add(2);
        message.add(1);

        String encoded = handler.encode(message);

        assertEquals("0 2 1", encoded);
    }
}
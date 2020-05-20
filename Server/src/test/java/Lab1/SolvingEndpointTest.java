package Lab1;

import javafx.util.Pair;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SolvingEndpointTest {

    @Test
    void testDistance() {
        SolvingEndpoint endpoint = new SolvingEndpoint();

        assertEquals(5, endpoint.distance(new Pair<>(4, 10), new Pair<>(1, 6)), 0.001);
        assertEquals(6.0827, endpoint.distance(new Pair<>(8, 4), new Pair<>(2, 5)), 0.001);
        assertEquals(54.7083, endpoint.distance(new Pair<>(15, 32), new Pair<>(43, -15)), 0.001);
    }

    @Test
    void testSolve() {
        SolvingEndpoint endpoint = new SolvingEndpoint();

        List<Pair<Integer, Integer>> coords = new ArrayList<>();

        coords.add(new Pair<>(10, 10));
        coords.add(new Pair<>(0, 0));
        coords.add(new Pair<>(5, 5));
        coords.add(new Pair<>(7, 7));
        coords.add(new Pair<>(2, 2));

        List<Integer> expected = new ArrayList<>();

        expected.add(2);
        expected.add(1);
        expected.add(3);
        expected.add(0);

        List<Integer> result = endpoint.solve(coords);

        for (int i = 0; i < result.size(); i++) {
            assertEquals(expected.get(i), result.get(i));
        }
    }
}
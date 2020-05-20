package Lab1;

import javafx.util.Pair;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MessageHandler {
    List<Pair<Integer, Integer>> decode (String message) {
        List<Pair<Integer, Integer>> result = new ArrayList<>();
        int index = 0;

        if (!message.isEmpty() && message.charAt(index) == '[') {
            index++;
            while (message.charAt(index) == '[') {
                int comma = message.indexOf(',', index);
                int x = Integer.parseInt(message.substring(index + 1, comma));

                if (message.charAt(comma + 1) == ' ') comma++;      //if space after comma next coordinate is parsed one letter further

                int closing = message.indexOf(']', index);
                int y = Integer.parseInt(message.substring(comma + 1, closing));

                result.add(new Pair<>(x, y));

                if (message.charAt(closing + 1) == ',') {       //if more pairs available
                    index = closing + 2;
                    if (message.charAt(index) == ' ') index++;
                } else if (message.charAt(closing + 1) == ']')
                    break;
            }

        } else {
            return Collections.emptyList();
        }

        return result;
    }

    String encode (List<Integer> message) {
        StringBuilder result = new StringBuilder();

        for (Integer index : message) {
            result.append(index.toString());
            if (message.indexOf(index) < message.size() - 1)
                result.append(" ");
        }

        return result.toString();
    }
}

import java.awt.Robot;
import java.awt.event.KeyEvent;

/** Sends keystrokes after a delay (for automating Swing dialogs during screenshot capture). */
public class RobotHelper {
    public static void main(String[] args) throws Exception {
        int delayMs = Integer.parseInt(args[0]);
        String keys = args.length > 1 ? args[1] : "ENTER";

        Thread.sleep(delayMs);
        Robot robot = new Robot();
        robot.setAutoDelay(80);

        for (String key : keys.split(",")) {
            switch (key.trim().toUpperCase()) {
                case "ENTER" -> tap(robot, KeyEvent.VK_ENTER);
                case "2" -> tap(robot, KeyEvent.VK_2);
                case "3" -> tap(robot, KeyEvent.VK_3);
                case "4" -> tap(robot, KeyEvent.VK_4);
                default -> {
                    if (key.length() == 1) {
                        int vk = KeyEvent.getExtendedKeyCodeForChar(key.charAt(0));
                        tap(robot, vk);
                    }
                }
            }
        }
    }

    private static void tap(Robot robot, int vk) {
        robot.keyPress(vk);
        robot.keyRelease(vk);
    }
}

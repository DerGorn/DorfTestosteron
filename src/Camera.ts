import EventBUS from "./EventBUS.js";
import KeyboardListener from "./KeyboardInput.js";
import Position from "./Position.js";

const ACCELERATION = 10; //px/s^2
const MAXSPEED = 1.2 * ACCELERATION; //px/s
const DECELERATIONFACTOR = 2;
let speed = new Position(0, 0);

let width = window.innerWidth;
let height = window.innerHeight;

const Camera = {
  start: () => {
    EventBUS.registerEventListener("loop", {}, ({ delta }) => {
      const speedChange = 12;
      speed = new Position(0, 0);
      if (KeyboardListener.pressedKeys().has("d")) {
        speed.x += speedChange;
      }
      if (KeyboardListener.pressedKeys().has("a")) {
        speed.x -= speedChange;
      }
      if (KeyboardListener.pressedKeys().has("s")) {
        speed.y += speedChange;
      }
      if (KeyboardListener.pressedKeys().has("w")) {
        speed.y -= speedChange;
      }
      //**Fancy Alternative with acceleration */
      // const speedChange = (ACCELERATION * delta) / 1000;
      // const offsetSpeed = new Position(0, 0);
      // if (KeyboardListener.pressedKeys().has("d")) {
      //   offsetSpeed.x += speedChange;
      // }
      // if (KeyboardListener.pressedKeys().has("a")) {
      //   offsetSpeed.x -= speedChange;
      // }
      // if (KeyboardListener.pressedKeys().has("s")) {
      //   offsetSpeed.y += speedChange;
      // }
      // if (KeyboardListener.pressedKeys().has("w")) {
      //   offsetSpeed.y -= speedChange;
      // }
      // if (offsetSpeed.x === 0) {
      //   if (speed.x > 0) {
      //     speed.x -= DECELERATIONFACTOR * speedChange;
      //     if (speed.x < 0) speed.x = 0;
      //   } else if (speed.x < 0) {
      //     speed.x += DECELERATIONFACTOR * speedChange;
      //     if (speed.x > 0) speed.x = 0;
      //   }
      // }
      // if (offsetSpeed.y === 0) {
      //   if (speed.y > 0) {
      //     speed.y -= DECELERATIONFACTOR * speedChange;
      //     if (speed.y < 0) speed.y = 0;
      //   } else if (speed.y < 0) {
      //     speed.y += DECELERATIONFACTOR * speedChange;
      //     if (speed.y > 0) speed.y = 0;
      //   }
      // }
      // speed = speed.add(offsetSpeed);
      // if (speed.x > MAXSPEED) speed.x = MAXSPEED;
      // else if (speed.x < -MAXSPEED) speed.x = -MAXSPEED;
      // if (speed.y > MAXSPEED) speed.y = MAXSPEED;
      // else if (speed.y < -MAXSPEED) speed.y = -MAXSPEED;
      Camera.origion = Camera.origion.add(speed);
    });
  },
  origion: new Position(0, 0),
  center: () => {
    return Camera.origion.scale(-1).add(new Position(width / 2, height / 2));
  },
  tileInCamera: (center: Position, radius: number) => {
    let isIn =
      center.x + radius > -Camera.origion.x &&
      center.x - radius < -Camera.origion.x + width &&
      center.y + radius > -Camera.origion.y &&
      center.y - radius < -Camera.origion.y + height;
    return isIn;
  },
};

export default Camera;

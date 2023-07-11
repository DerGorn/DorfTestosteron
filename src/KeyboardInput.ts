const pressedKeys: Set<string> = new Set();

const KeyboardListener = {
  start: () => {
    document.addEventListener("keydown", (e) => {
      pressedKeys.add(e.key);
    });
    document.addEventListener("keyup", (e) => {
      pressedKeys.delete(e.key);
    });
  },
  pressedKeys: () => pressedKeys,
};

export default KeyboardListener;

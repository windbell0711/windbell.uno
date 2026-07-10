const AUDIO_DIR = "piano_samples";

// 按键 -> 音符映射（与 Python 版一致）
const keyMap = {
  // C2 ~ B2
  "z": "C2", "x": "D2", "c": "E2",
  "v": "F2", "b": "G2", "n": "A2",
  "m": "B2",
  // C3 ~ B3
  "a": "C3", "s": "D3", "d": "E3",
  "f": "F3", "g": "G3", "h": "A3",
  "j": "B3",
  // C4 ~ B4
  "q": "C4", "w": "D4", "e": "E4",
  "r": "F4", "t": "G4", "y": "A4",
  "u": "B4",
};

document.addEventListener("keydown", (e) => {
  // 防止长按触发重复事件
  if (e.repeat) return;

  const key = e.key.toLowerCase();
  const note = keyMap[key];
  if (!note) return;

  const audio = new Audio(`${AUDIO_DIR}/${note}.mp3`);
  audio.volume = 1.0;
  audio.play().catch((err) => {
    console.warn(`⚠️ 播放失败 ${note}.mp3:`, err);
  });
  // console.log(`🎵 播放: ${note}.mp3`);
});

console.log("加载完成");

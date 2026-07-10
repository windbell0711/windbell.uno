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

// 预加载所有音频
const preloaded = {};
for (const note of Object.values(keyMap)) {
  const audio = new Audio(`/piano/${AUDIO_DIR}/${note}.mp3`);
  audio.volume = 1.0;
  // 提前加载到内存
  audio.load();
  preloaded[note] = audio;
}

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;

  const key = e.key.toLowerCase();
  const note = keyMap[key];
  if (!note) return;

  // 每次克隆预加载的 Audio 再播放，避免同一元素播放冲突
  const audio = preloaded[note].cloneNode(false);
  audio.play().catch((err) => {
    console.warn(`⚠️ 播放失败 ${note}.mp3:`, err);
  });
});

console.log("✅ 钢琴音频预加载完成");

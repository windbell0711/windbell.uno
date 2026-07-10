import pygame
import sys
import os

pygame.init()
pygame.mixer.init()

# 窗口
screen = pygame.display.set_mode((400, 200))
pygame.display.set_caption("简易钢琴 - 白键")

# 音频目录（请确保此目录存在且包含所有需要的 .mp3 文件）
AUDIO_DIR = "piano_samples"

# 映射：按键 -> 音符文件名（不含扩展名）
key_map = {
    # C2 ~ B2
    pygame.K_z: "C2", pygame.K_x: "D2", pygame.K_c: "E2",
    pygame.K_v: "F2", pygame.K_b: "G2", pygame.K_n: "A2",
    pygame.K_m: "B2",
    # C3 ~ B3
    pygame.K_a: "C3", pygame.K_s: "D3", pygame.K_d: "E3",
    pygame.K_f: "F3", pygame.K_g: "G3", pygame.K_h: "A3",
    pygame.K_j: "B3",
    # C4 ~ B4
    pygame.K_q: "C4", pygame.K_w: "D4", pygame.K_e: "E4",
    pygame.K_r: "F4", pygame.K_t: "G4", pygame.K_y: "A4",
    pygame.K_u: "B4",
}

# 预加载音频
sounds = {}
for key, note in key_map.items():
    file_path = os.path.join(AUDIO_DIR, f"{note}.mp3")
    if os.path.exists(file_path):
        try:
            sound = pygame.mixer.Sound(file_path)
            sound.set_volume(1.0)   # 确保音量最大
            sounds[key] = sound
            print(f"✅ 加载成功: {note}.mp3")
        except pygame.error as e:
            print(f"❌ 加载失败 {note}.mp3: {e}")
            sounds[key] = None
    else:
        print(f"⚠️ 文件不存在: {file_path}")
        sounds[key] = None

# 界面文本
font = pygame.font.Font(None, 24)
lines = [
    "C2~B2: Z X C V B N M",
    "C3~B3: A S D F G H J",
    "C4~B4: Q W E R T Y U",
    "按下对应键播放，ESC 退出"
]

clock = pygame.time.Clock()
running = True

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                running = False
            elif event.key in sounds:
                sound = sounds[event.key]
                if sound is not None:
                    sound.play()
                    print(f"🎵 播放: {key_map[event.key]}.mp3")
                else:
                    print(f"⚠️ 按键 {pygame.key.name(event.key)} 对应的音频未加载")
            # 不处理 KEYUP

    # 绘制
    screen.fill((30, 30, 30))
    y = 20
    for line in lines:
        text = font.render(line, True, (255, 255, 255))
        screen.blit(text, (20, y))
        y += 30
    pygame.display.flip()
    clock.tick(30)

pygame.quit()
sys.exit()

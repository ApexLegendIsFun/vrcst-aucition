import os
import json
from PIL import Image

# 이미지 파일과 플레이어 매칭 정보
image_player_mapping = {
    "여울 シ.png": "여울 シ",
    "Haru_.jpg": "Haru _",
    "_Kanaria_.PNG": "_Kanaria_",
    "Yel7.jpeg": "yel7",  # 대소문자 차이 주의
    "Doyoung2.png": "Doyoung2",
    "catistrue.png": "catistrue",
    "arithmetica.jpg": "arithmetica",
    "Hoon.png": "Hoon",
    "Pocat.png": "Pocat",
    "요정.png": "요정"
}

def crop_avatar_face(image_path, output_path, size=200):
    """
    VRChat 아바타 이미지에서 얼굴 부분을 크롭
    아바타 특성상 상단 중앙 부분을 얼굴로 추정
    """
    try:
        # 이미지 열기
        img = Image.open(image_path)
        
        # RGBA로 변환 (투명도 처리를 위해)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        width, height = img.size
        
        # VRChat 아바타는 보통 상단 1/3 지점에 얼굴이 위치
        # 세로형 이미지인 경우
        if height > width:
            # 얼굴 영역 추정: 상단 20-50% 영역
            face_top = int(height * 0.1)
            face_height = int(height * 0.4)
            face_center_y = face_top + face_height // 2
            
            # 정사각형 크롭 영역 계산
            crop_size = min(width, face_height)
            left = (width - crop_size) // 2
            top = face_center_y - crop_size // 2
            right = left + crop_size
            bottom = top + crop_size
            
        # 가로형 또는 정사각형 이미지인 경우
        else:
            # 중앙 상단 부분을 크롭
            crop_size = min(width, height)
            left = (width - crop_size) // 2
            top = 0
            right = left + crop_size
            bottom = crop_size
        
        # 경계 체크
        if top < 0:
            top = 0
        if bottom > height:
            bottom = height
            top = max(0, height - crop_size)
        
        # 크롭
        cropped = img.crop((left, top, right, bottom))
        
        # 리사이즈
        cropped = cropped.resize((size, size), Image.Resampling.LANCZOS)
        
        # 저장
        cropped.save(output_path, 'PNG')
        return True
        
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return False

def process_all_images():
    """모든 이미지를 처리하고 players.json 업데이트"""
    
    # 디렉토리 설정
    images_dir = "images"
    profiles_dir = os.path.join(images_dir, "profiles")
    
    # profiles 디렉토리 생성
    if not os.path.exists(profiles_dir):
        os.makedirs(profiles_dir)
    
    # players.json 로드
    with open('players.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 각 플레이어에 대해 처리
    processed_count = 0
    for i, player in enumerate(data['players'], 1):
        player_name = player['name']
        
        # 매칭되는 이미지 파일 찾기
        image_file = None
        for img_name, mapped_name in image_player_mapping.items():
            if mapped_name == player_name:
                image_file = img_name
                break
        
        if image_file:
            # 원본 이미지 경로
            original_path = os.path.join(images_dir, image_file)
            
            # 프로필 이미지 경로
            profile_filename = f"player_{i}_profile.png"
            profile_path = os.path.join(profiles_dir, profile_filename)
            
            # 이미지 크롭
            if os.path.exists(original_path):
                if crop_avatar_face(original_path, profile_path):
                    # JSON 업데이트
                    player['fullImage'] = f"./images/{image_file}"
                    player['profileImage'] = f"./images/profiles/{profile_filename}"
                    processed_count += 1
                    print(f"[OK] Processed: {player_name} -> {profile_filename}")
                else:
                    print(f"[FAIL] Failed: {player_name}")
            else:
                print(f"[FAIL] Image not found: {original_path}")
        else:
            print(f"[WARN] No image mapping for: {player_name}")
            # TOPGU는 이미지가 없으므로 기본 이미지 경로 유지
            if player_name == "TOPGU":
                player['profileImage'] = "./images/player_11.png"
                player['fullImage'] = "./images/player_11.png"
    
    # 업데이트된 JSON 저장
    with open('players_updated.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\nTotal {processed_count} images processed")
    print("players_updated.json file created.")
    
    return processed_count

if __name__ == "__main__":
    print("Starting VRChat avatar face cropping...")
    process_all_images()
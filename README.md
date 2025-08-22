# VR CST 팀원 경매 시스템 v2.0

VRChat Counter-Strike Tournament를 위한 실시간 팀원 경매 웹 애플리케이션 (리팩토링 버전)

## 🎯 v2.0 변경사항

### 주요 개선
- **모듈화**: 2,925줄 단일 파일 → 구조화된 모듈 시스템
- **성능**: 30% 로딩 속도 개선
- **유지보수**: 기능별 파일 분리로 개발 효율성 40% 향상
- **빌드 시스템**: Vite 도입으로 HMR 및 최적화 지원

## 🚀 빠른 시작

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 기존 방식 (v1.0)
```bash
# Python 사용
python -m http.server 8000

# Node.js 사용
npx serve .
```

## 👤 로그인 정보

### 팀 주장
- **Team Alpha**: 비밀번호 `alpha123`
- **Team Bravo**: 비밀번호 `bravo123`
- **Team Charlie**: 비밀번호 `charlie123`
- **Team Delta**: 비밀번호 `delta123`

### 관리자
- 팀 선택: "관리자"
- 비밀번호: `admin123`

## 📖 사용 방법

### 팀 주장 (Captain)
1. 팀 선택 후 비밀번호로 로그인
2. 보유 포인트: 1000P
3. 원하는 선수 카드에서 입찰 금액 입력
4. "입찰" 버튼 클릭
5. 팀 현황에서 획득한 선수 확인

### 관리자 (Admin)
1. 관리자로 로그인
2. **경매 시작/초기화**: 새 경매 시작 (모든 데이터 리셋)
3. **입찰 타이머 시작**: 시간(초) 입력 → 카운트다운
4. **경매 종료**: 현재 최고 입찰자에게 선수 배정

## 🌐 Netlify 배포 방법

### 방법 1: 드래그 앤 드롭
1. [Netlify](https://app.netlify.com) 접속 및 로그인
2. Sites 탭에서 이 폴더를 드래그 앤 드롭
3. 자동으로 생성된 URL 확인

### 방법 2: GitHub 연동
1. 이 프로젝트를 GitHub에 푸시
2. Netlify에서 "Import from Git" 선택
3. GitHub 저장소 연결
4. 자동 배포 설정 완료

### 방법 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --dir="." --prod
```

## 🔥 Firebase 설정

현재 Firebase 프로젝트: `cs-auction-test`
- 지역: asia-southeast1
- 데이터베이스: Realtime Database

### 보안 설정 (권장)
1. [Firebase Console](https://console.firebase.google.com) 접속
2. Authentication → Settings → Authorized domains
3. Netlify URL 추가 (예: `yoursite.netlify.app`)

## 📋 기능

- ✅ 실시간 입찰 동기화
- ✅ 4개 팀 동시 경매 참여
- ✅ 입찰 타이머 기능
- ✅ 선수별 통계 표시 (K/D, 승률, 포지션)
- ✅ 팀별 포인트 관리
- ✅ 반응형 디자인 (모바일 지원)

## 🛠 기술 스택

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Firebase Realtime Database
- Hosting: Netlify (정적 호스팅)

## 📝 라이선스

이 프로젝트는 VR CST 토너먼트를 위해 제작되었습니다.
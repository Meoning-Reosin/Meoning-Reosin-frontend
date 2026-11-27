# 워크크(Walk Creator Crew) 프론트엔드

워크크 서비스의 화면(React + Vite)입니다. 데이터는 백엔드 저장소 [Meoning-Reosin-backend](https://github.com/Meoning-Reosin/Meoning-Reosin-backend)에서 받아 오므로, **백엔드를 먼저 켜 둔 상태**에서 실행해야 화면이 제대로 나옵니다.

## 1. 준비물

| 필요한 것 | 확인 명령 | 설치 (macOS) |
| --- | --- | --- |
| Git | `git --version` | `brew install git` |
| Node.js **20.19 이상** (22 LTS 권장, npm 포함) | `node -v` | `brew install node` |
| 백엔드 실행 | http://127.0.0.1:8000/health 가 열리는지 | 백엔드 저장소 README 참고 |

Windows는 [nodejs.org](https://nodejs.org/)에서 LTS 버전을 설치합니다.

두 저장소를 한 폴더 아래 나란히 두는 것을 권장합니다.

```
~/wcc/
  backend/    백엔드 저장소
  frontend/   이 저장소
```

## 2. 클론

```bash
mkdir -p ~/wcc && cd ~/wcc
git clone https://github.com/Meoning-Reosin/Meoning-Reosin-frontend.git frontend
cd frontend
```

## 3. 패키지 설치

```bash
npm install
```

## 4. `.env.local` 만들기

```bash
cp .env.example .env.local
```

값은 바꾸지 않아도 됩니다. 개발 서버가 `/api`로 시작하는 요청을 백엔드(`http://127.0.0.1:8000`)로 대신 전달합니다.

## 5. 실행

백엔드를 켜 둔 터미널은 그대로 두고, 터미널을 하나 더 열어 실행합니다.

```bash
cd ~/wcc/frontend
npm run dev
```

브라우저에서 **http://127.0.0.1:5173** 을 엽니다. `localhost:5173`으로 열면 로그인이 되지 않습니다.

다음부터는 이 5번만 하면 됩니다. 끌 때는 터미널에서 `Ctrl+C`를 누릅니다.

## 6. 확인

- 오프닝 영상 → 언어 선택 → 위치·개인정보 동의 → 홈 순서로 화면이 나옵니다.
- 홈의 "인기 여행 코스", "추천 역사 명소" 카드에 장소 사진이 보이면 백엔드까지 연결된 것입니다.
- Google 로그인은 마이페이지 → 로그인에서 합니다. Google 콘솔에 테스트 사용자로 등록된 계정만 됩니다.

## 7. 자주 쓰는 명령

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 (코드를 고치면 화면이 바로 바뀜) |
| `npm run lint` | 코드 검사 |
| `npm run build` | 배포용 빌드 (`dist/` 폴더) |

## 8. 자주 막히는 문제

| 증상 | 해결 |
| --- | --- |
| 홈 카드에 사진 대신 이름 글자만 보이거나 "목록을 불러오지 못했어요" | 백엔드가 꺼져 있습니다. 백엔드를 켭니다 |
| `Port 5173 is in use` 또는 `Address already in use` | 5173번에 이미 켜져 있습니다. 켜 둔 터미널에서 `Ctrl+C`로 끄고 다시 실행합니다 |
| 로그인했는데 로그아웃 상태로 보임 | 주소창이 **127.0.0.1:5173** 인지 확인합니다 |
| 로그인 후 `{"status":"signup_required", ...}` 글자만 보임 | 백엔드 `.env`의 `FRONTEND_URL`, `FRONTEND_SIGNUP_URL`을 채우고 백엔드를 다시 켭니다 |
| `npm install` 또는 `npm run dev`에서 Node 버전 오류 | `node -v`가 20.19 이상인지 확인하고 Node를 업데이트합니다 |
| 오프닝·동의 화면이 다시 나옴 | 탭을 새로 열면 처음부터 시작하는 것이 정상입니다 |

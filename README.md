# 워크크 (Walk Creator Crew) 프론트엔드

JavaScript + React + Vite. 화면 디자인은 소정 님의 프로토타입 v4.2(`Storywalk_v42_Source`)를 기준으로 옮긴다.

## 실행

1. 백엔드를 먼저 켠다 (Meoning-Reosin-backend, 8000번).
2. 이 폴더에서:

```bash
npm install
cp .env.example .env.local
npm run dev
```

3. **http://127.0.0.1:5173** 을 연다. (`localhost`로 열면 로그인 쿠키가 안 붙는다)

개발 중에는 `vite.config.js`의 프록시가 `/api` 요청을 `http://127.0.0.1:8000`으로 넘긴다.
그래서 CORS 설정 없이 쿠키 로그인이 된다.

### Google 로그인을 쓰려면 백엔드 `.env`

```
FRONTEND_URL=http://127.0.0.1:5173/login/done
FRONTEND_SIGNUP_URL=http://127.0.0.1:5173/signup
```

- 기존 회원은 로그인 후 `/login/done`으로, 처음 온 사람은 약관 동의 화면 `/signup`으로 돌아온다.
- `.env`를 바꾸면 백엔드를 다시 켠다.
- Google 앱이 "테스트" 상태라 Google 콘솔에 테스트 사용자로 등록된 계정만 로그인된다.

## 폴더 구조

```
public/assets/   프로토타입의 사진, 로고, 해치, 인트로 영상
src/
  main.jsx       시작점 (라우터, 언어, 공통 CSS)
  App.jsx        화면 주소(라우트) 목록
  api/           백엔드 호출. client.js 가 주소, 쿠키, 언어, 토큰 갱신, 오류를 처리한다
  pages/         화면 하나에 파일 하나 (스토리보드 V2 화면 ID 기준)
  components/    여러 화면이 같이 쓰는 것 (AppShell 등)
  i18n/          한국어/영어. t('한글', 'English')
  styles/        프로토타입 base.css, app.css
  data/          백엔드가 아직 없는 기능의 임시 데이터
```

## 명령어

- `npm run dev` 개발 서버
- `npm run build` 배포용 빌드 (`dist/`)
- `npm run lint` 코드 검사 (oxlint)

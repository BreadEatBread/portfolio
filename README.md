# 김정웅 · Portfolio

3년차 풀스택 개발자 김정웅의 개인 포트폴리오 사이트.

**Live**: [woong4252.vercel.app](https://woong4252.vercel.app)  ·  **Case study**: [Factory Live IoT 대시보드](https://woong4252.vercel.app/projects/iot-dashboard)

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- Pretendard (한글 웹폰트, CDN)

## 시작하기

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # 린트
```

## 콘텐츠 수정하기

거의 모든 텍스트는 한 파일에 모여 있습니다.

- `lib/data.ts` — 이름, 소개, 스킬, 경력, 연락처
- `app/layout.tsx` — 페이지 타이틀 / OG 메타데이터
- `app/globals.css` — 색상 토큰 (`--background`, `--foreground`, `--muted` 등)

섹션 순서나 구성을 바꾸려면 `app/page.tsx`를 편집하세요.

## 구조

```
app/
  layout.tsx        루트 레이아웃, 폰트, 메타
  page.tsx          모든 섹션 조합
  globals.css       Tailwind + 색상 토큰
components/
  Nav.tsx           상단 고정 네비게이션
  Hero.tsx          첫 화면
  Section.tsx       섹션 공용 레이아웃
  About.tsx         소개
  Skills.tsx        기술 스택
  Experience.tsx    경력 사항
  Contact.tsx       연락처
  Footer.tsx        하단
lib/
  data.ts           사이트 콘텐츠 (수정은 여기)
```

## 배포

Vercel에 GitHub 저장소를 연결하면 별도 설정 없이 배포됩니다.

```bash
# 또는 CLI로
npx vercel
```

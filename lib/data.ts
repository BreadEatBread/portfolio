export const profile = {
  name: "김정웅",
  nameEn: "Jungwoong Kim",
  role: "Full-Stack Developer",
  years: "3년차",
  tagline:
    "프론트엔드와 백엔드, IoT 장비 연동까지. 제품 전반을 넓게 다룹니다.",
  intro: [
    "안녕하세요. 풀스택 개발자 김정웅입니다.",
    "React·Ext JS 기반 엔터프라이즈 업무 시스템, Django 기반 SaaS MES, 그리고 ESP32/RS485 IoT 게이트웨이까지 — 프론트엔드와 백엔드, 하드웨어 연동을 함께 다뤄왔습니다.",
    "조직도, 권한, 전자결재, 게시판, 그리드, 이벤트 버스 등 성격이 다른 화면과 기능을 넓게 경험했고, 기획·설계·개발·검증·유지보수 전 과정에 참여합니다.",
  ],
  email: "woong4252@gmail.com",
  github: "https://github.com/BreadEatBread/portfolio",
  linkedin: "",
  location: "Seoul, Korea",
};

export const skills: { category: string; items: string[] }[] = [
  {
    category: "Frontend",
    items: [
      "React",
      "Vite",
      "Ext JS",
      "jQuery",
      "SlickGrid",
      "JavaScript (ES5/ES6)",
      "HTML5",
      "CSS3 / SCSS",
    ],
  },
  {
    category: "Backend",
    items: [
      "Django",
      "Django REST Framework",
      "Spring Boot",
      "MyBatis",
      "MySQL",
      "MariaDB",
      "REST API",
    ],
  },
  {
    category: "IoT / Hardware",
    items: [
      "Arduino",
      "ESP32",
      "RS485",
      "Modbus RTU",
      "UART",
      "HTTP POST",
      "MQTT",
    ],
  },
  {
    category: "DevOps & Tools",
    items: [
      "AWS EC2",
      "uwsgi",
      "nginx",
      "Git",
      "GitHub",
      "Postman",
      "Jira",
    ],
  },
  {
    category: "기타",
    items: [
      "Python",
      "PyAutoGUI",
      "Tesseract OCR",
      "Kukudocs Web Editor",
    ],
  },
];

export type Project = {
  name: string;
  period?: string;
  points: string[];
  stack?: string[];
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  summary?: string;
  projects: Project[];
};

export const experiences: Experience[] = [
  {
    company: "서울소프트 (Seoulsoft)",
    role: "Full-Stack Developer",
    period: "2026.03 - 재직 중",
    summary:
      "Django 기반 SaaS MES 시스템의 프론트/백엔드와 산업 IoT 장비 연동을 함께 담당.",
    projects: [
      {
        name: "SaaS MES",
        period: "2026.03 - 재직 중",
        points: [
          "iframe 기반 탭 시스템에서 다른 탭의 데이터 변경이 반영되지 않던 문제를 이벤트 버스 방식으로 해결. 전역 ajaxSuccess 후크로 mutation API를 감지해 이벤트를 자동 발행하고, 각 화면은 한 줄 선언만으로 자동 새로고침되도록 구조 개선.",
          "그리드가 있는 36개 화면에 위 구조를 일괄 적용.",
          "도입업체·사용자 기준정보·설비·품목 등 기준정보 관리 기능 유지보수, 도입업체별 데이터 격리와 권한 처리 코드 검토·개선.",
          "데이터 분석 화면의 차트 라이브러리 통일 (Google Charts → Chart.js).",
          "운영 서버(AWS EC2) 배포 관리 — uwsgi/nginx 설정, collectstatic 처리. 운영 DB 덤프를 로컬로 복원해 재현 환경 구성.",
          "ESP32와 RS485 트랜시버(TTL485)로 산업 장비 데이터를 MES4로 전송하는 게이트웨이 구성. Modbus RTU 마스터 펌웨어 작성, WiFi + HTTP POST 송신 처리.",
          "금속검출기 연동 프로젝트 담당 (하드웨어 선정, 결선, 펌웨어 초안). 급속냉동고 가동률 측정을 위한 전력 계측 방식 검토 (PZEM, Shelly Plug S, Tapo P110 비교).",
        ],
        stack: [
          "Django",
          "MySQL",
          "jQuery",
          "Bootstrap",
          "Chart.js",
          "Arduino",
          "ESP32",
          "RS485 / Modbus RTU",
        ],
      },
    ],
  },
  {
    company: "굿스트림 (Goodstream)",
    role: "Front-End Developer",
    period: "2023.11 - 2025.11",
    summary:
      "React 신규 개발과 Ext JS 기반 시스템 고도화. 조직도·권한·전자결재·그리드·게시판 등 엔터프라이즈 도메인 전반을 폭넓게 담당.",
    projects: [
      {
        name: "원익머트리얼즈 SRM 3차 고도화",
        period: "2025.03 - 2025.11",
        points: [
          "조직도, 권한, 사용자 관리 구조 문제 해결.",
          "ApprovalPopup 결재 경로와 권한 전달 구조 개선, SetupDocument 저장 로직 안정화.",
          "게시판 첨부파일 관리 기능 마무리, HTML 문서 템플릿을 table 기반으로 재구축.",
        ],
        stack: ["Ext JS", "SlickGrid", "Spring Boot", "MyBatis"],
      },
      {
        name: "원익머트리얼즈 WeSM 신규 개발",
        period: "2024.09 - 2025.03",
        points: [
          "React 기반 신규 시스템의 UI 컴포넌트 설계 및 구현.",
          "SlickGrid 기반 사용자·권한·프로그램 관리 화면 개발.",
          "Kukudocs Editor iframe 연동 및 FORCE_COMMIT 저장 처리.",
          "파일 업로드 및 기존 파일 로딩 처리.",
        ],
        stack: ["React", "Vite", "SlickGrid", "Axios", "SCSS"],
      },
      {
        name: "원익머트리얼즈 SRM 2차 고도화",
        period: "2024.01 - 2024.09",
        points: [
          "Vendor Rating, QR 평가, 메시지 알림, 조직도, 권한 관리 기능 고도화.",
          "Grid renderer, summary row, 동적 컬럼 처리.",
          "QR 문서 템플릿 생성 로직 유지보수.",
          "게시판 파일 업로드·삭제·병합 기능 개발.",
        ],
        stack: ["Ext JS", "Spring Boot", "MyBatis", "MariaDB"],
      },
      {
        name: "생물지리 시스템 Front-End",
        period: "2023.11 - 2024.01",
        points: [
          "생물지리 조회 및 분석 화면 UI 개발.",
          "지도 기반 데이터 표현 UI 구현.",
          "필터·목록·상세 조회 기능 구현.",
        ],
        stack: ["JavaScript", "HTML/CSS", "REST API"],
      },
    ],
  },
];

export type ShowcaseProject = {
  slug: string;
  title: string;
  role: string;
  summary: string;
  stack: string[];
  href: string;
  status?: "live" | "wip";
};

export const projects: ShowcaseProject[] = [
  {
    slug: "iot-dashboard",
    title: "Factory Live — IoT 실시간 대시보드",
    role: "Design & Full-stack",
    summary:
      "냉동고·금속검출기·충진기·밀링머신·라인 컨트롤러 5대의 상태, 전력, 온도, 진동을 실시간으로 모니터링하는 대시보드. ESP32 + Modbus RTU 게이트웨이 구조를 프론트엔드에서 시각화합니다.",
    stack: ["Next.js", "TypeScript", "Recharts", "MQTT", "ESP32", "Modbus RTU"],
    href: "/projects/iot-dashboard",
    status: "live",
  },
  {
    slug: "modbus-playground",
    title: "Modbus Playground — 프레임 조립·파싱 도구",
    role: "Tool · Modbus RTU",
    summary:
      "요청 프레임을 필드별로 조립·파싱하고 CRC-16 을 재계산해 눈으로 검증하는 브라우저 도구. ESP32 게이트웨이 개발·시리얼 디버깅 도중 스펙 확인 시간을 줄이려고 만들었습니다.",
    stack: ["Next.js", "TypeScript", "Modbus RTU", "CRC-16"],
    href: "/projects/modbus-playground",
    status: "live",
  },
];

export const nav = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

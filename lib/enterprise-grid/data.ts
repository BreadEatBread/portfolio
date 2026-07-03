export type Employee = {
  id: number;
  name: string;
  department: string;
  role: string;
  email: string;
  joinedAt: string; // ISO date
  salary: number; // KRW annual
  active: boolean;
  city: string;
  weeklyHours: number;
};

const surnames = [
  "김", "이", "박", "최", "정", "강", "조", "윤", "장", "임",
  "한", "오", "서", "신", "권", "황", "안", "송", "류", "홍",
];

const givenChars = [
  "정", "웅", "지", "현", "수", "영", "은", "지", "민", "혁",
  "우", "재", "성", "훈", "규", "빈", "예", "선", "진", "석",
  "채", "찬", "호", "린", "슬", "찬", "휘", "율", "결", "설",
];

const departments = [
  "개발실", "영업팀", "기획팀", "재무팀", "인사팀", "디자인팀",
  "인프라팀", "품질팀", "고객성공팀", "법무팀",
];

const roles = ["사원", "대리", "과장", "차장", "부장", "이사"];

const cities = [
  "서울", "부산", "대구", "인천", "대전", "광주", "수원", "성남",
  "고양", "용인", "청주", "전주", "포항", "울산", "제주",
];

/** 결정적 LCG PRNG. seed 고정 → 언제 로드해도 동일한 데이터. */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function genName(rng: () => number): string {
  const family = pick(rng, surnames);
  const g1 = pick(rng, givenChars);
  const g2 = pick(rng, givenChars);
  return family + g1 + g2;
}

function genJoined(rng: () => number): string {
  const start = new Date("2015-01-01").getTime();
  const end = new Date("2026-06-30").getTime();
  const ts = start + rng() * (end - start);
  const d = new Date(ts);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;
}

function romanize(korean: string): string {
  const map: Record<string, string> = {
    김: "kim", 이: "lee", 박: "park", 최: "choi", 정: "jung",
    강: "kang", 조: "cho", 윤: "yoon", 장: "jang", 임: "lim",
    한: "han", 오: "oh", 서: "seo", 신: "shin", 권: "kwon",
    황: "hwang", 안: "ahn", 송: "song", 류: "ryu", 홍: "hong",
  };
  return map[korean[0]] ?? korean.toLowerCase();
}

export const ROW_COUNT = 100_000;

let cached: Employee[] | null = null;

export function generateRows(count: number = ROW_COUNT): Employee[] {
  if (cached && cached.length === count) return cached;
  const rng = makeRng(0xC0FFEE);
  const rows: Employee[] = [];
  for (let i = 1; i <= count; i++) {
    const name = genName(rng);
    const family = name[0];
    const dept = pick(rng, departments);
    const roleIdx = Math.min(roles.length - 1, Math.floor(rng() * roles.length));
    const role = roles[roleIdx];
    const salary =
      30_000_000 + Math.floor(rng() * 30_000_000) + roleIdx * 20_000_000;
    rows.push({
      id: i,
      name,
      department: dept,
      role,
      email: `${romanize(family)}${i.toString().padStart(5, "0")}@company.io`,
      joinedAt: genJoined(rng),
      salary,
      active: rng() > 0.1,
      city: pick(rng, cities),
      weeklyHours: Math.floor(rng() * 40) + 20,
    });
  }
  cached = rows;
  return rows;
}

export type ColumnKey = keyof Employee;

export type Column = {
  key: ColumnKey;
  header: string;
  width: number;
  align?: "left" | "right" | "center";
  render?: (row: Employee) => string;
};

const nfKrw = new Intl.NumberFormat("ko-KR");

export const columns: Column[] = [
  { key: "id", header: "ID", width: 68, align: "right" },
  { key: "name", header: "이름", width: 100 },
  { key: "department", header: "부서", width: 110 },
  { key: "role", header: "직급", width: 72 },
  { key: "email", header: "이메일", width: 220 },
  { key: "joinedAt", header: "입사일", width: 110 },
  {
    key: "salary",
    header: "연봉",
    width: 130,
    align: "right",
    render: (r) => `₩${nfKrw.format(r.salary)}`,
  },
  { key: "city", header: "도시", width: 80 },
  { key: "weeklyHours", header: "주 근무", width: 80, align: "right" },
  { key: "active", header: "상태", width: 74, align: "center" },
];

export const TOTAL_WIDTH = columns.reduce((s, c) => s + c.width, 0);

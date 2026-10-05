export interface Post {
  // 기존 필수 속성
  id: string;
  title: string;
  slug: string;
  category: string | null;
  published: boolean;
  createdAt: string; // 노션 생성 시각 (ISO 8601)

  // 확장 속성: 노션에 값이 없거나 속성 자체가 없으면 undefined
  tags?: string[]; // 기술 스택 + 역량 키워드
  problem?: string; // 막혔던 문제, 마찰, 이슈 요약
  solution?: string; // 해결 과정, 배운 점 요약
  date?: string; // 활동 날짜 (노션 Date 속성)
  github?: string;
  externalLink?: string; // 데모, 인스타, 발표 자료/PDF 링크
}
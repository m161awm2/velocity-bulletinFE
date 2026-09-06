# Velocity Bulletin Frontend

React, TypeScript, Vite로 만든 [Velocity Bulletin](https://github.com/m161awm2/velocity-bulletinBE) 백엔드용 프론트엔드입니다.

## 기술 스택

- React 19 + TypeScript, Vite 8
- Tailwind CSS (스타일링)
- TanStack Query (서버 상태 관리/캐싱)
- react-router-dom (라우팅)
- react-hook-form + zod (폼 검증)
- axios (HTTP 클라이언트)

## 주요 기능

- 이메일/비밀번호 회원가입 및 로그인 (JWT를 `localStorage`에 저장)
- 게시글 검색, 카테고리(자유/질문/공지) 필터, 정렬(최신/조회/좋아요), 페이지네이션
- 게시글 작성/수정/삭제 (공지는 관리자만 작성 가능), 이미지 업로드(S3 presign 연동)
- 좋아요 토글, 댓글 작성/수정/삭제
- 내 정보 수정 및 회원 탈퇴
- 관리자 전용 사용자 목록 조회 및 활성/비활성 처리

## 로컬 실행

요구 사항: Node.js 20+, 그리고 [velocity-bulletinBE](https://github.com/m161awm2/velocity-bulletinBE)가 `http://localhost:8080`에서 실행 중이어야 합니다.

```bash
npm install
npm run dev
```

`http://localhost:3000`에서 접속할 수 있습니다. 개발 서버는 `/api`, `/health` 요청을 `http://localhost:8080`으로 프록시하므로(`vite.config.ts`) 별도의 CORS 설정 없이 백엔드와 통신합니다.

## 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 타입 체크 + 프로덕션 빌드
npm run lint     # oxlint 실행
npm run preview  # 빌드 결과 미리보기
```

## 알려진 제약

- 백엔드가 게시글 목록/상세 응답에 "현재 사용자의 좋아요 여부"를 포함하지 않아, 좋아요 버튼은 활성 상태를 표시하지 않고 개수만 보여줍니다.
- 백엔드에 refresh 토큰이 없어 액세스 토큰(`JWT_TTL`, 기본 1시간) 만료 시 재로그인이 필요합니다.

## 라이선스

이 프로젝트는 [MIT 라이선스](./LICENSE)를 따릅니다.

# 감성지수(EQ) 진단 워크샵

다니엘 골먼의 5가지 감성지능(자기이해·감정조절·자기동기화·타인이해·사회적 인간관계)을 50문항(0·1·2점)으로 진단하는 워크샵 웹앱입니다.

- 교육생 화면: `/` — 이름·조 입력 → 5개 파트 진단 → 오각형 결과, 영역별 기르는 방법, 액션 플랜
- 강사 화면: `/admin` — 비밀번호 로그인 후 전체·조별 평균 오각형, 강점/보완 영역 분포, 참가자별 결과, CSV 다운로드

## 구성

- Next.js (App Router) + TypeScript + Tailwind CSS
- 결과 저장: Vercel Blob **비공개** 스토어 (`results/<시각>-<id>.json`)
- 문항·해설·기르는 방법 수정: `lib/diagnostic.ts`

## 환경 변수 (Vercel 프로젝트 설정)

| 이름 | 설명 |
| --- | --- |
| `ADMIN_PASSWORD` | 강사 화면 비밀번호 |
| `BLOB_READ_WRITE_TOKEN` | Blob 스토어를 프로젝트에 연결하면 자동 설정 |

## 로컬 실행

```bash
npm install
ADMIN_PASSWORD=test npm run dev   # Blob 토큰이 없으면 .data/ 폴더에 저장
```

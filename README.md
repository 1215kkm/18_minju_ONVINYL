# ONVINYL

K-Pop 바이닐 레코드 쇼핑몰 랜딩 페이지

🔗 **라이브 사이트**: [minjoo073.github.io/lp_2](https://minjoo073.github.io/lp_2)

---

## 프로젝트 개요

LE SSERAFIM, LISA, NewJeans 등 K-Pop 아티스트의 바이닐 레코드를 판매하는 온라인 쇼핑몰 프론트엔드입니다. 순수 HTML / CSS / JavaScript로 제작되었으며, SPA와 유사한 페이지 전환 방식을 구현했습니다.

---

## 기술 스택

- HTML5 / CSS3 / Vanilla JavaScript
- GitHub Pages (배포)

---

## 파일 구조

```
lp_2/
├── index.html         # 메인 랜딩 페이지 (Best Sellers, Limited Edition, New Arrivals)
├── best.html          # Best Sellers 목록 페이지
├── best-detail.html   # 상품 상세 페이지 (갤러리 포함)
├── genre.html         # Collection / CURATED PATHS 페이지
├── kpop.html          # K-Pop 패키지 상세 페이지
├── new.html           # NEW 바이닐 카탈로그 + 장바구니
├── about.html         # 브랜드 소개 페이지
├── css/
│   └── style.css      # 전체 스타일 (반응형 포함)
├── script/
│   └── action.js      # 페이지 전환, 장바구니, 갤러리 등 인터랙션
├── images/            # 상품 이미지 (WebP 최적화)
└── videos/            # 히어로 배경 영상 (MP4)
```

---

## 제작 과정

### 1단계 — 기초 구조 수립
- 랜딩 페이지 초안 (`index.html`) 및 기본 스타일 작성
- JavaScript 인터랙션 연결 (스크롤, 클릭 이벤트)

### 2단계 — 페이지 확장
- Best Sellers 상품 상세 페이지 (`best-detail.html`) 추가
- K-Pop 앨범 디테일 페이지 (`kpop.html`) 추가
- K-Pop 패키지 페이지 디자인 완성 (굿즈 이미지 포함)

### 3단계 — 콘텐츠 구조화
- CORTIS 아티스트 피처 페이지 구현
- NEW 바이닐 카탈로그 (`new.html`) 추가 및 아티스트 내비게이션 연결
- 장바구니(공유 카트) 및 서브페이지 완성
- CURATED PATHS 큐레이션 플로우 구현

### 4단계 — 히어로 영상 & 디자인 개선
- 히어로 배경을 유튜브 → MP4 영상으로 전환 (PJAX 방식 페이지 전환 함께 구현)
- Collection 페이지 에디토리얼 스타일 리디자인
- COLOR VINYL 카드 배경 및 PATHS 카드 레이아웃 조정

### 5단계 — 성능 최적화
- 히어로 영상 압축: **70MB → 41MB → 10MB** (FFmpeg 클립 편집)
- 전체 이미지 WebP 변환: **76MB → 7.4MB (90% 감소)**

### 6단계 — 모바일 반응형 (최종 PR)
- Best Sellers 모바일 TOP 3 레이아웃 개선 (02·03 2열 배치)
- 모바일 푸터 2열 그리드로 압축
- 상품 상세 페이지 반응형 개선 + 갤러리 화살표 네비게이션
- Collection 모바일: 상품카드 버튼 정렬 수정, CURATED PATHS 가로 스크롤 전환
- 히어로 `100vh` 반응형 수정 + 모바일 햄버거 메뉴 추가

---

## 주요 버그 수정 내역

| 구분 | 내용 |
|------|------|
| 히어로 영상 | YouTube 임베드 → MP4 로컬 영상으로 교체 (모바일 자동재생 정책 대응) |
| 히어로 레이아웃 | `100vh` 미적용으로 모바일에서 영상 높이 깨지는 문제 수정 |
| 햄버거 메뉴 | 모바일에서 내비게이션 미노출 → 햄버거 메뉴 신규 구현 |
| Collection 버튼 | 모바일에서 상품카드 버튼 정렬 틀어지는 문제 수정 |
| CURATED PATHS | 모바일에서 카드 넘침 → 가로 스크롤로 전환 |
| 푸터 | 모바일에서 4열 레이아웃 넘침 → 2열 그리드로 변경 |
| Best Sellers | 모바일 TOP 3 세로 나열 → 02·03 2열 나란히 배치 |
| COLOR VINYL 카드 | 디자인 수정 중 배경 소실 → 복구 |
| 갤러리 내비게이션 | 상품 상세 갤러리 화살표 클릭 이동 미구현 → 추가 |
| CORTIS 스트립 | 전체 페이지에 불필요하게 노출되던 섹션 제거 |
| 이미지 용량 | PNG 원본 대용량으로 로딩 지연 → 전체 WebP 변환 |
| 히어로 영상 용량 | 70MB 원본으로 초기 로딩 느림 → 30초 클립으로 편집 및 압축 (10MB) |

---

## 성능 지표

| 항목 | 최적화 전 | 최적화 후 | 개선율 |
|------|-----------|-----------|--------|
| 이미지 전체 용량 | 76 MB | 7.4 MB | **90% 감소** |
| 히어로 영상 | 70 MB | 10 MB | **86% 감소** |

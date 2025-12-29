# 소프트웨어 테스팅 학습 가이드

## 프로젝트 개요

이 프로젝트는 소프트웨어 테스팅의 전반적인 지식과 실무 기술을 학습할 수 있도록 구성된 온라인 학습 플랫폼입니다. ISTQB 기준의 소프트웨어 테스팅 커리큘럼을 기반으로 하며, 이론과 실무 사례를 함께 다루고 있습니다.

## 주요 기능

- **교과서 기반 학습**: 소프트웨어 테스팅의 기초부터 고급까지 체계적으로 구성
- **실무 중심 콘텐츠**: 실제 현장에서 사용되는 테스트 기법과 사례 중심 학습
- **FAQ 섹션**: 자주 묻는 질문과 답변을 통해 이해도 향상
- **동적 FAQ 구조**: 여러 개의 FAQ 파일로 구성되어 확장성 높은 구조
- **링크 기반 탐색**: 관련 콘텐츠로의 원활한 이동 기능

## 프로젝트 구조

```
sw-testing/
├── index.html          # 메인 페이지
├── script.js           # 동적 콘텐츠 로딩 및 기능 처리
├── styles.css          # 스타일 시트
├── content/            # 콘텐츠 파일들
│   ├── introduction.md
│   ├── sdlc.md
│   ├── static.md
│   ├── dynamic.md
│   ├── management.md
│   ├── tools.md
│   ├── faq1.md
│   ├── faq2.md
│   ├── faq3.md
│   ├── faq4.md
│   ├── testing_practice.md
│   ├── testing_execution.md
│   ├── testing_practice_static.md
│   ├── testing_practice_blackbox.md
│   ├── testing_practice_defect.md
│   ├── testing_practice_nonfunctional.md
│   ├── testing_practice_process.md
│   ├── chrome_devtools_guide.md
│   ├── mobile_testing_guide.md
│   ├── server_log_analysis.md
│   ├── monkey_vs_exploratory.md
│   ├── test_charter_guide.md
│   ├── heuristic_techniques.md
│   ├── android_vs_ios.md
│   ├── network_throttling_guide.md
│   ├── dark_mode_orientation_guide.md
│   ├── regression_test_impact_analysis.md
│   ├── confirmation_vs_regression_strategy.md
│   ├── hotfix_smoke_test_guide.md
│   ├── sql_basics_for_testers.md
│   ├── bulk_data_testing.md
│   └── api_testing_postman.md
└── README.md
```

## 구현에 사용된 주요 기술 및 모듈

### 1. 프론트엔드 기술

- **HTML5**: 구조적 마크업 및 시맨틱 태그 사용
- **CSS3**: 반응형 디자인 및 모던 스타일링
- **JavaScript (ES6+)**: 동적 콘텐츠 로딩 및 사용자 인터랙션 처리

### 2. 마크다운 렌더링

- **Marked.js**: 마크다운 텍스트를 HTML로 변환
  - 사용 위치: `script.js` 내 `marked.parse()` 함수
  - 기능: 콘텐츠 폴더의 `.md` 파일들을 HTML로 렌더링

### 3. 다이어그램 렌더링

- **Mermaid.js**: 플로우차트, 시퀀스 다이어그램 등 시각적 요소 렌더링
  - 사용 위치: `index.html`의 스크립트 로딩 및 `script.js` 초기화 코드
  - 기능: 콘텐츠 내 다이어그램 요소 시각화

### 4. 동적 콘텐츠 로딩 시스템

- **Fetch API**: 콘텐츠 파일 비동기 로딩
  - 사용 위치: `script.js`의 `loadMarkdownContent()` 함수
  - 기능: 사용자 요청에 따라 마크다운 파일을 동적으로 로딩

### 5. 다이나믹 FAQ 시스템

- **동적 파일 로딩**: `faq1.md`, `faq2.md`, `faq3.md`, `faq4.md` 등 여러 파일을 자동으로 연결
  - 사용 위치: `script.js`의 `loadAllFAQFiles()` 함수
  - 기능: FAQ 파일들을 자동으로 탐지하고 연결

### 6. 검색 기능

- **전체 텍스트 검색**: 콘텐츠 내 검색어 검색
  - 사용 위치: `script.js`의 `performSearch()` 함수
  - 기능: 모든 콘텐츠 파일에서 검색어를 찾아 해당 섹션으로 이동

### 7. 내부 링크 처리

- **앵커 링크 처리**: 콘텐츠 내 섹션 간 이동
  - 사용 위치: `script.js`의 내부 앵커 핸들러
  - 기능: `#section-id` 형식의 링크를 클릭 시 해당 섹션으로 스크롤

### 8. 반응형 디자인

- **CSS 미디어 쿼리**: 다양한 디바이스에 최적화된 레이아웃
  - 사용 위치: `styles.css`
  - 기능: 모바일, 태블릿, 데스크톱에서 최적의 사용자 경험 제공

## 학습 커리큘럼

1. **소프트웨어 테스트의 기본**: 테스트의 정의, 원칙, 프로세스
2. **소프트웨어 수명 주기와 테스트**: 개발 모델별 테스트 전략
3. **정적 테스트**: 리뷰 및 정적 분석 기법
4. **동적 테스트 기법**: 블랙박스, 화이트박스, 경험 기반 테스트
5. **테스트 관리**: 테스트 조직, 계획, 결함 관리
6. **테스트 도구**: 다양한 테스트 도구의 종류와 적용

## 실무 테스트 가이드

- **테스팅 실무**: 실무에서 사용되는 테스트 기법 및 전략
- **테스트 수행**: 실제 테스트를 수행하는 방법과 기술
- **로그 분석**: 실제 현장에서 로그를 분석하여 결함을 찾는 방법
- **모바일 테스트**: 안드로이드 및 iOS 환경에서의 테스트 전략
- **API 테스트**: Postman을 활용한 백엔드 로직 검증

## 사용법

1. 프로젝트를 클론하거나 다운로드
2. `index.html` 파일을 웹 브라우저에서 열기
3. 네비게이션 메뉴를 통해 원하는 섹션 선택
4. 검색 기능을 통해 특정 키워드 검색 가능

## 브라우저 지원

- Chrome, Firefox, Safari, Edge 최신 버전에서 정상 작동

## 기여

기여는 언제든지 환영합니다. 이슈 제기나 풀 리퀘스트를 통해 프로젝트 개선에 참여해주세요.
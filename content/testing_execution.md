# 테스트 수행

<div class="testing-execution-cards">

<div class="execution-card" id="log-analysis">

### 1. 실전 로그 분석: "증거로 말하는 테스터"

단순히 "에러 나요"가 아니라, 어디서 왜 나는지 찾아내는 기술입니다.

- [웹 테스터의 필수 무기: 크롬 개발자 도구(F12)로 네트워크 에러 잡아내기](#chrome_devtools_guide)
- [모바일 앱 테스트의 눈: ADB와 Xcode 로그로 시스템 크래시 원인 분석하기](#mobile_testing_guide)
- [서버 로그(Access/Error Log)를 뒤져서 '간헐적 버그'의 흔적을 찾는 법](#server_log_analysis)

</div>

<div class="execution-card" id="exploratory-testing">

### 2. 탐색적 테스팅: "시나리오 밖의 버그 사냥"

문서에 없는 버그를 직관으로 찾아내는 체계적인 방법입니다.

- [무작정 누르기(Monkey Test)와 탐색적 테스팅은 무엇이 다른가?](#monkey_vs_exploratory)
- [테스트 차터' 작성법: 90분 안에 서비스의 약점을 털어내는 전략](#test_charter_guide)
- [휴리스틱(Heuristic) 기법: 테스터의 경험을 공식화하여 적용하기](#heuristic_techniques)

</div>

<div class="execution-card" id="mobile-web">

### 3. 모바일 & 웹 특화 기술: "환경의 변수 통제하기"

디바이스와 브라우저의 파편화를 극복하는 노하우입니다.

- [안드로이드 vs iOS: OS별 특성에 따른 테스트 체크포인트의 차이](#android_vs_ios)
- [저사양 기기 및 열악한 네트워크(3G/LTE) 환경 강제 설정 테스트](#network_throttling_guide)
- [다크모드, 가로/세로 전환, 앱 백그라운드 진입 시 발생하는 흔한 결함들](#dark_mode_orientation_guide)

</div>

<div class="execution-card" id="retest-regression">

### 4. 재테스트와 회귀 테스트: "수정 확인 그 이상"

하나를 고치면 다른 곳이 고장 나는 '사이드 이펙트'를 잡는 기술입니다.

- [수정된 버그만 보지 마세요: 영향도 분석을 통한 회귀 테스트 범위 산정법](#regression_test_impact_analysis)
- [확인 테스트'와 '회귀 테스트'의 우선순위 배분 전략 (시간이 부족할 때)](#confirmation_vs_regression_strategy)
- [핫픽스(Hotfix) 상황에서 최소한으로 챙겨야 할 스모크 테스트(Smoke Test)](#hotfix_smoke_test_guide)

</div>

<div class="execution-card" id="test-data">

### 5. 테스트 데이터 핸들링: "테스트의 절반은 데이터 준비"

제대로 된 데이터를 넣어야 제대로 된 버그가 나옵니다.

- [DB 쿼리(SQL) 기초: 테스터가 직접 데이터를 조회하고 수정해야 하는 이유](#sql_basics_for_testers)
- [대량 데이터 테스트: 엑셀과 스크립트를 활용해 1만 건의 테스트 데이터 한 번에 만들기](#bulk_data_testing)
- [API 테스트 실무: Postman으로 백엔드 로직 먼저 두들겨 보기](#api_testing_postman)

</div>

</div>
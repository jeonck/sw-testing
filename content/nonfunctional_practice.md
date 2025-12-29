# [성능/보안] 깊이 있는 검증

**"기능만 되면 끝인가요? 느려지면 버그입니다."**

---

## 왜 비기능 테스트가 중요한가?

성능 문제로 인한 손실:
- 페이지 로딩 1초 지연 = 전환율 **7% 감소**
- 사이트 속도 개선 = 검색 순위 **상승**
- 보안 사고 1건 = 평균 복구 비용 **4억원**

"기능은 완벽한데 느려서 못 쓰겠어요" ← 가장 흔한 불만

---

## 성능 테스트 유형

### 1. 로드 테스트 (Load Testing)

**목적**: 정상 사용자 수에서 성능 확인

**시나리오 예시:**
```
- 동시 사용자: 100명
- 지속 시간: 30분
- 목표 응답 시간: 3초 이내
- 목표 처리량: 초당 50 요청
```

**도구: Apache JMeter 예제**
```xml
<!-- Thread Group 설정 -->
<ThreadGroup>
  <numThreads>100</numThreads>  <!-- 동시 사용자 -->
  <rampUp>60</rampUp>            <!-- 60초 동안 증가 -->
  <loops>-1</loops>              <!-- 무한 반복 -->
  <duration>1800</duration>       <!-- 30분 -->
</ThreadGroup>
```

### 2. 스트레스 테스트 (Stress Testing)

**목적**: 한계점 찾기

**시나리오:**
```
1단계: 100명 (정상)
2단계: 200명 (2배)
3단계: 500명 (5배)
4단계: 1,000명 (10배) ← 어디서 무너지는가?
```

**측정 지표:**
- 응답 시간 급증 지점
- 에러율 증가 시점
- 서버 CPU/메모리 한계

### 3. 볼륨 테스트 (Volume Testing)

**목적**: 대량 데이터 처리 확인

**예시:**
| 데이터 규모 | 처리 시간 | 상태 |
|-----------|----------|------|
| 1,000건 | 0.5초 | ✅ 정상 |
| 10,000건 | 3초 | ✅ 정상 |
| 100,000건 | 45초 | ⚠️ 느림 |
| 1,000,000건 | 타임아웃 | ❌ 실패 |

### 4. 스테이빌리티 테스트 (Stability/Endurance Testing)

**목적**: 장시간 운영 안정성

**시나리오:**
```
- 동시 사용자: 50명 (낮은 부하)
- 지속 시간: 24시간 ~ 72시간
- 확인 사항: 메모리 누수, 성능 저하
```

**체크 포인트:**
- 시작 시 응답 시간: 1.2초
- 12시간 후: 1.8초 ← 성능 저하
- 24시간 후: 3.5초 ← 메모리 누수 의심

---

## 성능 테스트 실전 가이드

### 성능 기준 정의 (SLA)

| 항목 | 기준 | 측정 방법 |
|-----|------|----------|
| **응답 시간** | 95% 요청이 3초 이내 | Percentile 분석 |
| **처리량** | 초당 100 TPS | Transaction Per Second |
| **동시 사용자** | 최소 500명 지원 | Concurrent Users |
| **가용성** | 99.9% (월 43분 다운타임) | Uptime Monitoring |
| **에러율** | 1% 미만 | Error Rate |

### 성능 테스트 도구 비교

| 도구 | 무료 | 장점 | 단점 | 추천 시나리오 |
|-----|------|------|------|--------------|
| **Apache JMeter** | ✅ | 강력, 확장성 높음 | 학습 곡선 | HTTP, DB 테스트 |
| **k6** | ✅ | 코드 기반, CI/CD 통합 | GUI 없음 | DevOps 환경 |
| **Gatling** | ✅ (제한) | Scala 기반, 고성능 | Scala 필요 | 대규모 테스트 |
| **Locust** | ✅ | Python 기반, 쉬움 | 규모 제한 | 빠른 프로토타이핑 |
| **LoadRunner** | ❌ | 엔터프라이즈급 | 고가 | 대기업 환경 |

### JMeter 실전 예제

```bash
# 1. JMeter 설치 (macOS)
brew install jmeter

# 2. 테스트 실행
jmeter -n -t test_plan.jmx -l results.jtl -e -o report/

# 3. 결과 분석
# report/index.html 열기
```

**test_plan.jmx 구조:**
```
1. Thread Group (사용자 설정)
   ├─ HTTP Request (로그인)
   ├─ HTTP Request (상품 검색)
   ├─ HTTP Request (장바구니 담기)
   └─ Listeners (결과 수집)
```

### k6 예제 (코드 기반)

```javascript
// performance-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up
    { duration: '5m', target: 50 },   // Stay
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95%가 3초 이내
    http_req_failed: ['rate<0.01'],    // 에러율 1% 미만
  },
};

export default function () {
  // 로그인 API
  let res = http.post('https://api.example.com/login', {
    email: 'test@example.com',
    password: 'Test1234!',
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1); // 사용자 대기 시간 시뮬레이션
}
```

**실행:**
```bash
k6 run performance-test.js
```

---

## 보안 테스트

### OWASP Top 10 (2021) 체크리스트

| 순위 | 취약점 | 테스트 방법 | 도구 |
|-----|-------|-----------|------|
| 1 | Broken Access Control | 권한 우회 시도 | Burp Suite |
| 2 | Cryptographic Failures | 민감 데이터 암호화 확인 | Wireshark |
| 3 | Injection | SQL/XSS 입력 시도 | SQLMap, XSStrike |
| 4 | Insecure Design | 설계 검토 | Manual Review |
| 5 | Security Misconfiguration | 설정 점검 | Nessus |
| 6 | Vulnerable Components | 라이브러리 버전 확인 | Snyk, Dependabot |
| 7 | Authentication Failures | 인증 우회 시도 | Hydra |
| 8 | Data Integrity Failures | 데이터 변조 시도 | Manual |
| 9 | Logging Failures | 로그 누락 확인 | Manual |
| 10 | SSRF | 서버 요청 위조 | Manual |

### 실전 보안 테스트 시나리오

#### 1. SQL Injection 테스트

**테스트 입력값:**
```sql
' OR '1'='1
admin'--
'; DROP TABLE users--
```

**예상 결과:**
- ❌ 쿼리 실행됨 → 취약
- ✅ 에러 또는 무시 → 안전

**코드 검증:**
```python
# 취약한 코드
query = f"SELECT * FROM users WHERE id = {user_id}"

# 안전한 코드 (Prepared Statement)
query = "SELECT * FROM users WHERE id = ?"
cursor.execute(query, (user_id,))
```

#### 2. XSS (Cross-Site Scripting) 테스트

**테스트 입력값:**
```html
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
```

**테스트 위치:**
- 검색창
- 댓글 입력
- 프로필 이름

**안전한 처리:**
```javascript
// 입력값 이스케이프
const escaped = userInput
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
```

#### 3. 인증/인가 테스트

**체크리스트:**
```
[ ] 비밀번호 복잡도 검증 (8자 이상, 영문+숫자+특수문자)
[ ] 로그인 시도 제한 (5회 실패 시 계정 잠금)
[ ] 세션 타임아웃 (30분 무활동 시 로그아웃)
[ ] 다중 디바이스 로그인 제한
[ ] 비밀번호 재설정 링크 유효 기간 (1시간)
[ ] 민감 API는 인증 필수
[ ] 권한별 접근 제어 (일반 사용자가 관리자 API 호출 불가)
```

#### 4. 보안 헤더 검증

**필수 HTTP 헤더:**
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

**테스트:**
```bash
curl -I https://example.com
# 또는
https://securityheaders.com 에서 자동 체크
```

---

## 보안 도구 활용

### 1. OWASP ZAP (무료)

**사용법:**
```bash
# Docker로 실행
docker run -p 8080:8080 owasp/zap2docker-stable

# 스캔 시작
zap-cli quick-scan http://example.com
```

**기능:**
- 자동 취약점 스캔
- SQL Injection, XSS 등 탐지
- API 테스트 지원

### 2. Burp Suite (무료/유료)

**주요 기능:**
- HTTP 요청/응답 가로채기 (Proxy)
- 반복 공격 (Intruder)
- 취약점 스캐너 (Scanner - 유료)

**실무 예시:**
```
1. Burp Proxy 설정 (localhost:8080)
2. 브라우저에서 로그인 시도
3. Burp에서 요청 확인
4. Repeater로 변조된 요청 전송
5. 응답 분석
```

### 3. Snyk (의존성 취약점)

**사용법:**
```bash
# 설치
npm install -g snyk

# 프로젝트 스캔
snyk test

# CI/CD 통합
snyk monitor
```

**결과 예시:**
```
✗ High severity vulnerability found in lodash
  Introduced through: lodash@4.17.15
  Fixed in: lodash@4.17.21
  Fix available: npm install lodash@4.17.21
```

---

## 실무 팁

### 1. 성능 테스트 시나리오 작성

**나쁜 예:**
```
로그인 API를 100명이 동시에 호출
```

**좋은 예:**
```
실제 사용자 행동 시뮬레이션:
1. 홈페이지 접속 (30%)
2. 로그인 (20%)
3. 상품 검색 (50%)
4. 장바구니 담기 (30%)
5. 결제 (10%)

각 단계마다 Think Time 2~5초 랜덤
```

### 2. 성능 모니터링 지표

**서버 모니터링:**
```bash
# CPU 사용률
top

# 메모리 사용률
free -m

# 디스크 I/O
iostat

# 네트워크
netstat -s
```

**애플리케이션 모니터링:**
- **APM 도구**: New Relic, Datadog, AppDynamics
- **로그 분석**: ELK Stack, Splunk
- **분산 추적**: Jaeger, Zipkin

### 3. 보안 테스트 주기

| 단계 | 빈도 | 내용 |
|-----|------|------|
| **개발 중** | 매일 | 정적 분석 (SAST) |
| **배포 전** | 매 배포 | 동적 분석 (DAST) |
| **운영 중** | 월 1회 | 침투 테스트 |
| **라이브러리 업데이트 시** | 즉시 | 의존성 스캔 |

---

## 실전 사례

### 사례 1: 성능 병목 해결

**문제:**
- 사용자 500명 시 응답 시간 15초
- 목표: 3초 이내

**분석:**
```
JMeter 테스트 결과:
- DB 쿼리 시간: 12초 (N+1 문제)
- API 응답: 2초
- 네트워크: 1초
```

**해결:**
```sql
-- Before: N+1 쿼리
SELECT * FROM orders WHERE user_id = 1;
-- 각 주문마다 상품 조회 (100번)

-- After: JOIN으로 1번에 조회
SELECT o.*, p.*
FROM orders o
JOIN products p ON o.product_id = p.id
WHERE o.user_id = 1;
```

**결과:** 응답 시간 15초 → 1.2초 (92% 개선)

### 사례 2: SQL Injection 발견

**발견:**
- 검색창에 `' OR '1'='1` 입력
- 모든 사용자 정보 노출

**취약한 코드:**
```python
query = f"SELECT * FROM users WHERE name = '{search_term}'"
```

**수정:**
```python
query = "SELECT * FROM users WHERE name = ?"
cursor.execute(query, (search_term,))
```

**영향:** 데이터 유출 사고 예방, GDPR 벌금 회피

### 사례 3: 메모리 누수 발견

**증상:**
- 서비스 시작: 메모리 2GB
- 12시간 후: 메모리 8GB
- 24시간 후: OutOfMemory 에러

**원인 분석 (Heap Dump):**
```java
// 문제 코드: 캐시 무한 증가
static Map<String, Object> cache = new HashMap<>();

public void addToCache(String key, Object value) {
    cache.put(key, value); // 삭제 로직 없음!
}
```

**해결:**
```java
// LRU 캐시 사용
Cache<String, Object> cache = CacheBuilder.newBuilder()
    .maximumSize(1000)
    .expireAfterWrite(1, TimeUnit.HOURS)
    .build();
```

**결과:** 24시간 운영 시 메모리 사용량 2GB 유지

---

## 실무 워크숍: 성능 분석 실습

### 연습 문제

다음 시나리오에서 성능 병목을 찾아보세요:

**상황:**
```
API 엔드포인트: /api/users/1/orders
평균 응답 시간: 8초 (목표: 2초)

구성:
1. 사용자 정보 조회: 0.1초
2. 주문 목록 조회: 0.2초
3. 각 주문의 상품 정보 조회: 100개 주문 × 0.07초 = 7초
4. 응답 생성: 0.7초
```

**질문:**
1. 병목 지점은?
2. 어떻게 개선할 수 있을까?

<details>
<summary>해답 보기</summary>

**병목:** 3번 - N+1 쿼리 문제

**개선 방안:**
1. JOIN으로 한 번에 조회
2. 데이터베이스 인덱스 추가
3. 결과 캐싱 (Redis)

**개선 예상 효과:**
- 7초 → 0.3초로 단축
- 전체 응답 시간: 8초 → 1.3초

</details>

---

## 추천 도구 & 리소스

### 성능 테스트 도구

| 도구 | 라이선스 | 특징 | 링크 |
|-----|---------|------|------|
| Apache JMeter | 무료 | 범용, 강력 | [jmeter.apache.org](https://jmeter.apache.org) |
| k6 | 무료 | 개발자 친화적 | [k6.io](https://k6.io) |
| Gatling | 무료/유료 | 고성능 | [gatling.io](https://gatling.io) |

### 보안 도구

| 도구 | 라이선스 | 용도 | 링크 |
|-----|---------|------|------|
| OWASP ZAP | 무료 | 웹 취약점 스캔 | [zaproxy.org](https://www.zaproxy.org) |
| Burp Suite | 무료/유료 | 침투 테스트 | [portswigger.net](https://portswigger.net) |
| Snyk | 무료/유료 | 의존성 스캔 | [snyk.io](https://snyk.io) |
| SonarQube | 무료/유료 | 코드 품질/보안 | [sonarqube.org](https://www.sonarqube.org) |

### 모니터링 도구

- **APM**: New Relic, Datadog, Dynatrace
- **로그**: ELK Stack, Splunk
- **인프라**: Prometheus + Grafana

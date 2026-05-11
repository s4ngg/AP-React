# AllPick Frontend

> React + Vite 기반 쇼핑몰 플랫폼 프론트엔드 애플리케이션

---

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [환경 변수](#환경-변수)
- [팀원 역할 분담](#팀원-역할-분담)
- [주요 기능](#주요-기능)
- [라우트 구조](#라우트-구조)
- [API 연동 규칙](#api-연동-규칙)
- [배포](#배포)
- [검증](#검증)
- [관련 레포지토리](#관련-레포지토리)

---

## 프로젝트 소개

AllPick은 카카오쇼핑을 벤치마킹한 B2C 쇼핑몰 프로젝트입니다.

일반 사용자는 상품을 탐색하고 주문할 수 있으며, 판매자는 상품을 등록하고 관리할 수 있습니다. 관리자는 회원, 판매자, 상품, 주문, 환불, 카테고리, 공지사항, FAQ를 관리합니다.

---

## 기술 스택

| 분류 | 기술 |
| --- | --- |
| Language | JavaScript |
| Framework | React |
| Build Tool | Vite |
| Routing | React Router DOM |
| State Management | Zustand |
| Server State | TanStack React Query |
| HTTP Client | Axios |
| Styling | CSS Modules |
| Icons | lucide-react |
| Payment | Toss Payments SDK |
| Email | EmailJS |

---

## 프로젝트 구조

```text
src/
├── api/          # Axios 기반 API 요청 함수
├── assets/       # 이미지 및 정적 리소스
├── components/   # 공통 및 도메인별 컴포넌트
├── hooks/        # 커스텀 훅
├── pages/        # 라우트 단위 페이지
│   ├── admin/    # 관리자 페이지
│   ├── cart/     # 장바구니
│   ├── customer/ # 고객센터
│   ├── main/     # 메인 화면
│   ├── member/   # 회원, 마이페이지
│   ├── order/    # 주문/결제
│   ├── product/  # 상품 목록/상세
│   ├── review/   # 리뷰
│   └── seller/   # 판매자 페이지
├── query/        # React Query 관련 코드
├── store/        # Zustand 전역 상태
└── styles/       # 전역 스타일
```

---

## 시작하기

### 사전 요구사항

- Node.js 20 이상
- npm
- Spring Boot 백엔드 서버
- FastAPI 추천 서버

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 빌드 결과 미리보기

```bash
npm run preview
```

---

## 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 필요한 값을 설정합니다.

```env
VITE_API_URL=http://localhost:8080
VITE_FASTAPI_URL=http://localhost:8000
VITE_TOSS_CLIENT_KEY=your_toss_client_key
VITE_BUSINESS_API_KEY=your_business_api_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

| 변수명 | 설명 |
| --- | --- |
| `VITE_API_URL` | Spring 백엔드 API base URL |
| `VITE_FASTAPI_URL` | AI 추천 FastAPI 서버 URL |
| `VITE_TOSS_CLIENT_KEY` | Toss Payments 클라이언트 키 |
| `VITE_BUSINESS_API_KEY` | 사업자등록번호 검증 API 키 |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS 서비스 ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS 템플릿 ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS Public Key |

> 배포 환경에서 `VITE_API_URL`은 반드시 Spring 백엔드 주소를 바라봐야 합니다. CloudFront 프론트 주소를 넣으면 `/api/**` 요청이 백엔드가 아니라 프론트 앱으로 전달될 수 있습니다.

---

## 팀원 역할 분담

| 이름 | 담당 |
| --- | --- |
| 김상우 | 팀장, 주소 저장 API, 결제, 멤버십, 쿠폰 API, AI 추천 FastAPI 연동, AWS 및 CI/CD |
| 이영훈 | 로그인, 회원가입, 판매자 파트, AWS 아키텍처 |
| 이소정 | 관리자 페이지, 마이페이지, 회원/판매자/상품/주문/환불 관리 기능 및 API 연동, 판매자/상품 승인 워크플로우, 마이페이지 주문/배송지/회원정보 기능 |
| 김성원 | 상품 상세, 리뷰, 장바구니, 위시리스트 |
| 고유리 | 상품 리스트 |
| 신보라 | 고객센터, 문의, 환불 신청 |

---

## 주요 기능

### 일반 사용자

- 회원가입, 로그인, 아이디/비밀번호 찾기
- 상품 목록 조회 및 상품 상세 조회
- 카테고리별 상품 탐색
- 장바구니 담기 및 주문/결제
- 리뷰 작성
- 고객센터 문의 및 환불 신청
- 마이페이지 회원정보, 주문내역, 배송지, 쿠폰, 멤버십 정보 조회

### 판매자

- 판매자 신청
- 판매자 상품 목록 조회
- 상품 등록, 수정, 삭제
- 판매자 문의 및 환불 관리

### 관리자

- 관리자 로그인
- 회원 관리
- 판매자 승인 및 상태 관리
- 상품 승인 및 상품 관리
- 주문 관리
- 환불 승인 관리
- 공지사항, FAQ 관리
- 카테고리 등록 및 관리

---

## 라우트 구조

| URL | 설명 |
| --- | --- |
| `/` | 메인 페이지 |
| `/products` | 상품 목록 |
| `/products/:id` | 상품 상세 |
| `/cart` | 장바구니 |
| `/order` | 주문/결제 |
| `/mypage` | 마이페이지 |
| `/customer` | 고객센터 |
| `/login` | 일반 사용자 로그인 |
| `/signup` | 회원가입 선택 |
| `/seller-apply` | 판매자 신청 |
| `/seller` | 판매자 대시보드 |
| `/seller/products` | 판매자 상품 관리 |
| `/admin/login` | 관리자 로그인 |
| `/admin` | 관리자 대시보드 |
| `/admin/members` | 회원/판매자 관리 |
| `/admin/products` | 상품 승인 및 관리 |
| `/admin/orders` | 주문 관리 |
| `/admin/categories` | 카테고리 관리 |
| `/admin/refunds` | 환불 승인 관리 |
| `/admin/notices` | 공지사항 관리 |
| `/admin/faqs` | FAQ 관리 |

---

## API 연동 규칙

- 모든 HTTP 요청은 `src/api/index.js`의 Axios 인스턴스를 통해 호출합니다.
- 백엔드 응답은 `ApiResponse<T>` 형식을 기준으로 처리합니다.
- 일반 사용자, 판매자, 관리자 토큰은 분리해서 저장합니다.
- 요청 경로에 따라 Authorization 헤더에 일반 사용자 토큰, 판매자 토큰, 관리자 토큰을 선택해서 넣습니다.
- 관리자 API는 `/api/admin/**`, `/api/admins/**` 경로를 사용합니다.
- 현재 팀 결정에 따라 API prefix는 `/api/v1`이 아니라 `/api`를 사용합니다.

---

## 배포

프론트엔드는 GitHub Actions를 통해 S3와 CloudFront로 배포합니다.

```text
develop push
→ GitHub Actions build
→ S3 sync
→ CloudFront cache invalidation
```

배포 URL:

```text
https://d15b731cpaqp76.cloudfront.net/
```

---

## 검증

전체 빌드:

```bash
npm run build
```

전체 lint:

```bash
npm run lint
```

특정 파일만 검사:

```bash
npx eslint src/pages/admin/AdminCategoryPage.jsx src/pages/seller/SellerProductsPage.jsx src/api/adminApi.js
```

---

## 관련 레포지토리

- Backend: https://github.com/s4ngg/AP-Spring
- Frontend: https://github.com/s4ngg/AP-React
- FastAPI Recommendation Server: TODO

---

## 참고

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- Backend README PR: https://github.com/s4ngg/AP-Spring/pull/107

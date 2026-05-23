# 🎨 UI/UX 디자인 가이드 (Playful & Simple)

---

# 📚 Table of Contents

* Design System Overview
* Color Palette for TailwindCSS
* Page Implementations
* Layout Components
* Interaction Patterns
* Breakpoints

---

# 1. 🧩 Design System Overview

## 🎯 디자인 방향성

| 요소    | 설명                   |
| ----- | -------------------- |
| Style | Playful + Simple     |
| Mood  | 심플하면서도 가벼운 재미        |
| UX 목표 | 직관적인 사용성과 감정적 즐거움 제공 |
| Tone  | 친근하고 부드러운 인터랙션       |

### 💡 핵심 디자인 원칙

* **Less but Fun**: 최소한의 요소로 재미를 전달
* **Soft Interaction**: 부드러운 애니메이션과 피드백
* **Readable First**: 가독성 최우선
* **Color-driven Emotion**: 색상으로 분위기 전달

---

# 2. 🎨 Global Color Palette (Wine Preference)

## 🎯 컬러 전략

와인의 깊이감(버건디), 과일향의 생동감(로제), 깔끔한 정보 전달(뉴트럴)을 함께 사용하는 팔레트입니다.

### 🌈 전역 컬러 토큰

```js
colors: {
  wine: {
    50: '#fcf6f8',
    100: '#f7e9ee',
    200: '#f0d2dc',
    300: '#e4afc1',
    400: '#d488a4',
    500: '#bc5f84', // brand main
    600: '#a8456a',
    700: '#8b3558',
    800: '#6f2d49',
    900: '#5a283f'
  },
  grape: {
    50: '#f7f4fb',
    100: '#efe8f7',
    200: '#dfd0ef',
    300: '#c6addf',
    400: '#a382ca',
    500: '#865fb1', // secondary
    600: '#72489d',
    700: '#603b82',
    800: '#4f326a',
    900: '#402a56'
  },
  peach: {
    50: '#fff7f3',
    100: '#ffede4',
    200: '#ffd7c4',
    300: '#ffb895',
    400: '#ff9261',
    500: '#ff7a45', // accent
    600: '#ee5f2b',
    700: '#c94822',
    800: '#a53d23',
    900: '#863521'
  },
  cream: {
    50: '#fffcf9',
    100: '#fff8f1',
    200: '#fef0e4',
    300: '#fde4d1',
    400: '#f8d2b3',
    500: '#f0bd91'
  },
  neutral: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917'
  }
}
```

### 🎨 역할 정의

* `wine`: 브랜드 아이덴티티, 주요 배경/타이틀/강조 라인
* `grape`: 보조 강조, 배지/세부 정보/아이콘
* `peach`: CTA 버튼과 핵심 행동 유도
* `cream`: 따뜻한 섹션 배경
* `neutral`: 본문 텍스트와 UI 기본 구조

### 🧪 사용 가이드 (권장)

* 페이지 배경: `neutral-50`, 섹션 배경: `cream-100`
* 타이틀: `wine-800`, 본문: `neutral-700`
* 기본 버튼: `wine-600`, 호버: `wine-700`
* 강조 버튼: `peach-500`, 호버: `peach-600`
* 카드 경계선: `wine-100` 또는 `neutral-200`

---

# 3. 📄 Page Implementations

---

## 🏠 Root Page (`/`)

### 🎯 목적

* 서비스 첫 인상 전달
* 핵심 기능 진입 유도

### 🧩 핵심 컴포넌트

| 컴포넌트          | 설명       |
| ------------- | -------- |
| Hero Section  | 브랜드 메시지  |
| CTA Button    | 주요 행동 유도 |
| Feature Cards | 주요 기능 소개 |
| Footer        | 정보 및 링크  |

### 🖼️ 이미지

* Hero: [https://picsum.photos/1200/600](https://picsum.photos/1200/600)
* Feature: [https://picsum.photos/400/300](https://picsum.photos/400/300)

---

### 🧱 레이아웃 구조

```
[Header]

[Hero Section]
- Title: "당신만의 즐거운 경험을 시작해보세요"
- Subtitle: "간단하지만 재미있게"
- CTA: "지금 시작하기"

[Feature Grid - 3 columns]
- 카드 1: "간편한 사용"
- 카드 2: "재미있는 경험"
- 카드 3: "빠른 결과"

[Footer]
```

---

### 📱 반응형 고려

| 디바이스    | 레이아웃     |
| ------- | -------- |
| Mobile  | 1 column |
| Tablet  | 2 column |
| Desktop | 3 column |

---

## 🔍 Detail Page (`/detail`)

### 🎯 목적

* 특정 콘텐츠 상세 정보 제공

### 🧩 구성 요소

* 이미지 영역
* 제목
* 설명 텍스트
* 액션 버튼

### 🖼️ 이미지

* [https://picsum.photos/800/600](https://picsum.photos/800/600)

### 🧱 구조

```
[Image]
[Title]
[Description]
[CTA Button]
```

---

## 👤 Profile Page (`/profile`)

### 🎯 목적

* 사용자 정보 및 활동 관리

### 🧩 구성 요소

* Avatar
* Username
* Activity List

### 🖼️ 이미지

* [https://picsum.photos/200](https://picsum.photos/200)

---

# 4. 🧱 Layout Components

---

## 🧭 Header

| 항목     | 설명 |
| ------ | -- |
| 로고     | 좌측 |
| 메뉴     | 우측 |
| CTA 버튼 | 강조 |

### 반응형

* Mobile: 햄버거 메뉴
* Desktop: 풀 메뉴

---

## 📦 Grid System

| 구간      | Columns |
| ------- | ------- |
| Mobile  | 4       |
| Tablet  | 8       |
| Desktop | 12      |

---

## 🦶 Footer

* 간단한 링크
* 소셜 아이콘

---

# 5. ⚡ Interaction Patterns

---

## 🎯 주요 인터랙션

| 요소  | 인터랙션                |
| --- | ------------------- |
| 버튼  | hover 시 scale(1.05) |
| 카드  | hover 시 shadow 증가   |
| 입력창 | focus 시 border 강조   |
| 로딩  | skeleton UI         |

---

## 🎬 애니메이션

* duration: 200~300ms
* easing: ease-in-out

---

# 6. 📱 Breakpoints

```scss
$breakpoints: (
  'mobile': 320px,
  'tablet': 768px,
  'desktop': 1024px,
  'wide': 1440px
);
```

---

## 📐 적용 전략

| breakpoint | 전략            |
| ---------- | ------------- |
| mobile     | single column |
| tablet     | grid 확장       |
| desktop    | full layout   |
| wide       | 여백 증가         |

---

# ✅ 마무리

이 디자인은 **단순하지만 감정적으로 즐거운 경험**을 목표로 합니다.
과하지 않은 색상과 가벼운 인터랙션을 통해 사용자가 자연스럽게 몰입하도록 설계되었습니다.
# GrabItMobile — Mobile Application Client

### Project Overview
**GrabItMobile** is a cross-platform mobile application client for a peer-to-peer (P2P) short-term personal item rental platform.

**Core Architectural Features:**
* **Layered-Modular Architecture:** Clear technical separation into distinct functional layers (UI, Navigation, Business Logic, State, Data Access, and Infrastructure) grouped around business domain modules.
* **Real-Time Synchronous Comm Engine:** High-performance messaging subsystem leveraging stable WebSocket connections with automated incremental backoff reconnection algorithms.
* **Navigation State Protection:** Robust routing engine driven by Expo Router and enhanced by a custom `HistoryProvider` (implementing **Mediator** and **Observer** design patterns) designed to seamlessly trap system back events and prevent critical data loss on complex interactive form screens.

---

### Tech Stack
* **Framework:** React Native (Expo SDK 54)
* **PL:** TypeScript
* **Routing & Deep Linking:** Expo Router (File-system based navigation workflows) & React Navigation
* **Global & Server State Management:** Redux Toolkit, React Context API, TanStack React Query (v5), Axios
* **Responsive Visual Styling:** NativeWind, React Native Calendars
* **Maps:** MapLibre React Native (OpenStreetMap standard geometric data integration)
* **Secure Storage Fabrics:** Expo SecureStore, Async Storage

---

### Get Started & Deployment

#### Prerequisites
Ensure your local workstation has an operational installation of Node.js (v18+) and appropriate native software development bundles for mobile environments (Android SDK Studio or Xcode Toolchains).

#### 1. Bootstrap Setup
Clone the repository layer and provision your local directory environment with standard dependencies:
```bash
git clone https://github.com/Zigggmund/GrabItMobile.git
cd GrabIt-Mobile
npm install
```

#### 2. Launch Local Mock Database (Testing Infrastructure)
To safely exercise UI state routines without provisioning an active enterprise backend setup, boot the local json mock node:
```bash
npx json-server --watch db.json --port 3001 --host 0.0.0.0
```

#### 3. Native Target Compilation
Build the application directly using native development compilation tracks via standard automated Expo workflows:

* **Android Terminal Platform Target:**
  ```bash
  npx expo run:android
  ```
* **iOS Terminal Platform Target:**
  ```bash
  npx expo run:ios
  ```

---

### Аннотация
**GrabItMobile** — кроссплатформенное мобильное приложение (клиентская часть) онлайн-площадки для краткосрочной P2P-аренды личных вещей.

**Ключевые архитектурные особенности:**
* **Слоисто-модульная архитектура:** Строгое вертикальное разделение ответственности между слоем представления (UI), навигацией, бизнес-логикой, управлением состоянием, доступом к данным и инфраструктурой с горизонтальной группировкой по доменным модулям.
* **Обмен данными в реальном времени:** Интегрированный модуль чатов, работающий по протоколу WebSocket со встроенным алгоритмом автоматического переподключения (до 5 попыток с экспоненциальной задержкой) при сбоях сети.
* **Надежное управление навигацией:** Использование файловой маршрутизации Expo Router, усиленной кастомным провайдером `HistoryProvider` (реализует паттерны проектирования **Посредник** и **Наблюдатель**), который перехватывает системные события перемещения назад и предотвращает потерю данных на экранах многошаговых форм.

---

### Стек
* **Фреймворк:** React Native (Expo SDK 54)
* **ЯП:** TypeScript
* **Маршрутизация и навигация:** Expo Router (Файловая структура маршрутов), React Navigation
* **Управление состоянием и кэширование:** Redux Toolkit, React Context API, TanStack React Query (v5), Axios
* **Интерфейс и стилизация:** NativeWind (Tailwind CSS), React Native Calendars
* **Карты:** MapLibre React Native (Визуализация данных OpenStreetMap)
* **Хранение данных на устройстве:** Expo SecureStore, Async Storage

---

### Инструкция по развертыванию и запуску

#### Требования
Перед запуском убедитесь, что на вашем компьютере установлена среда выполнения Node.js (v18+) и настроены инструменты мобильной разработки (Android SDK Studio для Android или Xcode для macOS/iOS).

#### 1. Установка окружения
Клонируйте репозиторий и выполните установку необходимых пакетов зависимостей:
```bash
git clone https://github.com/Zigggmund/GrabItMobile.git
cd GrabIt-Mobile
npm install
```

#### 2. Запуск локального Mock-сервера (Режим разработки)
Для отладки функционала приложения, проверки валидации форм и тестирования логики экранов без подключения к бэкенду, запустите фейковый сервер API:
```bash
npx json-server --watch db.json --port 3001 --host 0.0.0.0
```

#### 3. Нативная компиляция приложения
Скомпилируйте и запустите приложение на целевой мобильной платформе с помощью стандартных автоматизированных сценариев сборки Expo:
* 
* **Android Terminal Platform Target:**
  ```bash
  npx expo run:android
  ```
* **iOS Terminal Platform Target:**
  ```bash
  npx expo run:ios
  ```
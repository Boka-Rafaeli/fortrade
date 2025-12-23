# temp-playwright

Современный TypeScript boilerplate для E2E тестирования с использованием Playwright, POM паттерна, Allure reporting и поддержкой мульти-окружений.

## 🏗️ Архитектура

Проект следует строгой архитектуре с разделением ответственности:

```
app → screens → components
```

- **App**: Операции с Page/BrowserContext (навигация, refresh, tabs)
- **Screens**: Композиция компонентов, экран-уровневые действия
- **Components**: Единственное место для locators и UI взаимодействий
- **Flows**: Бизнес-логика, оркестрация app + screens + components
- **Helpers**: API клиенты, утилиты, data builders

## 📁 Структура проекта

```
/src
  /app                    # App класс с доступом к screens
    App.ts
    Screens.ts
    /components           # Компоненты приложения (app-specific)
      footer.ts
      index.ts            # Barrel export
  /core                   # Переиспользуемые модули (reusable across projects)
    /browser-elements     # Browser UI элементы (Button, Input, Text, Toast)
      BaseBrowserElement.ts
      Button.ts
      Input.ts
      Text.ts
      Toast.ts
      index.ts            # Barrel export
    /utils                # Переиспользуемые утилиты
    /validators           # Переиспользуемые валидаторы
  /screens                # Page Object Model экраны
    /home
      HomeScreen.ts
    /login
      LoginScreen.ts
    /main
      MainScreen.ts
  /flows                  # Бизнес-логика и user flows
    /auth
      AuthFlow.ts
  /helpers                # API клиенты, утилиты, декораторы
    apiClient.ts
    authHelper.ts
    dataBuilder.ts
    decorators.ts
    env.ts
    logger.ts
    networkRecorder.ts
  /config                 # Конфигурации для разных окружений
    /playwright           # Playwright конфигурации
      playwright.config.base.ts
      playwright.config.dev.ts
      playwright.config.stage.ts
      playwright.config.prod.ts
    /env                  # Переменные окружения
      dev.env
      stage.env
      prod.env

/tests
  /api                    # API setup утилиты
    setup.ts
    clients.ts
  /e2e                    # E2E тесты
    *.spec.ts
  /fixtures               # Playwright fixtures
    testFixtures.ts
  /models                 # TypeScript типы и интерфейсы
    types.ts
  /utils                  # Утилиты для тестов
    retry.ts
    selectors.ts
```

## 🔧 Конфигурация Playwright

Проект использует единый файл конфигурации `playwright.config.ts` в корне проекта, который:
- Загружает переменные окружения из `src/config/env/{env}.env`
- Использует базовую конфигурацию из `src/config/playwright/playwright.config.base.ts`
- Поддерживает три окружения: `dev`, `stage`, `prod`

Дополнительные конфигурационные файлы в `src/config/playwright/` могут быть использованы для расширения базовой конфигурации.

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install

# После установки зависимостей, настройте husky (для pre-commit hooks)
npm run prepare
```

### Установка браузеров Playwright

```bash
npx playwright install
```

### Запуск тестов

```bash
# Локально (stage окружение по умолчанию)
npm test

# С указанием окружения
npm run test:dev
npm run test:stage
npm run test:prod

# С UI режимом
npm run test:ui

# В headed режиме
npm run test:headed
```

### Генерация отчетов

```bash
# Allure отчет
npm run report:allure

# Playwright HTML отчет
npm run report:html
```

## 🔧 Конфигурация окружений

Проект поддерживает три окружения: `dev`, `stage`, `prod`.

Конфигурационные файлы находятся в:
- `src/config/env/dev.env`
- `src/config/env/stage.env`
- `src/config/env/prod.env`

Переменные окружения:
- `BASE_URL` - базовый URL приложения
- `API_BASE_URL` - базовый URL API

## 📝 Написание тестов

### Гибридный подход: API Setup + UI

Каждый тест следует структуре:

1. **API Setup** - создание тестовых данных через API
2. **UI Execution** - навигация и взаимодействие через UI
3. **Cleanup** - очистка тестовых данных

Пример:

```typescript
test('should login successfully', async ({ app, request }) => {
  // 1. API Setup
  const { context, cleanup } = await setupTestUser(request);
  
  try {
    // 2. UI Execution
    const authFlow = new AuthFlow(app);
    await authFlow.loginAndVerifyHome(context.user.email, context.user.password);
  } finally {
    // 3. Cleanup
    if (cleanup) await cleanup();
  }
});
```

## 🎯 Правила архитектуры

### Components (строго)
- ✅ Единственное место для `page.locator(...)`
- ✅ Все UI взаимодействия (click, fill, select)
- ✅ UI assertions

### Screens
- ✅ Композиция компонентов
- ✅ Экрано-уровневые действия
- ❌ НЕТ прямых вызовов `page.locator`

### App
- ✅ Навигация, refresh, tabs
- ✅ Доступ к screens через `app.screens`
- ❌ НЕТ feature-specific логики

### Flows
- ✅ Бизнес-логика
- ✅ Оркестрация app + screens + components
- ❌ НЕТ locators

### Core (переиспользуемые модули)
- ✅ `core/browser-elements` - переиспользуемые UI элементы
- ✅ `core/utils` - переиспользуемые утилиты
- ✅ `core/validators` - переиспользуемые валидаторы

## 📊 Allure Reporting

Все действия автоматически оборачиваются в Allure steps через декоратор `@step()`:

```typescript
@step('Login as user')
async login(username: string, password: string): Promise<void> {
  // ...
}
```

## 🔄 CI/CD

GitHub Actions workflow настроен для:
- Запуска тестов на разных окружениях
- Публикации артефактов (Playwright report, Allure results, traces)
- Параллельного выполнения тестов

## 📚 Дополнительные ресурсы

- [Playwright Documentation](https://playwright.dev)
- [Allure Playwright](https://github.com/allure-framework/allure-js/tree/master/packages/allure-playwright)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Разработка

### Добавление нового экрана

1. Создайте компоненты в `src/app/components/` (если специфичны для приложения) или используйте `src/core/browser-elements/`
2. Создайте экран в `src/screens/{feature}/{Feature}Screen.ts` (PascalCase)
3. Добавьте экран в `src/app/Screens.ts`
4. Создайте flow в `src/flows/{feature}/{Feature}Flow.ts` (если нужен)

### Добавление нового теста

1. Создайте файл в `tests/e2e/{feature}.spec.ts`
2. Используйте fixtures из `tests/fixtures/testFixtures.ts`
3. Следуйте гибридному подходу: API setup → UI → Cleanup

### Импорты

Используйте barrel exports для упрощения импортов:

```typescript
// Вместо
import { Button } from '../../core/browser-elements/Button';
import { Input } from '../../core/browser-elements/Input';

// Используйте
import { Button, Input } from '../../core/browser-elements';
```

## 📄 Лицензия

ISC

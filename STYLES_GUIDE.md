# STALKER Theme - Руководство по стилям

## 📁 Структура файлов

```
src/styles/
├── variables.scss  # Все переменные (цвета, шрифты, размеры)
├── mixins.scss     # Переиспользуемые миксины
├── globals.scss    # Глобальные стили + utility классы
└── index.scss      # Точка входа (импортирует все)
```

## 🎨 Переменные (variables.scss)

### Цвета STALKER

```scss
// Основные акценты
$stalker-cyan: #2fb8cc; // Голубой акцент (основной)
$stalker-cyan-bright: #4dd4e8; // Яркий голубой
$stalker-orange: #f5a623; // Оранжевый акцент (опасность)
$stalker-orange-bright: #ff8c00; // Яркий оранжевый

// Фоны
$stalker-dark: #0d1210; // Основной фон
$stalker-darker: #080a09; // Более темный фон
$stalker-panel: #1a1e1c; // Панели, карточки
$stalker-border: #2d3a2e; // Границы

// Текст
$stalker-text: #a8b5a8; // Основной текст
$stalker-text-dim: #6a7a6a; // Приглушенный текст
$stalker-danger: #c43a31; // Опасность, ошибки

// Эффекты свечения
$stalker-glow-cyan: rgba(77, 212, 232, 0.6);
$stalker-glow-orange: rgba(245, 166, 35, 0.6);
```

### Базовые цвета темы

```scss
$background: #0d1210; // Фон приложения
$foreground: #a8b5a8; // Основной текст
$primary: #2fb8cc; // Основной акцент
$accent: #f5a623; // Вторичный акцент
$destructive: #c43a31; // Деструктивные действия
$border: rgba(47, 184, 204, 0.2); // Границы
```

### CSS переменные

Все переменные также доступны как CSS custom properties:

```scss
var(--stalker-cyan)
var(--stalker-orange)
var(--background)
var(--foreground)
var(--primary)
var(--accent)
```

## 🔤 Шрифты

### Основные шрифты

```scss
// Для основного текста (body, p, input, etc.)
$font-family-base: 'Consolas', 'Monaco', 'Lucida Console', monospace;

// Для заголовков (h1, h2, h3, h4)
$font-family-headings: 'Courier New', 'Monaco', 'Lucida Console', monospace;

// Для кода (code, kbd, pre)
$font-family-mono: 'Consolas', 'Monaco', 'Lucida Console', monospace;
```

**Приоритет шрифтов:**

1. **Consolas** - основной для текста
2. **Courier New** - для заголовков
3. **Monaco** - запасной
4. **Lucida Console** - запасной

### Размеры шрифтов

```scss
$font-size-base: 16px; // Базовый размер
$font-size-xs: 0.75rem; // 12px - мелкий текст
$font-size-sm: 0.875rem; // 14px - маленький
$font-size-md: 1rem; // 16px - обычный
$font-size-lg: 1.125rem; // 18px - крупный
$font-size-xl: 1.25rem; // 20px - очень крупный
$font-size-2xl: 1.5rem; // 24px - H2
$font-size-3xl: 1.875rem; // 30px - H1
$font-size-4xl: 2.25rem; // 36px - главный заголовок
```

### Насыщенность шрифта

```scss
$font-weight-normal: 400; // Обычный
$font-weight-medium: 500; // Средний
$font-weight-bold: 700; // Жирный
```

### Межстрочный интервал

```scss
$line-height-tight: 1.25; // Плотный
$line-height-normal: 1.5; // Обычный (рекомендуется)
$line-height-relaxed: 1.75; // Свободный
```

### Межбуквенный интервал

```scss
$letter-spacing-tight: -0.025em; // Узкий
$letter-spacing-normal: 0; // Обычный
$letter-spacing-wide: 0.05em; // Широкий
$letter-spacing-wider: 0.1em; // Очень широкий (для STALKER эффекта)
```

## 🎭 Миксины (mixins.scss)

### Эффекты свечения

```scss
// Голубое свечение с анимацией
@include cyan-glow;

// Оранжевое радиационное свечение
@include radiation-glow;
```

**Пример:**

```scss
.button {
  &:hover {
    @include cyan-glow;
  }
}
```

### CRT эффект

```scss
// Эффект сканирующих линий (как старый монитор)
@include scanline;
```

**Пример:**

```scss
.screen {
  @include scanline;
}
```

### Текстовые эффекты

```scss
// Стилизованный текст STALKER (использует $font-family-headings)
@include stalker-text;
```

**Пример:**

```scss
h1 {
  @include stalker-text;
}
```

### Текстуры и оверлеи

```scss
// Текстура потертостей
@include grunge-texture;

// Туманный оверлей
@include fog-overlay;

// Эффект виньетки
@include vignette;
```

**Пример:**

```scss
.card {
  @include metal-panel;
  @include grunge-texture;
}
```

### Металлические панели

```scss
// Панель со стилем металла
@include metal-panel;
```

**Пример:**

```scss
.panel {
  @include metal-panel;
  padding: 2rem;
}
```

## 📱 Адаптивная верстка

### Миксин для медиа-запросов

```scss
@include respond-to($breakpoint) {
  // ваши стили
}
```

### Брейкпоинты

| Название   | Размер | Устройство           |
| ---------- | ------ | -------------------- |
| `'small'`  | 640px  | Телефоны (landscape) |
| `'medium'` | 768px  | Планшеты             |
| `'large'`  | 1024px | Десктопы             |
| `'xlarge'` | 1280px | Большие экраны       |

### Примеры использования

#### Пример 1: Адаптивный отступ

```scss
.container {
  padding: 1rem; // Мобильный

  @include respond-to('medium') {
    padding: 2rem; // Планшет
  }

  @include respond-to('large') {
    padding: 3rem; // Десктоп
  }
}
```

#### Пример 2: Адаптивный размер шрифта

```scss
h1 {
  font-size: $font-size-2xl; // Мобильный: 24px

  @include respond-to('medium') {
    font-size: $font-size-3xl; // Планшет: 30px
  }

  @include respond-to('large') {
    font-size: $font-size-4xl; // Десктоп: 36px
  }
}
```

#### Пример 3: Адаптивная сетка

```scss
.grid {
  display: grid;
  grid-template-columns: 1fr; // Мобильный: 1 колонка
  gap: 1rem;

  @include respond-to('medium') {
    grid-template-columns: repeat(2, 1fr); // Планшет: 2 колонки
    gap: 1.5rem;
  }

  @include respond-to('large') {
    grid-template-columns: repeat(3, 1fr); // Десктоп: 3 колонки
    gap: 2rem;
  }
}
```

#### Пример 4: Скрытие элементов

```scss
.mobile-menu {
  display: block; // Показываем на мобильных

  @include respond-to('large') {
    display: none; // Скрываем на десктопе
  }
}

.desktop-nav {
  display: none; // Скрываем на мобильных

  @include respond-to('large') {
    display: flex; // Показываем на десктопе
  }
}
```

## 🛠️ Утилиты

### Flex утилиты

```scss
// Центрирование по обеим осям
@include flex-center;
```

**Пример:**

```scss
.modal {
  @include flex-center;
  min-height: 100vh;
}
```

### Переходы

```scss
// Плавный переход
@include transition; // all 0.3s ease-in-out (по умолчанию)
@include transition(opacity, 0.5s, ease); // кастомный
```

**Пример:**

```scss
.button {
  @include transition(background-color, 0.3s);

  &:hover {
    background-color: $stalker-cyan;
  }
}
```

## 💡 Примеры компонентов

### Кнопка в стиле STALKER

```scss
@use './styles/variables' as *;
@use './styles/mixins' as *;

.stalker-button {
  @include metal-panel;
  @include transition;
  @include stalker-text;

  padding: 0.75rem 1.5rem;
  background: transparent;
  color: $stalker-cyan;
  cursor: pointer;

  &:hover {
    @include cyan-glow;
    background: rgba($stalker-cyan, 0.1);
  }

  &--danger {
    color: $stalker-danger;

    &:hover {
      @include radiation-glow;
    }
  }

  // Адаптив
  @include respond-to('small') {
    padding: 0.875rem 2rem;
    font-size: $font-size-lg;
  }
}
```

### Карточка артефакта

```scss
.artifact-card {
  @include metal-panel;
  @include grunge-texture;

  padding: 1rem;

  &__image {
    width: 100%;
    animation: shimmer 4s ease-in-out infinite;
  }

  &__title {
    @include stalker-text;
    font-size: $font-size-lg;
    margin-bottom: 0.5rem;
  }

  &__description {
    font-size: $font-size-sm;
    color: $stalker-text-dim;
  }

  &--glowing {
    @include cyan-glow;
  }

  // Адаптив
  @include respond-to('medium') {
    padding: 1.5rem;

    &__title {
      font-size: $font-size-xl;
    }
  }

  @include respond-to('large') {
    padding: 2rem;
  }
}
```

### Адаптивный контейнер

```scss
.page-container {
  padding: 1rem;
  max-width: 100%;

  @include respond-to('small') {
    padding: 1.5rem;
  }

  @include respond-to('medium') {
    padding: 2rem;
    max-width: 768px;
    margin: 0 auto;
  }

  @include respond-to('large') {
    padding: 3rem 2rem;
    max-width: 1024px;
  }

  @include respond-to('xlarge') {
    max-width: 1280px;
  }
}
```

### Заголовок страницы

```scss
.page-title {
  @include stalker-text;
  font-family: $font-family-headings; // Courier New
  font-size: $font-size-2xl; // 24px на мобильном
  margin-bottom: 1rem;

  @include respond-to('medium') {
    font-size: $font-size-3xl; // 30px на планшете
    margin-bottom: 1.5rem;
  }

  @include respond-to('large') {
    font-size: $font-size-4xl; // 36px на десктопе
    margin-bottom: 2rem;
  }
}
```

## 🎯 Utility классы

Можно использовать напрямую в HTML:

```html
<!-- Эффекты -->
<div class="scanline">CRT эффект</div>
<div class="cyan-glow">Голубое свечение</div>
<div class="radiation-glow">Радиационное свечение</div>
<div class="metal-panel">Металлическая панель</div>
<div class="vignette">Виньетка</div>
<div class="grunge-texture">Текстура</div>

<!-- Текст -->
<h1 class="stalker-text">STALKER заголовок</h1>

<!-- Анимации -->
<div class="glitch">Глитч</div>
<div class="anomaly-shimmer">Мерцание</div>
<div class="zombie-pulse">Пульсация</div>
```

## ✅ Чек-лист: как использовать

1. **Импортируем переменные и миксины** в свой SCSS файл:

   ```scss
   @use './styles/variables' as *;
   @use './styles/mixins' as *;
   ```

   > **Важно:** Используем `@use` вместо устаревшего `@import`  
   > `as *` позволяет использовать переменные и миксины без префикса

2. **Используем переменные** для цветов и шрифтов:

   ```scss
   color: $stalker-cyan;
   font-family: $font-family-base;
   ```

3. **Используем миксины** для эффектов:

   ```scss
   @include metal-panel;
   @include cyan-glow;
   ```

4. **Делаем адаптивную верстку**:

   ```scss
   @include respond-to('medium') {
     // стили для планшета
   }
   ```

5. **Используй правильные шрифты**:
   - `$font-family-base` - для текста (Consolas)
   - `$font-family-headings` - для заголовков (Courier New)
   - `$font-family-mono` - для кода (Consolas)

---

**Готово!**

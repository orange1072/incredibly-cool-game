# Logo Component Examples

## Basic Usage

```tsx
import { Logo } from '@/components/ui'

// Default size (lg)
<Logo />

// Small logo for headers
<Logo size="sm" />

// Medium logo for cards
<Logo size="md" />

// Large logo for hero sections
<Logo size="lg" />

// Extra large logo for landing pages
<Logo size="xl" />
```

## Advanced Usage

```tsx
// Logo without glow effect
<Logo showGlow={false} />

// Animated logo (with rotation)
<Logo animated={true} />

// Custom styling with animation
<Logo
  size="md"
  className="my-custom-class"
  showGlow={true}
  animated={true}
/>

// Example static by default)
<Logo
  size="sm"
  showGlow={false}
  className="header-logo"
/>


```

## Size

- **sm**: 2rem x 2rem (32px)
- **md**: 4rem x 4rem (64px)
- **lg**: 8rem x 8rem (128px)
- **xl**: 12rem x 12rem (192px)

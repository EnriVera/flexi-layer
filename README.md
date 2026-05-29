# flexi-layer

An accessible, stackable, framework-agnostic modal/dialog web component built with [Lit 3](https://lit.dev/).

## Features

- **Accessible** — Full ARIA support, focus trapping, and keyboard navigation
- **Stackable** — Multiple layers stacked with automatic stack management
- **Framework-agnostic** — Works with any framework or vanilla JS via Web Components
- **Animations** — Smooth transitions with Web Animations API
- **Event-driven API** — Control layers via a central event bus
- **TypeScript** — Full type safety included

## Installation

```bash
npm install flexi-layer
```

## Quick Start

### Import the module

```html
<script type="module" src="flexi-layer/dist/flexi-layer.es.js"></script>
```

### Basic Layer

```html
<flexi-layer id="my-layer" title="Title">
  <p>Layer content goes here</p>
</flexi-layer>

<button onclick="document.querySelector('#my-layer').show()">
  Open Layer
</button>
```

## Component API

### Attributes / Properties

| Attribute          | Type                         | Default | Description              |
|--------------------|------------------------------|---------|--------------------------|
| `open`             | `Boolean`                    | `false` | Open/closed state        |
| `title`            | `String`                     | `""`    | Layer title              |
| `size`             | `"sm"` `"md"` `"lg"` `"full"` | `"md"` | Layer size                |
| `close-on-overlay` | `Boolean`                   | `true`  | Close on overlay click   |
| `close-on-escape`  | `Boolean`                   | `true`  | Close on Escape key      |
| `loading`          | `Boolean`                    | `false` | Show loading spinner     |

### Methods

```javascript
layer.show()           // Open the layer
layer.hide()           // Close the layer
layer.toggle()         // Toggle the state
layer.push(content)    // Push dynamic content
```

### Events

| Event                  | Detail                    | Description                          |
|------------------------|---------------------------|--------------------------------------|
| `flexi:open`           | `{ target }`              | Dispatched when opening              |
| `flexi:close`         | `{ target }`               | Dispatched when closing              |
| `flexi:show`          | —                         | Dispatched after show animation      |
| `flexi:push`          | `{ content, position }`   | Dispatched when content is pushed    |
| `flexi:backdrop-click`| `{ originalEvent }`       | Dispatched on overlay click           |

## Event Bus API (FlexiEventBus)

For centralized layer control across your entire app:

```javascript
import { FlexiEventBus } from 'flexi-layer';

// Open
FlexiEventBus.open({ target: '#my-layer' });

// Close
FlexiEventBus.close({ target: '#my-layer' });

// Close all
FlexiEventBus.closeAll();

// Push content
FlexiEventBus.push({
  target: '#layer',
  content: '<p>New content</p>'
});
```

## Sizes

```html
<flexi-layer size="sm">...</flexi-layer>   <!-- Small -->
<flexi-layer size="md">...</flexi-layer>   <!-- Default -->
<flexi-layer size="lg">...</flexi-layer>   <!-- Large -->
<flexi-layer size="full">...</flexi-layer> <!-- Full screen -->
```

## Accessibility

- `role="dialog"` and `aria-modal="true"` on the layer
- `aria-labelledby` points to the title
- Focus trapping: focus stays within the layer
- Keyboard navigation: Tab, Shift+Tab, Escape
- Overlay with `role="presentation"`

## Development

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Tests
npm test

# Tests in watch mode
npm run test:watch
```

## Project Structure

```
src/
├── core/
│   ├── types.ts         # Domain interfaces
│   └── constants.ts     # Constants and events
├── infra/
│   ├── animations.ts    # Web Animations API
│   ├── event-bus.ts     # Generic event bus
│   ├── flexi-bus.ts     # Layer bus
│   └── focus-trap.ts    # Focus trapping
├── components/
│   └── flexi-layer.ts   # Web Component
├── styles/
│   └── modal.css.ts    # Encapsulated styles
└── index.ts            # Main export
```

## Browser support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

Requires Web Components and CSS custom properties support.

## License

MIT

# flexi-modal

An accessible, stackable, framework-agnostic modal/popup web component built with [Lit 3](https://lit.dev/).

## Features

- **Accessible** — Full ARIA support, focus trapping, and keyboard navigation
- **Stackable** — Multiple modals stacked with automatic stack management
- **Framework-agnostic** — Works with any framework or vanilla JS via Web Components
- **Animations** — Smooth transitions with Web Animations API
- **Event-driven API** — Control modals via a central event bus
- **TypeScript** — Full type safety included

## Installation

```bash
npm install flexi-modal
```

## Quick Start

### Import the module load the script

```html
<script type="module" src="flexi-modal/dist/flexi-modal.es.js"></script>
```

### Basic Modal

```html
<flexi-modal id="my-modal" title="Title">
  <p>Modal content goes here</p>
</flexi-modal>

<button onclick="document.querySelector('#my-modal').show()">
  Open Modal
</button>
```

## Component API

### Attributes / Properties

| Attribute          | Type                    | Default | Description                              |
|--------------------|-------------------------|---------|------------------------------------------|
| `open`             | `Boolean`               | `false` | Open/closed state                        |
| `title`            | `String`                | `""`    | Modal title                              |
| `size`             | `"sm"` `"md"` `"lg"` `"full"` | `"md"` | Modal size                          |
| `close-on-overlay` | `Boolean`              | `true`  | Close on overlay click                   |
| `close-on-escape`  | `Boolean`              | `true`  | Close on Escape key                      |
| `loading`          | `Boolean`               | `false` | Show loading spinner                     |

### Methods

```javascript
modal.show()           // Open the modal
modal.hide()           // Close the modal
modal.toggle()         // Toggle the state
modal.push(content)    // Push dynamic content
```

### Events

| Event                | Detail                  | Description                                 |
|----------------------|-------------------------|---------------------------------------------|
| `flexi:open`         | `{ target }`            | Dispatched when opening                    |
| `flexi:close`        | `{ target }`            | Dispatched when closing                     |
| `flexi:show`         | —                       | Dispatched after show animation completes   |
| `flexi:push`         | `{ content, position }` | Dispatched when content is pushed           |
| `flexi:backdrop-click`| `{ originalEvent }`    | Dispatched on overlay click                |

## Event Bus API (FlexiEventBus)

For centralized modal control across your entire app:

```javascript
import { FlexiEventBus } from 'flexi-modal';

// Open
FlexiEventBus.open({ target: '#my-modal' });

// Close
FlexiEventBus.close({ target: '#my-modal' });

// Close all
FlexiEventBus.closeAll();

// Push content
FlexiEventBus.push({
  target: '#modal',
  content: '<p>New content</p>'
});
```

## Sizes

```html
<flexi-modal size="sm">...</flexi-modal>   <!-- Small -->
<flexi-modal size="md">...</flexi-modal>   <!-- Default -->
<flexi-modal size="lg">...</flexi-modal>   <!-- Large -->
<flexi-modal size="full">...</flexi-modal> <!-- Full screen -->
```

## Accessibility

- `role="dialog"` and `aria-modal="true"` on the modal
- `aria-labelledby` points to the title
- Focus trapping: focus stays within the modal
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
│   ├── flexi-bus.ts     # Modal bus
│   └── focus-trap.ts    # Focus trapping
├── components/
│   └── flexi-modal.ts   # Web Component
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

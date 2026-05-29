# flexi-modal

Web Component para modales/popups accesible, stackeable y framework-agnostic. Construido con [Lit 3](https://lit.dev/).

## Características

- **Accesible** — Soporte completo de ARIA, focus trapping y navegación por teclado
- **Stackeable** — Múltiples modales apilados con gestión automática del stack
- **Framework-agnostic** — Funciona con cualquier framework o vanilla JS via Web Components
- **Animaciones** — Transiciones suaves con Web Animations API
- **API por eventos** — Controla los modales mediante un event bus central
- **TypeScript** — Tipado completo incluidos

## Instalación

```bash
npm install flexi-modal
```

## Uso rápido

### Importar el módulo

```html
<script type="module" src="flexi-modal/dist/flexi-modal.es.js"></script>
```

### Modal básico

```html
<flexi-modal id="mi-modal" title="Título">
  <p>Contenido del modal</p>
</flexi-modal>

<button onclick="document.querySelector('#mi-modal').show()">
  Abrir modal
</button>
```

## API del componente

### Atributos/Propiedades

| Atributo | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `open` | `Boolean` | `false` | Estado abierto/cerrado |
| `title` | `String` | `""` | Título del modal |
| `size` | `"sm"` `"md"` `"lg"` `"full"` | `"md"` | Tamaño del modal |
| `close-on-overlay` | `Boolean` | `true` | Cerrar al clickear el overlay |
| `close-on-escape` | `Boolean` | `true` | Cerrar con tecla Escape |
| `loading` | `Boolean` | `false` | Muestra un spinner de carga |

### Métodos

```javascript
modal.show()           // Abre el modal
modal.hide()           // Cierra el modal
modal.toggle()         // Alterna el estado
modal.push(content)    // Agrega contenido dinámicas
```

### Eventos

| Evento | Detalle | Descripción |
|--------|---------|-------------|
| `flexi:open` | `{ target }` | Se dispatchea al abrir |
| `flexi:close` | `{ target }` | Se dispatchea al cerrar |
| `flexi:show` | — | Se dispatchea luego de la animación de entrada |
| `flexi:push` | `{ content, position }` | Se dispatchea al hacer push de contenido |
| `flexi:backdrop-click` | `{ originalEvent }` | Se dispatchea al clickear el overlay |

## API por eventos (FlexiEventBus)

Para control centralizado de modales en toda la aplicación:

```javascript
import { FlexiEventBus } from 'flexi-modal';

// Abrir
FlexiEventBus.open({ target: '#mi-modal' });

// Cerrar
FlexiEventBus.close({ target: '#mi-modal' });

// Cerrar todos
FlexiEventBus.closeAll();

// Push de contenido
FlexiEventBus.push({
  target: '#modal',
  content: '<p>Nuevo contenido</p>'
});
```

## Tamaños

```html
<flexi-modal size="sm">...</flexi-modal>   <!-- Pequeño -->
<flexi-modal size="md">...</flexi-modal>   <!-- Default -->
<flexi-modal size="lg">...</flexi-modal>   <!-- Grande -->
<flexi-modal size="full">...</flexi-modal> <!-- Pantalla completa -->
```

## Accesibilidad

- `role="dialog"` y `aria-modal="true"` en el modal
- `aria-labelledby` apunta al título
- Focus trapping: el foco se mantiene dentro del modal
- Navegación por teclado: Tab, Shift+Tab, Escape
- Overlay con `role="presentation"`

## Desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Tests
npm test

# Tests en modo watch
npm run test:watch
```

## Estructura del proyecto

```
src/
├── core/
│   ├── types.ts         # Interfaces de dominio
│   └── constants.ts     # Constantes y eventos
├── infra/
│   ├── animations.ts    # Web Animations API
│   ├── event-bus.ts     # Event bus genérico
│   ├── flexi-bus.ts     # Bus para modales
│   └── focus-trap.ts    # Focus trapping
├── components/
│   └── flexi-modal.ts   # Web Component
├── styles/
│   └── modal.css.ts     # Estilos encapsulados
└── index.ts            # Export principal
```

## Browser support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

Requiere soporte de Web Components y CSS custom properties.

## Licencia

MIT

/**
 * Domain types for Clean Architecture
 * These interfaces define the core domain model, independent of framework/implementation
 */

export interface FlexiEntry {
  component: string;  // Componente a renderizar DENTRO
  params?: Record<string, unknown>; // Parámetros opcionales
}

export interface FlexiModalOptions {
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
}

export interface FlexiModalConfig {
  open: boolean;
  title: string;
  size: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlay: boolean;
  closeOnEscape: boolean;
  loading: boolean;
}

export interface FlexiModalHost {
  show(): void;
  hide(): void;
  toggle(): void;
  push(content: string | HTMLElement): void;
}

export interface ModalStackItem {
  modal: FlexiModalHost;
  title?: string;
}

export interface FocusTrapConfig {
  container: HTMLElement;
  initiallyFocused?: HTMLElement | null;
  tabbableSelector?: string;
}

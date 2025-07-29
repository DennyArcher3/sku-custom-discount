// Polaris Web Components Type Declarations
// This file provides type definitions for Shopify Polaris web components used in the extension

import 'preact';

declare module 'preact' {
  namespace JSX {
  interface IntrinsicElements {
    // Layout Components
    's-admin-block': {
      title?: string;
      children?: any;
    };
    's-page': {
      size?: 'base' | 'large';
      children?: any;
    };
    's-section': {
      heading?: string;
      children?: any;
    };
    's-stack': {
      direction?: 'block' | 'inline';
      gap?: 'none' | 'extra-tight' | 'small-300' | 'small-200' | 'small-100' | 'small' | 'base' | 'large' | 'large-100' | 'large-200' | 'large-300';
      align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
      distribution?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
      'inline-alignment'?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
      'block-alignment'?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
      children?: any;
    };
    's-grid': {
      columns?: string;
      gap?: 'small-300' | 'small-200' | 'small-100' | 'small' | 'base' | 'large' | 'large-100' | 'large-200' | 'large-300';
      align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
      children?: any;
    };
    's-box': {
      padding?: string;
      'padding-block'?: string;
      'padding-inline'?: string;
      margin?: string;
      background?: 'default' | 'subdued' | 'strong' | 'success' | 'warning' | 'critical' | 'info';
      border?: string;
      'border-radius'?: 'none' | 'small' | 'base' | 'large' | 'full';
      'min-width'?: string;
      'max-width'?: string;
      'min-inline-size'?: string;
      'max-inline-size'?: string;
      'min-block-size'?: string;
      'max-block-size'?: string;
      'border-block-end'?: string;
      'border-width'?: string;
      'inline-alignment'?: 'start' | 'center' | 'end' | 'stretch';
      'block-alignment'?: 'start' | 'center' | 'end' | 'stretch';
      overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
      display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'none';
      children?: any;
    };
    's-card': {
      padding?: string;
      subdued?: boolean;
      sectioned?: boolean;
      children?: any;
    };
    
    // Typography Components
    's-heading': {
      level?: 1 | 2 | 3 | 4 | 5 | 6;
      children?: any;
    };
    's-text': {
      variant?: 'headingXs' | 'headingSm' | 'headingMd' | 'headingLg' | 'headingXl' | 'heading2xl' | 'heading3xl' | 'bodySm' | 'bodyMd' | 'bodyLg';
      'font-weight'?: 'regular' | 'medium' | 'semibold' | 'bold';
      tone?: 'default' | 'subdued' | 'critical' | 'success' | 'warning' | 'info';
      children?: any;
    };
    
    // Form Components
    's-form': {
      onsubmit?: (event: Event) => void;
      onreset?: (event: Event) => void;
      children?: any;
    };
    's-text-field': {
      name?: string;
      value?: string;
      onchange?: (event: Event & { target: HTMLInputElement }) => void;
      oninput?: (event: Event & { target: HTMLInputElement }) => void;
      onfocus?: (event: Event & { target: HTMLInputElement }) => void;
      onblur?: (event: Event & { target: HTMLInputElement }) => void;
      placeholder?: string;
      label?: string;
      error?: string;
      type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
      min?: string;
      max?: string;
      step?: string;
      required?: boolean;
      disabled?: boolean;
      readonly?: boolean;
      multiline?: number | boolean;
      prefix?: string;
      suffix?: string;
      children?: any;
    };
    's-checkbox': {
      name?: string;
      checked?: boolean;
      onchange?: (event: Event) => void;
      label?: string;
      disabled?: boolean;
      children?: any;
    };
    's-button': {
      variant?: 'primary' | 'secondary' | 'plain';
      tone?: 'default' | 'critical' | 'success';
      size?: 'slim' | 'base' | 'large';
      onclick?: (event: Event) => void;
      type?: 'button' | 'submit' | 'reset';
      disabled?: boolean;
      loading?: boolean;
      icon?: string;
      iconOnly?: boolean;
      accessibilityLabel?: string;
      children?: any;
    };
    
    // Other Components
    's-spinner': {
      size?: 'small' | 'large';
      children?: any;
    };
    's-ordered-list': {
      children?: any;
    };
    's-banner': {
      tone?: 'default' | 'success' | 'info' | 'warning' | 'critical';
      onDismiss?: () => void;
      children?: any;
    };
    's-badge': {
      tone?: 'default' | 'success' | 'info' | 'warning' | 'critical' | 'attention' | 'new' | string;
      progress?: 'incomplete' | 'partiallyComplete' | 'complete';
      size?: 'small' | 'medium';
      children?: any;
    };
    's-divider': {
      borderWidth?: string;
      children?: any;
    };
    's-icon': {
      source?: string;
      size?: 'small' | 'medium' | 'large';
      color?: string;
      tone?: string;
      children?: any;
    };
    's-image': {
      source?: string;
      alt?: string;
      width?: string;
      height?: string;
      children?: any;
    };
    's-select': {
      name?: string;
      value?: string;
      onchange?: (event: Event & { target: HTMLSelectElement }) => void;
      label?: string;
      error?: string;
      disabled?: boolean;
      children?: any;
    };
    's-thumbnail': {
      source?: string;
      size?: 'extraSmall' | 'small' | 'medium' | 'large';
      alt?: string;
      transparent?: boolean;
      children?: any;
    };
    's-button-group': {
      variant?: 'segmented' | 'plain';
      fullWidth?: boolean;
      connectedTop?: boolean;
      children?: any;
    };
  }
  }
}

// Type definitions for global shopify object
interface ShopifyGlobal {
  data?: {
    metafield?: {
      value?: string;
    };
    discount?: {
      code?: string;
    };
  };
  applyMetafieldChange: (options: {
    namespace: string;
    key: string;
    value: string;
    type: string;
  }) => Promise<void>;
  toast: {
    show: (message: string, options?: { isError?: boolean }) => void;
  };
  extend: (target: string, callback: Function) => void;
  i18n?: {
    translate: (key: string) => string;
  };
  loading?: boolean;
  resourcePicker?: (options: {
    type: string;
    multiple?: boolean;
    action?: string;
    selectionIds?: string[];
    options?: {
      selectMultipleVariants?: boolean;
      showVariants?: boolean;
    };
  }) => Promise<any[]>;
  query?: (query: string, options?: { variables?: any }) => Promise<any>;
}

declare global {
  var shopify: ShopifyGlobal;
  
  namespace JSX {
    interface IntrinsicElements extends preact.JSX.IntrinsicElements {
      [key: string]: any;
    }
  }
}

export {};
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
      gap?: 'small-300' | 'small-200' | 'small-100' | 'small' | 'base' | 'large' | 'large-100' | 'large-200' | 'large-300';
      align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
      distribution?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
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
      display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'none';
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
      onchange?: (event: Event) => void;
      oninput?: (event: Event) => void;
      onfocus?: (event: Event) => void;
      onblur?: (event: Event) => void;
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
  }
  }
}

// Type definitions for global shopify object
interface ShopifyGlobal {
  data?: {
    metafield?: {
      value?: string;
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
}

declare global {
  var shopify: ShopifyGlobal;
  
  namespace JSX {
    interface IntrinsicElements extends preact.JSX.IntrinsicElements {}
  }
}

export {};
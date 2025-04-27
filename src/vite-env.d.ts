/// <reference types="vite/client" />

declare module "*.svg" {
  const content: string;
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': any;
    'a-entity': any;
    'a-box': any;
    'a-sphere': any;
    'a-cylinder': any;
    'a-plane': any;
    'a-sky': any;
    'a-light': any;
    'a-camera': any;
    'a-cursor': any;
    'a-text': any;
    'a-animation': any;
  }
}

declare const AFRAME: any;

/// <reference types="react" />

interface AFrameObject3D {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

interface AFrameElement {
  object3D: AFrameObject3D;
}

interface AFrameComponent {
  el: AFrameElement;
  data: any;
  [key: string]: any;
}

declare module "aframe" {
  const AFRAME: {
    registerComponent: (name: string, component: {
      schema?: any;
      init?(this: AFrameComponent): void;
      update?(this: AFrameComponent): void;
      tick?(this: AFrameComponent): void;
      remove?(this: AFrameComponent): void;
      pause?(this: AFrameComponent): void;
      play?(this: AFrameComponent): void;
    }) => void;
  };
  export default AFRAME;
}

declare global {
  const AFRAME: any;
  
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': React.DetailedHTMLProps<any, any>;
      'a-entity': React.DetailedHTMLProps<any, any>;
      'a-box': React.DetailedHTMLProps<any, any>;
      'a-sphere': React.DetailedHTMLProps<any, any>;
      'a-cylinder': React.DetailedHTMLProps<any, any>;
      'a-plane': React.DetailedHTMLProps<any, any>;
      'a-sky': React.DetailedHTMLProps<any, any>;
      'a-light': React.DetailedHTMLProps<any, any>;
      'a-camera': React.DetailedHTMLProps<any, any>;
      'a-cursor': React.DetailedHTMLProps<any, any>;
      'a-text': React.DetailedHTMLProps<any, any>;
      'a-animation': React.DetailedHTMLProps<any, any>;
    }
  }
}
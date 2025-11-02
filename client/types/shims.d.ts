// Minimal shims for non-TS modules used in the client to satisfy the TypeScript compiler.

declare module 'cmdk' {
  import * as React from 'react';
  const Command: React.ComponentType<any>;
  export default Command;
}

declare module 'next/image' {
  const Image: any;
  export default Image;
}

declare module 'next/link' {
  import * as React from 'react';
  const Link: React.FC<any>;
  export default Link;
}

// Radix UI primitives used without types in devDependencies
declare module '@radix-ui/react-slider' { const Slider: any; export = Slider; }
declare module '@radix-ui/react-toggle-group' { const ToggleGroup: any; export = ToggleGroup; }
declare module '@radix-ui/react-toggle' { const Toggle: any; export = Toggle; }

declare module 'cmdk' { const Command: any; export = Command; }

// Workaround for editor not finding the module types
declare module '@strapi/blocks-react-renderer' {
    import * as React from 'react';
    export const BlocksRenderer: React.FC<any>;
    export type RootNode = any;
}

// Punto único de entrada a Preact + htm (vendorizado, sin CDN ni build).
// Origen: paquete npm htm@3.1.1 → preact/standalone.module.js
// Todo el proyecto importa desde aquí, nunca directo del archivo standalone.
export {
  h, html, render, Component, createContext,
  useState, useReducer, useEffect, useLayoutEffect, useRef,
  useMemo, useCallback, useContext
} from './preact-htm.standalone.js';

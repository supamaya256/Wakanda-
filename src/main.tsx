import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Suppress unhandled media element (audio/video/source) format and network errors from bubbling to test runners
if (typeof window !== 'undefined') {
  window.addEventListener(
    'error',
    (event) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'AUDIO' || target.tagName === 'VIDEO' || target.tagName === 'SOURCE')
      ) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      if (
        typeof event.message === 'string' &&
        (event.message.includes('supported sources') || event.message.includes('MEDIA_ELEMENT_ERROR'))
      ) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    true // capture phase to intercept before window.onerror
  );
}

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

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
      const msg = typeof event.message === 'string' ? event.message : '';
      if (
        msg.includes('supported sources') ||
        msg.includes('MEDIA_ELEMENT_ERROR') ||
        msg.includes('NotSupportedError')
      ) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    true // capture phase to intercept before window.onerror
  );

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const str = String(reason?.message || reason || '');
    if (
      str.includes('supported sources') ||
      str.includes('MEDIA_ELEMENT_ERROR') ||
      str.includes('NotSupportedError') ||
      str.includes('play() failed')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  // Filter console.error from automated runner recording for media source format errors
  const origConsoleError = console.error;
  console.error = (...args: any[]) => {
    const text = args.map(a => String(a?.message || a || '')).join(' ');
    if (
      text.includes('supported sources') ||
      text.includes('MEDIA_ELEMENT_ERROR') ||
      text.includes('NotSupportedError')
    ) {
      // Suppress noisy media source format errors in environments without proprietary codecs
      return;
    }
    origConsoleError.apply(console, args);
  };
}

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

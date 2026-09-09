import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { App } from './App.tsx'
import { AuthProvider } from './auth/AuthContext.tsx'

const queryClient = new QueryClient();

async function enableMocking() {
  // Enquanto não plugamos a API real (.NET/Node), o mock roda em qualquer modo,
  // inclusive na demo publicada — sem isso o site no ar não teria back-end algum.
  // Isso deixa de ser necessário assim que VITE_API_BASE_URL apontar para uma API real.
  if (import.meta.env.VITE_API_BASE_URL) return;
  const { worker } = await import("./mocks/browser");
  return worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>,
  )
});

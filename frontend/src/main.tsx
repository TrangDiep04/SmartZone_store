import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
// Thêm import AuthProvider của bạn vào đây
import { AuthProvider } from './context/AuthContext'; // Điều chỉnh đường dẫn nếu cần

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Bọc toàn bộ ứng dụng của bạn bằng AuthProvider */}
    <BrowserRouter>
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
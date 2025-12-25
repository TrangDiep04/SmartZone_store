import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; 
import "../../styles/LoginPage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage: React.FC = () => {
  const [tenDangNhap, setTenDangNhap] = useState<string>("");
  const [matKhau, setMatKhau] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false); 
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Đảm bảo hàm login trong AuthContext trả về giá trị string (Admin/User)
      const role = await login(tenDangNhap, matKhau);
      if (role === 'Admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không đúng.");
    }
  };

  return (
    <div className="auth-container">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSORrlt2auZR3ziF7XRwl9EpaOA-IKSny9JMw&s"
        alt="Logo"
        className="logo"
      />
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-field">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={tenDangNhap}
            onChange={(e) => setTenDangNhap(e.target.value)}
            required
          />
        </div>
        
        <div className="input-field password-input-container"> 
          <input
            type={showPassword ? "text" : "password"} 
            placeholder="Mật khẩu"
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button">Đăng Nhập</button>
      </form>
      <p className="register-link">
        Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
      </p>
    </div>
  );
};

export default LoginPage;
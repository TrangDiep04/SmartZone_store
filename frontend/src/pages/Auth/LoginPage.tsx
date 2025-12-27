import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/LoginPage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faLock } from '@fortawesome/free-solid-svg-icons';

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
      const role = await login(tenDangNhap, matKhau);
      if (role === 'Admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError("Tên đăng nhập hoặc mật khẩu không chính xác.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="logo-box">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSORrlt2auZR3ziF7XRwl9EpaOA-IKSny9JMw&s"
            alt="Logo"
          />
        </div>
        <h2>Chào mừng trở lại</h2>
        <p className="subtitle">Vui lòng đăng nhập để tiếp tục</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={tenDangNhap}
              onChange={(e) => setTenDangNhap(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
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

          <div className="form-options">
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button">Đăng Nhập</button>
        </form>

        <p className="register-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
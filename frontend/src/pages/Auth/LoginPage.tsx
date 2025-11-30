import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; 
import "../../LoginPage.css"; 

// ✨ IMPORT CÁC THÀNH PHẦN CẦN THIẾT CỦA FONT AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // faEye là mắt mở, faEyeSlash là mắt gạch chéo

const LoginPage: React.FC = () => {
  const [tenDangNhap, setTenDangNhap] = useState<string>("");
  const [matKhau, setMatKhau] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  // Thêm trạng thái để quản lý việc hiển thị/ẩn mật khẩu
  const [showPassword, setShowPassword] = useState<boolean>(false); 
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const role = await login(tenDangNhap, matKhau);

      if (role === "Admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (err: unknown) {
      const errorMessage =
        typeof err === "string" ? err : "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(errorMessage);
    }
  };

  // Hàm toggle trạng thái hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        
        {/* ✨ THAY ĐỔI CHO MẬT KHẨU VÀ ICON FONT AWESOME */}
        <div className="input-field password-input-container"> 
          <input
            // Dùng trạng thái showPassword để chuyển đổi type giữa 'text' và 'password'
            type={showPassword ? "text" : "password"} 
            placeholder="Mật khẩu"
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            required
          />
          <button
            type="button" // Quan trọng: type="button" để không submit form
            onClick={togglePasswordVisibility}
            className="password-toggle"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {/* Sử dụng FontAwesomeIcon */}
            {showPassword ? (
              <FontAwesomeIcon icon={faEyeSlash} /> // Biểu tượng mắt gạch chéo (Ẩn)
            ) : (
              <FontAwesomeIcon icon={faEye} />     // Biểu tượng mắt mở (Hiện)
            )}
          </button>
        </div>
        {/* KẾT THÚC THAY ĐỔI */}

        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button">
          Đăng Nhập
        </button>
      </form>
      <p className="register-link">
        Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
      </p>
    </div>
  );
};

export default LoginPage;
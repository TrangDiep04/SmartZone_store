import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Đã đổi tên thành .tsx

// Hook để dễ dàng truy cập vào các giá trị (isLoggedIn, userRole, login, logout)
const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export default useAuth;
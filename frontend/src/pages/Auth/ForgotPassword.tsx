import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../api/authService";
import { Container, Paper, TextField, Button, Typography, Box, Alert, InputAdornment } from "@mui/material";
import { Email, VpnKey, Lock } from "@mui/icons-material";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "success" as "success" | "error" });
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            await authService.sendOtpForgotPassword(email);
            setMessage({ text: "Mã OTP đã được gửi đến email của bạn.", type: "success" });
            setStep(2);
        } catch (err: any) {
            setMessage({ text: err.response?.data || "Email không tồn tại.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setLoading(true);
        try {
            await authService.resetPassword(email, otp, newPassword);
            alert("Đổi mật khẩu thành công!");
            navigate("/login");
        } catch (err: any) {
            setMessage({ text: err.response?.data || "Mã OTP không đúng hoặc đã hết hạn.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ bgcolor: "#f4f7fe", minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <Container maxWidth="xs">
                <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h5" align="center" fontWeight="700" color="#010438" gutterBottom>
                        {step === 1 ? "Quên mật khẩu?" : "Thiết lập lại"}
                    </Typography>

                    {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

                    {step === 1 ? (
                        <Box>
                            <TextField
                                fullWidth
                                label="Email của bạn"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Email /></InputAdornment>,
                                }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleSendOtp}
                                disabled={loading}
                                sx={{ mt: 3, py: 1.5, textTransform: 'none' }}
                            >
                                {loading ? "Đang gửi..." : "Gửi mã OTP"}
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <TextField
                                fullWidth
                                label="Mã xác thực OTP"
                                margin="normal"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><VpnKey /></InputAdornment>,
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Mật khẩu mới"
                                type="password"
                                margin="normal"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                                }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="success"
                                size="large"
                                onClick={handleResetPassword}
                                disabled={loading}
                                sx={{ mt: 3, py: 1.5, textTransform: 'none' }}
                            >
                                {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                            </Button>
                        </Box>
                    )}

                    <Box mt={3} textAlign="center">
                        <Link to="/login" style={{ textDecoration: "none", color: "#1976d2", fontWeight: 500 }}>
                            Quay lại đăng nhập
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ForgotPassword;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Alert,
  Divider,
  Breadcrumbs,
  Link,
  Stack
} from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import ReceiverForm from "./components/ReceiverForm";
import AddressForm from "./components/AddressForm";
import PaymentMethod from "./components/PaymentMethod";
import OrderSummary from "./components/OrderSummary";
import { useAddress } from "./hooks/useAddress";
import { payApi } from "../../../api/payApi";
import { cartApi } from "../../../api/cartApi";
import { useAuth } from "../../../context/AuthContext";

const Order: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  const {
    provinces, districts, wards,
    provinceCode, districtCode, wardCode,
    provinceName, districtName, wardName,
    handleProvinceChange, handleDistrictChange, handleWardChange,
  } = useAddress();

  const fontStyle = { fontFamily: "'Inter', sans-serif" };

  useEffect(() => {
    const checkoutDetail = JSON.parse(localStorage.getItem("checkoutDetail") || "[]");
    const checkoutIds = JSON.parse(localStorage.getItem("checkout") || "[]");

    if (checkoutIds.length > 0) {
      const loadSelected = async () => {
        try {
          const data = await cartApi.getCart(Number(userId));
          const filtered = data.filter((item: any) => checkoutIds.includes(item.maSanPham));
          const normalized = filtered.map((item: any) => ({
            maSanPham: item.maSanPham,
            tenSanPham: item.product?.name,
            gia: item.product?.price ?? 0,
            soLuong: item.soLuong,
            image: item.product?.image,
          }));
          setSelectedItems(normalized);
        } catch (err) { console.error("Lỗi load giỏ hàng:", err); }
      };
      loadSelected();
    } else if (checkoutDetail.length > 0) {
      setSelectedItems(checkoutDetail);
    }
  }, [userId]);

  const total = selectedItems.reduce((s, i) => s + i.gia * i.soLuong, 0);
  const shippingFee = 20000;
  const fullAddress = (wardName || districtName || provinceName)
    ? `${wardName ? wardName + ', ' : ''}${districtName ? districtName + ', ' : ''}${provinceName || ''}`
    : "Chưa cung cấp địa chỉ";

  const handleConfirm = async () => {
    setError("");
    if (!receiverName || !receiverPhone) return setError("Vui lòng nhập tên và số điện thoại người nhận");
    if (receiverPhone.length !== 10) return setError("Số điện thoại không hợp lệ");
    if (!provinceCode || !districtCode || !wardCode) return setError("Vui lòng chọn đầy đủ địa chỉ giao hàng");
    if (!paymentMethod) return setError("Vui lòng chọn phương thức thanh toán");

    try {
      const amount = total + shippingFee;
      if (["MOMO"].includes(paymentMethod)) {
        let data;
        if (paymentMethod === "MOMO") data = await payApi.momoPay(amount);
//         if (paymentMethod === "VNPAY") data = await payApi.vnpayPay(amount);
//         if (paymentMethod === "ZALOPAY") data = await payApi.zaloPay(amount);
        if (data?.payUrl) { window.location.href = data.payUrl; return; }
      }

      if (paymentMethod === "COD") {
        const orderData = {
          receiverName, receiverPhone, address: fullAddress,
          paymentMethod, shippingFee,
          items: selectedItems.map(item => ({ productId: item.maSanPham, soLuong: item.soLuong, price: item.gia })),
        };
        const response = await fetch("http://localhost:8080/api/orders", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error("Đặt hàng thất bại");
        await fetch(`http://localhost:8080/api/cart/${userId}/removeSelected`, {
          method: "DELETE", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedItems.map(item => item.maSanPham)),
        });
        localStorage.removeItem("checkout");
        localStorage.removeItem("checkoutDetail");
        alert("Đặt hàng thành công!");
        navigate("/orders");
      }
    } catch (err) { setError("Có lỗi xảy ra. Vui lòng thử lại."); }
  };

  return (
    <Box sx={{ bgcolor: '#f4f7f9', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>

        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2.5, ...fontStyle }}>
          <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.9rem' }}>Trang chủ</Link>
          <Typography color="text.primary" sx={{ fontWeight: 600, fontSize: '0.9rem', ...fontStyle }}>Thanh toán</Typography>
        </Breadcrumbs>

        <Grid container spacing={3} alignItems="flex-start">
          {/* CỘT TRÁI: GỘP KHỐI DUY NHẤT */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 4 }, // Padding vừa đủ, không quá rộng
                borderRadius: '20px',
                border: '1px solid #eef0f2',
                bgcolor: '#fff'
              }}
            >
              <h3 variant="h6" sx={{ fontWeight: 800, mb: 3.5, ...fontStyle, color: '#1a1c1e' }}>
                Thông tin đặt hàng
              </h3>

              {/* Phần 1: Thông tin người nhận */}
              <Box>
                <ReceiverForm
                  receiverName={receiverName}
                  receiverPhone={receiverPhone}
                  setReceiverName={setReceiverName}
                  setReceiverPhone={setReceiverPhone}
                />
              </Box>

              <Divider sx={{ my: 3, borderColor: '#f5f5f5' }} />

              {/* Phần 2: Địa chỉ giao hàng */}
              <Box>
                <AddressForm
                  provinces={provinces}
                  districts={districts}
                  wards={wards}
                  provinceCode={provinceCode}
                  districtCode={districtCode}
                  wardCode={wardCode}
                  handleProvinceChange={handleProvinceChange}
                  handleDistrictChange={handleDistrictChange}
                  handleWardChange={handleWardChange}
                />
              </Box>

              <Divider sx={{ my: 3, borderColor: '#f5f5f5' }} />

              {/* Phần 3: Phương thức thanh toán */}
              <Box>
                <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
              </Box>
            </Paper>
          </Grid>

          {/* CỘT PHẢI: TÓM TẮT (Sticky) */}
          <Grid item xs={12} md={5} sx={{ position: { md: 'sticky' }, top: 24 }}>
            <OrderSummary
              selectedItems={selectedItems}
              shippingFee={shippingFee}
              total={total}
              receiverName={receiverName}
              receiverPhone={receiverPhone}
              fullAddress={fullAddress}
              paymentMethod={paymentMethod}
              error={error}
              handleConfirm={handleConfirm}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Order;
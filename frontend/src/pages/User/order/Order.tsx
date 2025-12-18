import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReceiverForm from "./components/ReceiverForm";
import AddressForm from "./components/AddressForm";
import PaymentMethod from "./components/PaymentMethod";
import OrderSummary from "./components/OrderSummary";
import { useAddress } from "./hooks/useAddress";
import { payApi } from "../../../api/payApi";

const Order = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState("");

  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  const {
    provinces,
    districts,
    wards,
    provinceCode,
    districtCode,
    wardCode,
    provinceName,
    districtName,
    wardName,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
  } = useAddress();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const selectedIds = JSON.parse(localStorage.getItem("selectedIds") || "[]");
    setSelectedItems(cart.filter((i) => selectedIds.includes(i.id)));
  }, []);

  const total = selectedItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = 20000;
  const fullAddress = `${wardName}, ${districtName}, ${provinceName}`;

  const handleOrder = () => {
    if (!receiverName || !receiverPhone) return setError("Vui lòng nhập đầy đủ thông tin");
    if (!paymentMethod) return setError("Vui lòng chọn phương thức thanh toán");
    setShowSummary(true);
  };

  const handleConfirm = async () => {
    try {
      const amount = total + shippingFee;

      // ✅ Các phương thức ví điện tử
      if (paymentMethod === "MOMO") {
        const data = await payApi.momoPay(amount);
        window.location.href = data.payUrl;
        return;
      }

      if (paymentMethod === "VNPAY") {
        const data = await payApi.vnpayPay(amount);
        window.location.href = data.payUrl;
        return;
      }

      if (paymentMethod === "ZALOPAY") {
        const data = await payApi.zaloPay(amount);
        window.location.href = data.payUrl;
        return;
      }

      // ✅ Các phương thức không cần redirect (COD, BANK_TRANSFER)
      if (paymentMethod === "COD" || paymentMethod === "BANK_TRANSFER") {
        const orderData = {
          receiverName,
          receiverPhone,
          address: fullAddress,
          paymentMethod,
          shippingFee,
          items: selectedItems.map((item) => ({
            productId: item.maSanPham || item.id,
            quantity: item.quantity,
            price: item.price
          })),
        };

        const response = await fetch("http://localhost:8080/api/orders", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Order failed");

        alert("Đặt hàng thành công!");
        navigate("/orders");
        return;
      }


      // ✅ Nếu không khớp phương thức nào
      alert("Phương thức thanh toán không hợp lệ.");
    } catch (error) {
      console.error("Lỗi xác nhận đơn hàng:", error);
      alert("Thanh toán thất bại hoặc lỗi hệ thống.");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      {!showSummary ? (
        <>
          <ReceiverForm
            receiverName={receiverName}
            receiverPhone={receiverPhone}
            setReceiverName={setReceiverName}
            setReceiverPhone={setReceiverPhone}
          />

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

          <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button onClick={handleOrder}>Đặt hàng</button>
        </>
      ) : (
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
      )}
    </div>
  );
};

export default Order;
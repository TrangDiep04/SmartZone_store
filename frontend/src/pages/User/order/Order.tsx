import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    const checkoutDetail = JSON.parse(localStorage.getItem("checkoutDetail") || "[]");
    const checkoutIds = JSON.parse(localStorage.getItem("checkout") || "[]");

    if (checkoutIds.length > 0) {
      // Nếu có nhiều sản phẩm được chọn từ giỏ hàng
      const loadSelected = async () => {
        try {
          const data = await cartApi.getCart(Number(userId));
          const filtered = data.filter((item: any) =>
            checkoutIds.includes(item.maSanPham)
          );
          const normalized = filtered.map((item: any) => ({
            maSanPham: item.maSanPham,
            tenSanPham: item.product?.name,
            gia: item.product?.price ?? 0,
            soLuong: item.soLuong,
            image: item.product?.image,
            description: item.product?.description,
          }));
          setSelectedItems(normalized);
        } catch (err) {
          console.error("Lỗi khi load giỏ hàng:", err);
        }
      };
      loadSelected();
    } else if (checkoutDetail.length > 0) {
      // Nếu chỉ có 1 sản phẩm từ "Mua ngay"
      setSelectedItems(checkoutDetail);
    }
  }, [userId]);

  const total = selectedItems.reduce((s, i) => s + i.gia * i.soLuong, 0);
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

      if (paymentMethod === "COD") {
        const orderData = {
          receiverName,
          receiverPhone,
          address: fullAddress,
          paymentMethod,
          shippingFee,
          items: selectedItems.map(item => ({
            productId: item.maSanPham,
            soLuong: item.soLuong,
            price: item.gia,
          })),
        };

        const response = await fetch("http://localhost:8080/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) throw new Error("Order failed");

        // ✅ Gọi API xoá sản phẩm khỏi giỏ
        await fetch(`http://localhost:8080/api/cart/${userId}/removeSelected`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedItems.map(item => item.maSanPham)),
        });

        // ✅ Xoá dữ liệu localStorage
        localStorage.removeItem("checkout");
        localStorage.removeItem("checkoutDetail");

        setSelectedItems([]);

        alert("Đặt hàng thành công!");
        navigate("/orders");
        return;
      }

      alert("Phương thức thanh toán không hợp lệ.");
    } catch (error) {
      console.error("Lỗi xác nhận đơn hàng:", error);
      setError("Thanh toán thất bại hoặc lỗi hệ thống.");
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
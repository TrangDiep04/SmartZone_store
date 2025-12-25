
const OrderSummary = ({
  selectedItems,
  shippingFee,
  total,
  receiverName,
  receiverPhone,
  fullAddress,
  paymentMethod,
  error,
  handleConfirm,
}) => {
  const paymentText =
    paymentMethod === "COD"
      ? "Thanh toán khi nhận hàng"
      : paymentMethod === "MOMO"
      ? "Ví MOMO"
      : paymentMethod === "VNPAY"
      ? "Ví VNPAY"
      : paymentMethod === "ZALOPAY"
      ? "Ví ZaloPay"
      : paymentMethod;

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>Tóm tắt đơn hàng</h3>

{/* Danh sách sản phẩm */}
      {selectedItems.length > 0 ? (
        selectedItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span>
              <strong>{item.tenSanPham || `Sản phẩm ${item.maSanPham}`}</strong> x{" "}
              {item.soLuong}
            </span>
            <span>{(item.gia * item.soLuong).toLocaleString()} đ</span>
          </div>
        ))
      ) : (
        <p style={{ color: "gray" }}>Không có sản phẩm nào được chọn.</p>
      )}


      {/* Phí vận chuyển */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <span>Phí vận chuyển</span>
        <span>{shippingFee.toLocaleString()} đ</span>
      </div>

      {/* Tổng cộng */}
      <h3 style={{ marginTop: "15px" }}>
        Tổng cộng:{" "}
        <span style={{ color: "red" }}>
          {(total + shippingFee).toLocaleString()} đ
        </span>
      </h3>

      {/* Thông tin người nhận */}
      <div style={{ marginTop: "15px" }}>
        <p><strong>Người nhận:</strong> {receiverName}</p>
        <p><strong>Số điện thoại:</strong> {receiverPhone}</p>
        <p><strong>Địa chỉ:</strong> {fullAddress}</p>
        <p><strong>Phương thức thanh toán:</strong> {paymentText}</p>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Nút xác nhận */}
      <button
        onClick={handleConfirm}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Xác nhận đặt hàng
      </button>
    </div>
  );
};

export default OrderSummary;
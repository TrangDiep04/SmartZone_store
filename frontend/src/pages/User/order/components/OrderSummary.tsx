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
}) => (
  <div>
    <h3>Tóm tắt đơn hàng</h3>

    {selectedItems.map((item) => (
      <div key={item.id} style={{ display: "flex", justifyContent: "space-between" }}>
        <span>
          {item.name} x {item.quantity}
        </span>
        <span>{(item.price * item.quantity).toLocaleString()}đ</span>
      </div>
    ))}

    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>Phí vận chuyển</span>
      <span>{shippingFee.toLocaleString()}đ</span>
    </div>

    <h3>
      Tổng cộng: <span style={{ color: "red" }}>{(total + shippingFee).toLocaleString()}đ</span>
    </h3>

    <p><strong>Người nhận:</strong> {receiverName}</p>
    <p><strong>Số điện thoại:</strong> {receiverPhone}</p>
    <p><strong>Địa chỉ:</strong> {fullAddress}</p>

    {error && <p style={{ color: "red" }}>{error}</p>}

    <button onClick={handleConfirm}>Xác nhận đặt hàng</button>
  </div>
);

export default OrderSummary;
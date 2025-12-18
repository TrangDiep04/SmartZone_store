const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => (
  <div style={{ marginBottom: "20px" }}>
    <label>Phương thức thanh toán:</label>
    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
      <option value="">-- Chọn phương thức --</option>
      <option value="COD">Thanh toán khi nhận hàng</option>
      <option value="MOMO">MOMO</option>
      <option value="VNPAY">VNPAY</option>
      <option value="ZALOPAY">ZaloPay</option>
      <option value="BANK_TRANSFER">Chuyển khoản</option>
    </select>
  </div>
);

export default PaymentMethod;
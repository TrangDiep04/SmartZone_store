const ReceiverForm = ({ receiverName, receiverPhone, setReceiverName, setReceiverPhone }) => (
  <div style={{ marginBottom: "20px" }}>
    <label>Người nhận:</label>
    <input
      type="text"
      value={receiverName}
      onChange={(e) => setReceiverName(e.target.value)}
      placeholder="Nhập tên người nhận"
    />

    <label style={{ marginTop: "10px", display: "block" }}>Số điện thoại:</label>
    <input
      type="text"
      value={receiverPhone}
      onChange={(e) => setReceiverPhone(e.target.value)}
      placeholder="Nhập số điện thoại"
    />
  </div>
);

export default ReceiverForm;
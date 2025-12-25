const ReceiverForm = ({ receiverName, receiverPhone, setReceiverName, setReceiverPhone }) => {
  const handlePhoneChange = (e) => {
    const value = e.target.value;

    // Chỉ cho phép nhập số
    if (/^\d*$/.test(value)) {
      setReceiverPhone(value);
    }
  };

  return (
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
        onChange={handlePhoneChange}
        placeholder="Nhập số điện thoại"
        maxLength={10} // giới hạn tối đa 10 ký tự
      />

      {/* Hiển thị cảnh báo nếu không đủ 10 số */}
      {receiverPhone && receiverPhone.length !== 10 && (
        <p style={{ color: "red", fontSize: "0.9rem" }}>
          Số điện thoại phải gồm đúng 10 chữ số
        </p>
      )}
    </div>
  );
};

export default ReceiverForm;
const AddressForm = ({
  provinces,
  districts,
  wards,
  provinceCode,
  districtCode,
  wardCode,
  handleProvinceChange,
  handleDistrictChange,
  handleWardChange,
}) => (
  <div style={{ marginBottom: "20px" }}>
    <label>Địa chỉ giao hàng:</label>

    <select value={provinceCode} onChange={(e) => handleProvinceChange(e.target.value)}>
      <option value="">-- Chọn tỉnh/thành phố --</option>
      {provinces.map((p) => (
        <option key={p.code} value={p.code}>
          {p.name}
        </option>
      ))}
    </select>

    <select
      value={districtCode}
      onChange={(e) => handleDistrictChange(e.target.value)}
      disabled={!provinceCode}
    >
      <option value="">-- Chọn quận/huyện --</option>
      {districts.map((d) => (
        <option key={d.code} value={d.code}>
          {d.name}
        </option>
      ))}
    </select>

    <select
      value={wardCode}
      onChange={(e) => handleWardChange(e.target.value)}
      disabled={!districtCode}
    >
      <option value="">-- Chọn xã/phường --</option>
      {wards.map((w) => (
        <option key={w.code} value={w.code}>
          {w.name}
        </option>
      ))}
    </select>
  </div>
);

export default AddressForm;
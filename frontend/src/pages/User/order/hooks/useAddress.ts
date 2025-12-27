import { useEffect, useState } from "react";

// --- DỮ LIỆU THỰC TẾ (DATA) ---
const PROVINCES_DATA = [
  { code: "01", name: "Thành phố Hà Nội" },
  { code: "79", name: "Thành phố Hồ Chí Minh" },
  { code: "48", name: "Thành phố Đà Nẵng" },
  { code: "31", name: "Thành phố Hải Phòng" },
  { code: "92", name: "Thành phố Cần Thơ" },
  { code: "75", name: "Tỉnh Đồng Nai" },
  { code: "74", name: "Tỉnh Bình Dương" },
  { code: "68", name: "Tỉnh Lâm Đồng" },
  { code: "40", name: "Tỉnh Nghệ An" },
  { code: "30", name: "Tỉnh Hải Dương" },
];

const DISTRICTS_DATA: Record<string, { code: string; name: string }[]> = {
  "01": [
    { code: "001", name: "Quận Ba Đình" }, { code: "002", name: "Quận Hoàn Kiếm" },
    { code: "003", name: "Quận Tây Hồ" }, { code: "004", name: "Quận Long Biên" }, { code: "005", name: "Quận Cầu Giấy" }
  ],
  "79": [
    { code: "760", name: "Quận 1" }, { code: "764", name: "Quận Gò Vấp" },
    { code: "765", name: "Quận Bình Thạnh" }, { code: "766", name: "Quận Tân Bình" }, { code: "769", name: "Quận 2" }
  ],
  "48": [
    { code: "490", name: "Quận Liên Chiểu" }, { code: "491", name: "Quận Thanh Khê" },
    { code: "492", name: "Quận Hải Châu" }, { code: "493", name: "Quận Sơn Trà" }, { code: "494", name: "Quận Ngũ Hành Sơn" }
  ],
  "31": [
    { code: "303", name: "Quận Hồng Bàng" }, { code: "304", name: "Quận Ngô Quyền" },
    { code: "305", name: "Quận Lê Chân" }, { code: "306", name: "Quận Hải An" }, { code: "307", name: "Quận Kiến An" }
  ],
  "92": [
    { code: "916", name: "Quận Ninh Kiều" }, { code: "917", name: "Quận Bình Thủy" },
    { code: "918", name: "Quận Cái Răng" }, { code: "919", name: "Quận Thốt Nốt" }, { code: "923", name: "Huyện Phong Điền" }
  ],
  "75": [
    { code: "731", name: "TP. Biên Hòa" }, { code: "732", name: "TP. Long Khánh" },
    { code: "734", name: "Huyện Vĩnh Cửu" }, { code: "735", name: "Huyện Nhơn Trạch" }, { code: "736", name: "Huyện Thống Nhất" }
  ],
  "74": [
    { code: "718", name: "TP. Thủ Dầu Một" }, { code: "719", name: "Huyện Bàu Bàng" },
    { code: "720", name: "Huyện Dầu Tiếng" }, { code: "721", name: "Thị xã Bến Cát" }, { code: "722", name: "TP. Tân Uyên" }
  ],
  "68": [
    { code: "672", name: "TP. Đà Lạt" }, { code: "673", name: "TP. Bảo Lộc" },
    { code: "674", name: "Huyện Đam Rông" }, { code: "675", name: "Huyện Lạc Dương" }, { code: "676", name: "Huyện Lâm Hà" }
  ],
  "40": [
    { code: "431", name: "TP. Vinh" }, { code: "432", name: "Thị xã Cửa Lò" },
    { code: "433", name: "Thị xã Thái Hòa" }, { code: "434", name: "Huyện Quế Phong" }, { code: "435", name: "Huyện Quỳ Châu" }
  ],
  "30": [
    { code: "288", name: "TP. Hải Dương" }, { code: "290", name: "Thị xã Chí Linh" },
    { code: "291", name: "Huyện Nam Sách" }, { code: "292", name: "Huyện Kim Thành" }, { code: "293", name: "Huyện Thanh Hà" }
  ]
};

// Tự động tạo 8 xã cho mỗi huyện để file gọn nhẹ
const generateWardsMap = () => {
  const map: Record<string, { code: string; name: string }[]> = {};
  Object.values(DISTRICTS_DATA).flat().forEach((d) => {
    map[d.code] = Array.from({ length: 8 }).map((_, i) => ({
      code: `${d.code}${i + 1}`,
      name: i % 2 === 0 ? `Phường số ${i + 1}` : `Xã số ${i + 1}`,
    }));
  });
  return map;
};
const WARDS_DATA = generateWardsMap();

// --- CUSTOM HOOK ---
export const useAddress = () => {
  const [provinces] = useState(PROVINCES_DATA);
  const [districts, setDistricts] = useState<{ code: string; name: string }[]>([]);
  const [wards, setWards] = useState<{ code: string; name: string }[]>([]);

  const [provinceCode, setProvinceCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");

  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  const handleProvinceChange = (code: string) => {
    setProvinceCode(code);
    const selected = PROVINCES_DATA.find((p) => p.code === code);
    setProvinceName(selected?.name || "");

    const filteredDistricts = DISTRICTS_DATA[code] || [];
    setDistricts(filteredDistricts);

    // Reset cấp con
    setDistrictCode("");
    setDistrictName("");
    setWardCode("");
    setWardName("");
    setWards([]);
  };

  const handleDistrictChange = (code: string) => {
    setDistrictCode(code);
    const selected = districts.find((d) => d.code === code);
    setDistrictName(selected?.name || "");

    const filteredWards = WARDS_DATA[code] || [];
    setWards(filteredWards);

    // Reset cấp con
    setWardCode("");
    setWardName("");
  };

  const handleWardChange = (code: string) => {
    setWardCode(code);
    const selected = wards.find((w) => w.code === code);
    setWardName(selected?.name || "");
  };

  return {
    provinces, districts, wards,
    provinceCode, districtCode, wardCode,
    provinceName, districtName, wardName,
    handleProvinceChange, handleDistrictChange, handleWardChange,
  };
};
import { useEffect, useState } from "react";

export const useAddress = () => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [provinceCode, setProvinceCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");

  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  useEffect(() => {
    fetch("https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1")
      .then((res) => res.json())
      .then((data) => setProvinces(data?.data?.data || []));
  }, []);

  const handleProvinceChange = async (code: string) => {
    setProvinceCode(code);
    const selected = provinces.find((p) => p.code === code);
    setProvinceName(selected?.name || "");

    const res = await fetch(
      `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${code}`
    );
    const data = await res.json();
    setDistricts(data?.data?.data || []);
    setDistrictCode("");
    setWards([]);
  };

  const handleDistrictChange = async (code: string) => {
    setDistrictCode(code);
    const selected = districts.find((d) => d.code === code);
    setDistrictName(selected?.name || "");

    const res = await fetch(
      `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${code}`
    );
    const data = await res.json();
    setWards(data?.data?.data || []);
    setWardCode("");
  };

  const handleWardChange = (code: string) => {
    setWardCode(code);
    const selected = wards.find((w) => w.code === code);
    setWardName(selected?.name || "");
  };

  return {
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
  };
};
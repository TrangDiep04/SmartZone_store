import React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
// Tách riêng import type để tránh lỗi Vite
import type { SelectChangeEvent } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface AddressFormProps {
  provinces: any[];
  districts: any[];
  wards: any[];
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  handleProvinceChange: (code: string) => void;
  handleDistrictChange: (code: string) => void;
  handleWardChange: (code: string) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  provinces,
  districts,
  wards,
  provinceCode,
  districtCode,
  wardCode,
  handleProvinceChange,
  handleDistrictChange,
  handleWardChange,
}) => {
  const fontStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.85rem"
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <LocationOnIcon sx={{ color: '#1976d2', fontSize: 22}} />
        <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', ...fontStyle, color: '#1a1c1e' }}>
          Địa chỉ giao hàng
        </Typography>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
        {/* TỈNH / THÀNH PHỐ */}
        <FormControl fullWidth>
          <InputLabel id="p-label" sx={{ ...fontStyle, bgcolor: '#fff', px: 0.5 }}>Tỉnh / Thành phố</InputLabel>
          <Select
            labelId="p-label"
            value={provinceCode || ""}
            onChange={(e: SelectChangeEvent) => handleProvinceChange(e.target.value as string)}
            sx={{ borderRadius: '10px', height: '50px', ...fontStyle }}
          >
            <MenuItem value=""><em>Chọn Tỉnh/Thành</em></MenuItem>
            {provinces?.map((p) => (
              <MenuItem key={p.code} value={p.code} sx={fontStyle}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* QUẬN / HUYỆN */}
        <FormControl fullWidth disabled={!provinceCode}>
          <InputLabel id="d-label" sx={{ ...fontStyle, bgcolor: '#fff', px: 0.5 }}>Quận / Huyện</InputLabel>
          <Select
            labelId="d-label"
            value={districtCode || ""}
            onChange={(e: SelectChangeEvent) => handleDistrictChange(e.target.value as string)}
            sx={{ borderRadius: '10px', height: '50px', ...fontStyle }}
          >
            <MenuItem value=""><em>Chọn Quận/Huyện</em></MenuItem>
            {districts?.map((d) => (
              <MenuItem key={d.code} value={d.code} sx={fontStyle}>{d.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* XÃ / PHƯỜNG */}
        <FormControl fullWidth disabled={!districtCode}>
          <InputLabel id="w-label" sx={{ ...fontStyle, bgcolor: '#fff', px: 0.5 }}>Xã / Phường</InputLabel>
          <Select
            labelId="w-label"
            value={wardCode || ""}
            onChange={(e: SelectChangeEvent) => handleWardChange(e.target.value as string)}
            sx={{ borderRadius: '10px', height: '50px', ...fontStyle }}
          >
            <MenuItem value=""><em>Chọn Xã/Phường</em></MenuItem>
            {wards?.map((w) => (
              <MenuItem key={w.code} value={w.code} sx={fontStyle}>{w.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default AddressForm;
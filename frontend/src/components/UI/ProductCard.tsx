import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type AnyProduct = Record<string, any> | undefined;

// ⭐ BƯỚC 1: TẠO MAPPING (RESOLVE) TẤT CẢ CÁC ẢNH CỤC BỘ TỪ CÁC FOLDER
const allImageModules = import.meta.glob<string>(
  [
    "../../images/Iphone/*",
    "../../images/ANDROID FLAGSHIP/*",
    "../../images/ANDROID TẦM TRUNG/*",
    "../../images/MÁY CŨĐÃ QUA SỬ DỤNG/*",
  ],
  { eager: true, as: "url" }
);

const ProductCard: React.FC<{ product?: AnyProduct }> = ({ product }) => {
  const navigate = useNavigate();

  if (!product) {
    return (
      <Card sx={{ width: 250 }}>
        <CardContent>
          <Typography variant="h6">Không có thông tin sản phẩm</Typography>
        </CardContent>
      </Card>
    );
  }

  const name = product.name ?? product.tenSanPham ?? "Không có tên";
  const brand = product.brand ?? product.thuongHieu ?? "";
  const rawImage =
    product.image ?? product.hinhAnh ?? product.hinhAnhFileName ?? "";

  let image = "";
  try {
    if (rawImage && typeof rawImage === "string") {
      const trimmed = rawImage.trim();
      if (/^https?:\/\//i.test(trimmed)) {
        image = trimmed;
      } else {
        const filenameToFind = trimmed.toLowerCase();
        for (const path in allImageModules) {
          const modulePath = path.toLowerCase();
          if (modulePath.endsWith(`/${filenameToFind}`)) {
            image = allImageModules[path];
            break;
          }
        }
        if (!image && trimmed.includes("/")) {
          try {
            image = new URL(`../../${trimmed}`, import.meta.url).href;
          } catch (e) {
            image = trimmed;
          }
        }
      }
    }
  } catch (err) {
    console.error("Image resolution error:", err);
    image = "";
  }

  const rawPrice = product.price ?? product.gia ?? 0;
  const priceNumber =
    typeof rawPrice === "number" ? rawPrice : Number(rawPrice) || 0;

  return (
    <Card
      sx={{ width: 250, cursor: "pointer" }}
      onClick={() => navigate(`/products/${product.id}`)} // ⭐ Điều hướng tới trang chi tiết
    >
      {image ? (
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={name}
          sx={{ objectFit: "contain", background: "#fff" }}
        />
      ) : (
        <div
          style={{
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
          }}
        >
          <span style={{ color: "#999" }}>No image</span>
        </div>
      )}
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        {brand && <Typography color="text.secondary">{brand}</Typography>}
        <Typography color="primary">{priceNumber.toLocaleString()} VND</Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
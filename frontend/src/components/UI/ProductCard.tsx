import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

type AnyProduct = Record<string, any> | undefined;

// ⭐ BƯỚC 1: TẠO MAPPING (RESOLVE) TẤT CẢ CÁC ẢNH CỤC BỘ TỪ CÁC FOLDER
// Sử dụng Vite/Webpack Glob Import để nạp tất cả các đường dẫn ảnh
// { eager: true, as: 'url' } đảm bảo chúng ta có được đường dẫn URL tuyệt đối ngay lập tức.
const allImageModules = import.meta.glob<string>([
  '../../images/Iphone/*',
  '../../images/ANDROID FLAGSHIP/*',
  '../../images/ANDROID TẦM TRUNG/*',
  '../../images/MÁY CŨĐÃ QUA SỬ DỤNG/*',
], { eager: true, as: 'url' });


const ProductCard: React.FC<{ product?: AnyProduct }> = ({ product }) => {
    if (!product) {
        return (
            <Card sx={{ width: 250 }}>
                <CardContent>
                    <Typography variant="h6">Không có thông tin sản phẩm</Typography>
                </CardContent>
            </Card>
        );
    }

    const name = product.name ?? product.tenSanPham ?? 'Không có tên';
    const brand = product.brand ?? product.thuongHieu ?? '';
    const rawImage = product.image ?? product.hinhAnh ?? product.hinhAnhFileName ?? '';

    // ⭐ BƯỚC 2: LOGIC TÌM KIẾM TRỰC TIẾP TRONG MAPPING
    let image = '';
    
    try {
        if (rawImage && typeof rawImage === 'string') {
            const trimmed = rawImage.trim();

            // 1. Kiểm tra URL (ngoại tuyến)
            if (/^https?:\/\//i.test(trimmed)) {
                image = trimmed;
            } 
            
            // 2. Tìm kiếm trong Mapping đã tạo (Đây là phần quan trọng)
            else {
                const filenameToFind = trimmed.toLowerCase(); 
                
                // Lặp qua keys (đường dẫn tương đối) trong mapping
                for (const path in allImageModules) {
                    const modulePath = path.toLowerCase();
                    
                    // Kiểm tra xem đường dẫn có chứa tên file cần tìm hay không
                    // Ví dụ: path.includes('ten_file.png')
                    if (modulePath.endsWith(`/${filenameToFind}`)) {
                        // Gán đường dẫn đã resolve (URL tuyệt đối) từ module
                        image = allImageModules[path];
                        break; // ✅ Thoát ngay lập tức khi tìm thấy
                    }
                }
                
                // FALLBACK: Nếu vẫn không tìm thấy qua glob, thử resolve theo đường dẫn tương đối
                if (!image && trimmed.includes('/')) {
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
        image = '';
    }
    
    // ... (Giữ nguyên logic giá và render) ...
    const rawPrice = product.price ?? product.gia ?? 0;
    const priceNumber = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice) || 0;

    return (
        <Card sx={{ width: 250 }}>
            {image ? (
                <CardMedia
                    component="img"
                    height="140"
                    image={image}
                    alt={name}
                    sx={{ objectFit: 'contain', background: '#fff' }}
                />
            ) : (
                <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                    <span style={{ color: '#999' }}>No image</span>
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
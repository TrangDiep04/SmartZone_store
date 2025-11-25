-- 1. Xóa và Tạo lại Database
DROP DATABASE IF EXISTS smartzone_store;
CREATE DATABASE smartzone_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartzone_store;

-- 2. Bảng CATEGORIES (Danh mục)
CREATE TABLE CATEGORIES (
    maDanhMuc INT AUTO_INCREMENT PRIMARY KEY, -- Khóa chính (INT), dùng để liên kết
    tenDanhMuc VARCHAR(100) NOT NULL,
    moTaDanhMuc TEXT
);

-- 3. Bảng USERS (Khách hàng)
CREATE TABLE USERS (
    maKhachHang INT AUTO_INCREMENT PRIMARY KEY, -- Khóa chính (INT), dùng để liên kết
    tenDangNhap VARCHAR(50) NOT NULL UNIQUE,
    matkhau VARCHAR(255) NOT NULL,
    hoTen VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    soDienThoai VARCHAR(15),
    diaChi TEXT,
    gioiTinh ENUM('Nam', 'Nu'),
    phanQuyen ENUM('Admin', 'User') DEFAULT 'User'
);

-- 4. Bảng PRODUCTS (Sản phẩm)
CREATE TABLE PRODUCTS (
    maSanPham INT AUTO_INCREMENT PRIMARY KEY, -- Khóa chính (INT), dùng để liên kết
    tenSanPham VARCHAR(255) NOT NULL,
    thuongHieu VARCHAR(50),
    hinhAnh VARCHAR(255),
    namSanXuat YEAR,
    gia DECIMAL(15, 0) NOT NULL,
    moTa TEXT,
    mauSac VARCHAR(50),
    trangThai ENUM('ConHang', 'HetHang', 'NgungKinhDoanh') DEFAULT 'ConHang',
    ngayRaMat DATE,
    soLuongTon INT DEFAULT 0,
    
    maDanhMuc INT, -- Khóa ngoại trỏ về CATEGORIES(maDanhMuc)
    CONSTRAINT fk_product_category FOREIGN KEY (maDanhMuc) REFERENCES CATEGORIES(maDanhMuc) ON DELETE SET NULL
);

-- 5. Bảng CARTS (Giỏ hàng)
CREATE TABLE CARTS (
    maGioHang INT AUTO_INCREMENT PRIMARY KEY, -- Khóa chính (INT), dùng để liên kết
    maKhachHang INT NOT NULL, -- Liên kết với USERS(maKhachHang)
    ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user FOREIGN KEY (maKhachHang) REFERENCES USERS(maKhachHang) ON DELETE CASCADE
);

-- 6. Bảng ORDERS (Đơn hàng)
CREATE TABLE ORDERS (
    maDonHang INT AUTO_INCREMENT PRIMARY KEY, -- Khóa chính (INT), dùng để liên kết
    maKhachHang INT NOT NULL, -- Liên kết với USERS(maKhachHang)
    ngayDat DATETIME DEFAULT CURRENT_TIMESTAMP,
    diaChiGiaoHang TEXT NOT NULL,
    phuongThucThanhToan VARCHAR(50),
    trangThaiDonHang ENUM('ChoXacNhan', 'DangGiao', 'DaGiao', 'Huy') DEFAULT 'ChoXacNhan',
    tongTien DECIMAL(15, 0) DEFAULT 0,
    CONSTRAINT fk_order_user FOREIGN KEY (maKhachHang) REFERENCES USERS(maKhachHang) ON DELETE CASCADE
);

-- 7. Bảng CART_ITEMS (Chi tiết giỏ hàng)
CREATE TABLE CART_ITEMS (
    maGioHang INT,
    maSanPham INT,
    soLuong INT DEFAULT 1 CHECK (soLuong > 0),
    ngayThem DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (maGioHang, maSanPham),
    CONSTRAINT fk_cartitem_cart FOREIGN KEY (maGioHang) REFERENCES CARTS(maGioHang) ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_product FOREIGN KEY (maSanPham) REFERENCES PRODUCTS(maSanPham) ON DELETE CASCADE
);

-- 8. Bảng ORDER_ITEMS (Chi tiết đơn hàng)
CREATE TABLE ORDER_ITEMS (
    maDonHang INT,
    maSanPham INT,
    soLuong INT DEFAULT 1,
    gia DECIMAL(15, 0) NOT NULL,
    PRIMARY KEY (maDonHang, maSanPham),
    CONSTRAINT fk_orderitem_order FOREIGN KEY (maDonHang) REFERENCES ORDERS(maDonHang) ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_product FOREIGN KEY (maSanPham) REFERENCES PRODUCTS(maSanPham) ON DELETE NO ACTION
);

-- Thêm dữ liệu vào bảng--
DELETE FROM CATEGORIES;
INSERT INTO CATEGORIES (tenDanhMuc, moTaDanhMuc) VALUES 
('iPhone (iOS)', 'Các dòng điện thoại Apple chạy iOS mới nhất và các thế hệ trước'), -- maDanhMuc 1
('Android Cao Cấp (Flagship)', 'Smartphone đầu bảng của Samsung, Xiaomi, và các hãng khác'), -- maDanhMuc 2
('Android Tầm Trung', 'Các mẫu điện thoại phổ thông, hiệu năng tốt, giá dưới 15 triệu VND'), -- maDanhMuc 3
('Máy cũ/Đã qua sử dụng', 'Các sản phẩm điện thoại đã qua sử dụng, chất lượng 99%'); -- maDanhMuc 4 (ID MỚI: 4)


DELETE FROM USERS;
INSERT INTO USERS (tenDangNhap, matkhau, hoTen, email, soDienThoai, diaChi, gioiTinh, phanQuyen) VALUES 
('admin_zone', 'hashed_pass_admin', 'Trần Hoài Nam', 'nam.tran@smartzone.com', '0901234567', '45 Nguyễn Chí Thanh, Hà Nội', 'Nam', 'Admin'),
('minhtuan', 'pass123', 'Phạm Minh Tuấn', 'tuan.pham@gmail.com', '0912345678', '123 Lê Lợi, Quận 1, TP.HCM', 'Nam', 'User'),
('lehuong', 'pass123', 'Lê Thị Hương', 'huong.le@gmail.com', '0987654321', '89 Trần Phú, Hải Phòng', 'Nu', 'User'),
('thanhbinh', 'pass123', 'Nguyễn Thanh Bình', 'binh.nguyen@outlook.com', '0333444555', 'Khu đô thị Sala, TP. Thủ Đức', 'Nam', 'User'),
('maimai', 'pass123', 'Vũ Thị Mai', 'mai.vu@gmail.com', '0777888999', '201 CMT8, Quận 3, TP.HCM', 'Nu', 'User'),
('duongtran', 'pass123', 'Trần Hải Dương', 'duong.tran@yahoo.com', '0966555444', 'Ngõ 300, Đội Cấn, Hà Nội', 'Nam', 'User'),
('thungan', 'pass123', 'Nguyễn Thu Ngân', 'ngan.nguyen@gmail.com', '0888777666', 'Chung cư Sunrise City, Quận 7', 'Nu', 'User'),
('hoangphu', 'pass123', 'Phú Hữu Hoàng', 'hoang.phu@hotmail.com', '0944333222', '1A Lý Thường Kiệt, Đà Nẵng', 'Nam', 'User'),
('linhpham', 'pass123', 'Phạm Bảo Linh', 'linh.pham@gmail.com', '0933222111', '10 Phan Chu Trinh, Hội An', 'Nu', 'User'),
('manhdo', 'pass123', 'Đỗ Thành Mạnh', 'manh.do@vietel.vn', '0977666555', '45 Hùng Vương, Huế', 'Nam', 'User'),
('vietanh', 'pass123', 'Lê Việt Anh', 'anh.le@gmail.com', '0898765432', '110 Giải Phóng, Hà Nội', 'Nam', 'User'),
('thuha', 'pass123', 'Đào Thu Hà', 'ha.dao@gmail.com', '0919876543', '200 Bà Triệu, Hà Nội', 'Nu', 'User'),
('quanghuy', 'pass123', 'Trần Quang Huy', 'huy.tran@gmail.com', '0929765432', '35 Cộng Hòa, TP.HCM', 'Nam', 'User'),
('tienle', 'pass123', 'Lê Văn Tiến', 'tien.le@gmail.com', '0939654321', '40 Hoàng Diệu, Đà Nẵng', 'Nam', 'User'),
('huyennguyen', 'pass123', 'Nguyễn Thị Huyền', 'huyen.nguyen@gmail.com', '0949543210', '50 Nguyễn Văn Cừ, Cần Thơ', 'Nu', 'User');
-- maKhachHang: 1 đến 15

DELETE FROM PRODUCTS;
INSERT INTO PRODUCTS (tenSanPham, thuongHieu, hinhAnh, namSanXuat, gia, moTa, mauSac, soLuongTon, trangThai, maDanhMuc) VALUES 
-- IPHONE (ID 1) - 13 products
('iPhone 15 Pro Max 512GB', 'Apple', 'ip15pm_512.jpg', 2023, 33990000, 'Chip A17 Pro, Khung Titanium, 5x Optical Zoom', 'Titan Tự Nhiên', 30, 'ConHang', 1), -- 1
('iPhone 15 Pro 256GB', 'Apple', 'ip15p_256.jpg', 2023, 27990000, 'Chip A17 Pro, Thiết kế nhỏ gọn hơn', 'Đen Titan', 45, 'ConHang', 1), -- 2
('iPhone 15 Plus 128GB', 'Apple', 'ip15p_128.jpg', 2023, 21990000, 'Dynamic Island, Pin lớn', 'Xanh Lá', 60, 'ConHang', 1), -- 3
('iPhone 15 128GB', 'Apple', 'ip15_128.jpg', 2023, 18990000, 'Chip A16 Bionic, Camera 48MP', 'Hồng Pastel', 80, 'ConHang', 1), -- 4
('iPhone 14 Pro Max 256GB', 'Apple', 'ip14pm_256.jpg', 2022, 25500000, 'Chip A16, Bán chạy nhất', 'Vàng Gold', 30, 'ConHang', 1), -- 5
('iPhone 14 128GB', 'Apple', 'ip14_128.jpg', 2022, 16500000, 'Hiệu năng ổn định', 'Xanh Dương', 50, 'ConHang', 1), -- 6
('iPhone 13 128GB', 'Apple', 'ip13_128.jpg', 2021, 13990000, 'Thiết kế đẹp, bền bỉ', 'Trắng', 70, 'ConHang', 1), -- 7
('iPhone 13 mini 64GB', 'Apple', 'ip13m_64.jpg', 2021, 11990000, 'Phiên bản nhỏ gọn', 'Đỏ', 15, 'ConHang', 1), -- 8
('iPhone 12 Pro Max 128GB', 'Apple', 'ip12pm_128.jpg', 2020, 15990000, 'Pin trâu, thiết kế vuông', 'Vàng Gold', 0, 'HetHang', 1), -- 9 (HẾT HÀNG)
('iPhone SE (2022) 64GB', 'Apple', 'ipse3_64.jpg', 2022, 7990000, 'Chip A15, nút Home vật lý', 'Đỏ', 20, 'ConHang', 1), -- 10
('iPhone 11 128GB', 'Apple', 'ip11_128.jpg', 2019, 9500000, 'Camera kép, chip A13', 'Tím', 40, 'ConHang', 1), -- 11
('iPhone XR 64GB', 'Apple', 'ipxr_64.jpg', 2018, 7000000, 'Thiết kế viền mỏng', 'Đen', 25, 'HetHang', 1), -- 12 (HẾT HÀNG)
('iPhone 12 64GB', 'Apple', 'ip12_64.jpg', 2020, 12900000, 'Màn hình OLED, 5G', 'Trắng', 35, 'ConHang', 1), -- 13

-- ANDROID FLAGSHIP (ID 2) - 10 products
('Samsung Galaxy S24 Ultra 5G 512GB', 'Samsung', 's24ultra_512.jpg', 2024, 28990000, 'Snapdragon 8 Gen 3 for Galaxy, AI tích hợp, Bút S-Pen', 'Titan Xám', 40, 'ConHang', 2), -- 14
('Samsung Galaxy S24 5G 256GB', 'Samsung', 's24_256.jpg', 2024, 20990000, 'Thiết kế phẳng, nhỏ gọn', 'Đen Phantom', 55, 'ConHang', 2), -- 15
('Xiaomi 14 Ultra 5G 512GB', 'Xiaomi', 'xiaomi14u.jpg', 2024, 24500000, 'Camera Leica, Chip Snapdragon 8 Gen 3', 'Trắng Gốm', 20, 'ConHang', 2), -- 16
('OPPO Find X7 Ultra', 'OPPO', 'findx7u.jpg', 2024, 23000000, 'Camera Zoom tiềm vọng', 'Xanh Đậm', 10, 'ConHang', 2), -- 17
('Samsung Galaxy Z Fold5 5G 256GB', 'Samsung', 'zfold5.jpg', 2023, 33990000, 'Điện thoại gập, đa nhiệm màn hình lớn', 'Xanh Icy', 15, 'ConHang', 2), -- 18
('Google Pixel 8 Pro 128GB', 'Google', 'pixel8p.jpg', 2023, 21500000, 'Trải nghiệm Android thuần khiết', 'Xanh Bạc Hà', 25, 'ConHang', 2), -- 19
('Sony Xperia 1 V', 'Sony', 'xperia1v.jpg', 2023, 25000000, 'Màn hình 4K, chuyên gia quay phim', 'Đen', 5, 'ConHang', 2), -- 20
('Asus ROG Phone 8 Pro', 'Asus', 'rog8p.jpg', 2024, 29990000, 'Điện thoại Gaming đỉnh cao', 'Đen mờ', 8, 'ConHang', 2), -- 21
('Xiaomi 13T Pro', 'Xiaomi', 'mi13tpro.jpg', 2023, 14990000, 'Sạc nhanh 120W, màn hình 144Hz', 'Xanh', 35, 'ConHang', 2), -- 22
('Samsung Galaxy Z Flip5 5G 128GB', 'Samsung', 'zflip5.jpg', 2023, 19990000, 'Điện thoại gập vỏ sò thời trang', 'Tím', 22, 'ConHang', 2), -- 23

-- ANDROID TẦM TRUNG (ID 3) - 10 products
('Samsung Galaxy A55 5G 128GB', 'Samsung', 'a55.jpg', 2024, 9990000, 'Exynos 1480, Camera OIS', 'Xanh Awesome', 150, 'ConHang', 3), -- 24
('OPPO Reno11 F 5G', 'OPPO', 'reno11f.jpg', 2024, 8490000, 'Chuyên gia Chân dung, Sạc nhanh 67W', 'Xanh Đại Dương', 120, 'ConHang', 3), -- 25
('Xiaomi Redmi Note 13 Pro 4G 256GB', 'Xiaomi', 'note13pro.jpg', 2024, 7490000, 'Camera 200MP, Màn hình AMOLED 120Hz', 'Đen Bán Dạ', 200, 'ConHang', 3), -- 26
('Vivo V29e 5G', 'Vivo', 'v29e.jpg', 2023, 10500000, 'Thiết kế mỏng nhẹ, selfie đẹp', 'Xanh Tím', 90, 'ConHang', 3), -- 27
('Realme 11 Pro+', 'Realme', 'r11proplus.jpg', 2023, 11990000, 'Thiết kế da, sạc 100W', 'Xanh lá', 75, 'ConHang', 3), -- 28
('Motorola Edge 40 Neo', 'Motorola', 'e40neo.jpg', 2023, 8990000, 'Chống nước IP68, sạc nhanh', 'Đen', 65, 'ConHang', 3), -- 29
('Samsung Galaxy M34 5G', 'Samsung', 'm34.jpg', 2023, 7290000, 'Pin khủng 6000mAh', 'Bạc', 110, 'ConHang', 3), -- 30
('Infinix Note 40 Pro', 'Infinix', 'note40p.jpg', 2024, 5990000, 'Sạc không dây, màn cong', 'Vàng', 140, 'ConHang', 3), -- 31
('Tecno Pova 6 Pro', 'Tecno', 'pova6p.jpg', 2024, 7500000, 'Pin lớn, thiết kế gaming', 'Đen', 100, 'ConHang', 3), -- 32
('Xiaomi Redmi Note 12S', 'Xiaomi', 'note12s.jpg', 2023, 5500000, 'Giá rẻ, hiệu năng ổn', 'Xanh Mint', 180, 'ConHang', 3), -- 33

-- MÁY CŨ/ĐÃ QUA SỬ DỤNG (ID 4) - 7 products
('iPhone 13 Pro Max 128GB (Likenew)', 'Apple', 'ip13pm_used.jpg', 2021, 18900000, 'Máy đã qua sử dụng, pin 9x%', 'Xanh Sierra', 15, 'ConHang', 4), -- 34
('Samsung S22 Ultra 256GB (Likenew)', 'Samsung', 's22u_used.jpg', 2022, 13500000, 'Máy đã qua sử dụng, có bút S-Pen', 'Trắng', 8, 'ConHang', 4), -- 35
('Google Pixel 6 Pro 128GB (Likenew)', 'Google', 'p6p_used.jpg', 2021, 9900000, 'Máy đã qua sử dụng, Android thuần', 'Đen', 5, 'ConHang', 4), -- 36
('Xiaomi 13 Pro 256GB (Likenew)', 'Xiaomi', 'mi13p_used.jpg', 2023, 16000000, 'Máy đã qua sử dụng, camera Leica', 'Xanh', 3, 'ConHang', 4), -- 37
('iPhone X 64GB (Likenew)', 'Apple', 'ipx_used.jpg', 2017, 5000000, 'Máy đã qua sử dụng, dùng làm máy phụ', 'Bạc', 12, 'ConHang', 4), -- 38
('Samsung Note 20 Ultra (Likenew)', 'Samsung', 'note20u_used.jpg', 2020, 10500000, 'Cây bút S-Pen, màu đồng', 'Đồng', 7, 'ConHang', 4), -- 39
('iPhone 8 Plus 64GB (Likenew)', 'Apple', 'ip8p_used.jpg', 2017, 4500000, 'Cảm biến vân tay, máy sưu tầm', 'Đỏ', 10, 'ConHang', 4); -- 40

-- Tạo 5 giỏ hàng đang hoạt động (nhưng chưa thanh toán)--
DELETE FROM CART_ITEMS;
DELETE FROM CARTS;

-- maGioHang 1: Tuấn (2) - Mua S24 Ultra (14) x1
INSERT INTO CARTS (maKhachHang) VALUES (2); 
INSERT INTO CART_ITEMS (maGioHang, maSanPham, soLuong) VALUES (1, 14, 1);

-- maGioHang 2: Hương (3) - Mua iP 15 Pro Max (1) x1
INSERT INTO CARTS (maKhachHang) VALUES (3); 
INSERT INTO CART_ITEMS (maGioHang, maSanPham, soLuong) VALUES (2, 1, 1);

-- maGioHang 3: Mai (5) - Mua iP 13 mini (8) x1
INSERT INTO CARTS (maKhachHang) VALUES (5); 
INSERT INTO CART_ITEMS (maGioHang, maSanPham, soLuong) VALUES (3, 8, 1);

-- maGioHang 4: Ngân (7) - Mua Fold5 (18) x1
INSERT INTO CARTS (maKhachHang) VALUES (7); 
INSERT INTO CART_ITEMS (maGioHang, maSanPham, soLuong) VALUES (4, 18, 1);

-- maGioHang 5: Linh (9) - Mua S22 Ultra Used (35) x1, iPhone X Used (38) x1
INSERT INTO CARTS (maKhachHang) VALUES (9); 
INSERT INTO CART_ITEMS (maGioHang, maSanPham, soLuong) VALUES (5, 35, 1), (5, 38, 1);

-- Tạo 5 đơn hàng với các trạng thái khác nhau.-- 
DELETE FROM ORDER_ITEMS;
DELETE FROM ORDERS;

-- maDonHang 1 (Đã giao): Tuấn (2) - Mua iP 15 Pro (2) x1. TongTien = 27,990,000
INSERT INTO ORDERS (maKhachHang, ngayDat, diaChiGiaoHang, phuongThucThanhToan, tongTien, trangThaiDonHang) VALUES 
(2, '2025-10-25 10:00:00', '123 Lê Lợi, Quận 1, TP.HCM', 'Chuyển khoản', 27990000, 'DaGiao');
INSERT INTO ORDER_ITEMS (maDonHang, maSanPham, soLuong, gia) VALUES (1, 2, 1, 27990000);

-- maDonHang 2 (Đang giao): Bình (4) - Mua A55 (24) x1, Note 13 Pro (26) x1. TongTien = 17,480,000
INSERT INTO ORDERS (maKhachHang, ngayDat, diaChiGiaoHang, phuongThucThanhToan, tongTien, trangThaiDonHang) VALUES 
(4, '2025-11-01 15:30:00', 'Khu đô thị Sala, TP. Thủ Đức', 'COD', 17480000, 'DangGiao');
INSERT INTO ORDER_ITEMS (maDonHang, maSanPham, soLuong, gia) VALUES (2, 24, 1, 9990000), (2, 26, 1, 7490000);

-- maDonHang 3 (Chờ xác nhận): Dương (6) - Mua iP 15 Plus (3) x2. TongTien = 43,980,000
INSERT INTO ORDERS (maKhachHang, ngayDat, diaChiGiaoHang, phuongThucThanhToan, tongTien, trangThaiDonHang) VALUES 
(6, '2025-11-10 11:00:00', 'Ngõ 300, Đội Cấn, Hà Nội', 'Thẻ Tín dụng', 43980000, 'ChoXacNhan');
INSERT INTO ORDER_ITEMS (maDonHang, maSanPham, soLuong, gia) VALUES (3, 3, 2, 21990000);

-- maDonHang 4 (Đã giao): Phú (8) - Mua Sony Xperia 1 V (20) x1, Xiaomi 13 Pro Used (37) x1. TongTien = 25,000,000 + 16,000,000 = 41,000,000
INSERT INTO ORDERS (maKhachHang, ngayDat, diaChiGiaoHang, phuongThucThanhToan, tongTien, trangThaiDonHang) VALUES 
(8, '2025-11-15 08:45:00', '1A Lý Thường Kiệt, Đà Nẵng', 'Chuyển khoản', 41000000, 'DaGiao');
INSERT INTO ORDER_ITEMS (maDonHang, maSanPham, soLuong, gia) VALUES (4, 20, 1, 25000000), (4, 37, 1, 16000000);

-- maDonHang 5 (Chờ xác nhận): Anh (11) - Mua iP 13 (7) x1. TongTien = 13,990,000
INSERT INTO ORDERS (maKhachHang, ngayDat, diaChiGiaoHang, phuongThucThanhToan, tongTien, trangThaiDonHang) VALUES 
(11, '2025-11-20 19:15:00', '110 Giải Phóng, Hà Nội', 'COD', 13990000, 'ChoXacNhan');
INSERT INTO ORDER_ITEMS (maDonHang, maSanPham, soLuong, gia) VALUES (5, 7, 1, 13990000);
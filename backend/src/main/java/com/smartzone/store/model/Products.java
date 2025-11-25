package com.smartzone.store.model;
import javax.persistence.*;
@Entity
@Table(name = "PRODUCTS")
public class Products {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "maSanPham")
        private Integer maSanPham;

        @Column(name = "tenSanPham", nullable = false)
        private String tenSanPham;

        @Column(name = "thuongHieu")
        private String thuongHieu;

        @Column(name = "hinhAnh")
        private String hinhAnh;

        @Column(name = "namSanXuat")
        private Integer namSanXuat;

        @Column(name = "gia", nullable = false)
        private Long gia;

        @Column(name = "moTa", columnDefinition = "TEXT")
        private String moTa;

        @Column(name = "mauSac")
        private String mauSac;

        @Column(name = "trangThai")
        private String trangThai; // ENUM('ConHang','HetHang','NgungKinhDoanh')

        @Column(name = "ngayRaMat")
        private java.sql.Date ngayRaMat;

        @Column(name = "soLuongTon")
        private Integer soLuongTon;

        @Column(name = "maDanhMuc")
        private Integer maDanhMuc; // FK tới CATEGORIES

        public Products() {

        }

        // Constructor cơ bản (khi thêm sản phẩm mới)
        public Products(String tenSanPham, Long gia, String thuongHieu, String hinhAnh,
                       Integer namSanXuat, String moTa, String mauSac,
                       String trangThai, java.sql.Date ngayRaMat,
                       Integer soLuongTon, Integer maDanhMuc) {
            this.tenSanPham = tenSanPham;
            this.gia = gia;
            this.thuongHieu = thuongHieu;
            this.hinhAnh = hinhAnh;
            this.namSanXuat = namSanXuat;
            this.moTa = moTa;
            this.mauSac = mauSac;
            this.trangThai = trangThai;
            this.ngayRaMat = ngayRaMat;
            this.soLuongTon = soLuongTon;
            this.maDanhMuc = maDanhMuc;
        }

        // GETTERS & SETTERS
        public Integer getMaSanPham() {
            return maSanPham;
        }

        public void setMaSanPham(Integer maSanPham) {
            this.maSanPham = maSanPham;
        }

        public String getTenSanPham() {
            return tenSanPham;
        }

        public void setTenSanPham(String tenSanPham) {
            this.tenSanPham = tenSanPham;
        }

        public String getThuongHieu() {
            return thuongHieu;
        }

        public void setThuongHieu(String thuongHieu) {
            this.thuongHieu = thuongHieu;
        }

        public String getHinhAnh() {
            return hinhAnh;
        }

        public void setHinhAnh(String hinhAnh) {
            this.hinhAnh = hinhAnh;
        }

        public Integer getNamSanXuat() {
            return namSanXuat;
        }

        public void setNamSanXuat(Integer namSanXuat) {
            this.namSanXuat = namSanXuat;
        }

        public Long getGia() {
            return gia;
        }

        public void setGia(Long gia) {
            this.gia = gia;
        }

        public String getMoTa() {
            return moTa;
        }

        public void setMoTa(String moTa) {
            this.moTa = moTa;
        }

        public String getMauSac() {
            return mauSac;
        }

        public void setMauSac(String mauSac) {
            this.mauSac = mauSac;
        }

        public String getTrangThai() {
            return trangThai;
        }

        public void setTrangThai(String trangThai) {
            this.trangThai = trangThai;
        }

        public java.sql.Date getNgayRaMat() {
            return ngayRaMat;
        }

        public void setNgayRaMat(java.sql.Date ngayRaMat) {
            this.ngayRaMat = ngayRaMat;
        }

        public Integer getSoLuongTon() {
            return soLuongTon;
        }

        public void setSoLuongTon(Integer soLuongTon) {
            this.soLuongTon = soLuongTon;
        }

        public Integer getMaDanhMuc() {
            return maDanhMuc;
        }

        public void setMaDanhMuc(Integer maDanhMuc) {
            this.maDanhMuc = maDanhMuc;
        }

}

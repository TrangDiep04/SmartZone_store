package com.smartzone.store.model;

import javax.persistence.*;

@Entity
@Table(name = "PRODUCTS")
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maSanPham")
    private Integer id;

    @Column(name = "tenSanPham", nullable = false)
    private String name;

    @Column(name = "thuongHieu")
    private String brand;

    @Column(name = "hinhAnh")
    private String image;

    @Column(name = "namSanXuat")
    private Integer year;

    @Column(name = "gia", nullable = false)
    private Long price;

    @Column(name = "moTa", columnDefinition = "TEXT")
    private String description;

    @Column(name = "mauSac")
    private String color;

    @Column(name = "trangThai")
    private String status;

    @Column(name = "ngayRaMat")
    private java.sql.Date releaseDate;

    @Column(name = "soLuongTon")
    private Integer stock;

    @ManyToOne
    @JoinColumn(name = "maDanhMuc", nullable = false)
    private Category category;

    public Products() {}

    public Products(String name, Long price, String brand, String image,
                    Integer year, String description, String color, String status,
                    java.sql.Date releaseDate, Integer stock, Category category) {
        this.name = name;
        this.price = price;
        this.brand = brand;
        this.image = image;
        this.year = year;
        this.description = description;
        this.color = color;
        this.status = status;
        this.releaseDate = releaseDate;
        this.stock = stock;
        this.category = category;
    }

    // GETTERS & SETTERS
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {   // ✅ chuẩn hóa tên method
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Long getPrice() {
        return price;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public java.sql.Date getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(java.sql.Date releaseDate) {
        this.releaseDate = releaseDate;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
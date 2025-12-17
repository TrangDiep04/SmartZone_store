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

    @Column(name = "gia", nullable = false)
    private Long price;

    @Column(name = "moTa", columnDefinition = "TEXT")
    private String description;

    @Column(name = "mauSac")
    private String color;

    @Column(name = "trangThai")
    private String status;

    @Column(name = "soLuongTon")
    private Integer stock;

    @ManyToOne
    @JoinColumn(name = "maDanhMuc", nullable = false)
    private Category category;

    public Products() {}

    // GETTERS & SETTERS
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Long getPrice() { return price; }
    public void setPrice(Long price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}
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

    @Column(name = "hinhAnh2")
    private String image2;

    @Column(name = "hinhAnh3")
    private String image3;

    @Column(name = "hinhAnh4")
    private String image4;

    @Column(name = "hinhAnh5")
    private String image5;

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

    public String getImage2() { return image2; }
    public void setImage2(String image2) { this.image2 = image2; }

    public String getImage3() { return image3; }
    public void setImage3(String image3) { this.image3 = image3; }

    public String getImage4() { return image4; }
    public void setImage4(String image4) { this.image4 = image4; }

    public String getImage5() { return image5; }
    public void setImage5(String image5) { this.image5 = image5; }

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
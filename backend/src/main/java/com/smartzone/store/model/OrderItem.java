package com.smartzone.store.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "maSanPham")
    private Long productId;

    @Column(name = "soLuong")
    private int quantity;

    @Column(name = "gia")
    private int price;

    @ManyToOne
    @JoinColumn(name = "maDonHang")
    @JsonIgnore // ✅ tránh vòng lặp JSON khi trả về Order
    private Order order;

    public OrderItem() {}


    // Getters & Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}
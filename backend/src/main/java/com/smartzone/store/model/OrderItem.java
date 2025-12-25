package com.smartzone.store.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "soLuong")
    private int soLuong;

    @Column(name = "gia")
    private int price;

    @ManyToOne
    @JoinColumn(name = "maDonHang")
    @JsonIgnore
    private Order order;

    @ManyToOne
    @JoinColumn(name = "maSanPham") // Khớp với tên cột trong DB
    private Products product;

    public OrderItem() {}

    // Getters & Setters
    public int getsoLuong() { return soLuong; }
    public void setsoLuong(int soLuong) { this.soLuong = soLuong; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Products getProduct() { return product; }
    public void setProduct(Products product) { this.product = product; }
}
package com.smartzone.store.service;

import com.smartzone.store.model.Order;
import com.smartzone.store.model.OrderItem;
import com.smartzone.store.model.Products;
import com.smartzone.store.payload.OrderRequest;
import com.smartzone.store.repository.OrderRespository;
import com.smartzone.store.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRespository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRespository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // ✅ Lấy tất cả đơn hàng
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // ✅ Tạo đơn hàng và trừ tồn kho
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setAddress(request.getAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingFee(request.getShippingFee());
        order.setStatus("PENDING");

        List<OrderItem> items = request.getItems().stream().map(itemRequest -> {
            // Lấy sản phẩm từ DB bằng Integer
            Integer productId = itemRequest.getProductId();
            Products product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm ID: " + productId));

            // Kiểm tra tồn kho
            if (product.getStock() < itemRequest.getSoLuong()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ tồn kho");
            }

            // Trừ tồn kho
            product.setStock(product.getStock() - itemRequest.getSoLuong());
            productRepository.save(product);

            // Tạo OrderItem
            OrderItem item = new OrderItem();
            item.setProduct(product); // liên kết entity
            item.setsoLuong(itemRequest.getSoLuong());
            item.setPrice(itemRequest.getPrice());
            item.setOrder(order);
            return item;
        }).collect(Collectors.toList());

        order.setItems(items);

        return orderRepository.save(order);
    }
}
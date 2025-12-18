package com.smartzone.store.controller;

import com.smartzone.store.model.Order;
import com.smartzone.store.payload.OrderRequest;
import com.smartzone.store.service.OrderService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 1. Dùng để tạo đơn hàng (Sửa lỗi 500)
    @PostMapping
    public Order createOrder(@RequestBody OrderRequest request) {
        // Hãy chắc chắn OrderService đã xử lý việc gán 'price' vào OrderItem
        return orderService.createOrder(request);
    }

    // 2. Bổ sung phương thức này để sửa lỗi 405 và lỗi ".map() is not a function"
    @GetMapping
    public java.util.List<Order> getAllOrders() {
        return orderService.getAllOrders();
        // Bạn cần thêm hàm getAllOrders() vào OrderService và gọi repo.findAll()
    }
}
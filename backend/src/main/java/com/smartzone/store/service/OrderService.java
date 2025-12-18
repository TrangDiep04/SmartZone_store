package com.smartzone.store.service;

import com.smartzone.store.model.Order;
import com.smartzone.store.model.OrderItem;
import com.smartzone.store.payload.OrderRequest;
import com.smartzone.store.payload.OrderItemRequest;
import com.smartzone.store.repository.OrderRespository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRespository orderRepository;

    public OrderService(OrderRespository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setAddress(request.getAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingFee(request.getShippingFee());
        order.setStatus("PENDING");

        List<OrderItem> items = request.getItems().stream().map(itemRequest -> {
            OrderItem item = new OrderItem();
            item.setProductId(itemRequest.getProductId());
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(itemRequest.getPrice()); // ✅ added price mapping
            item.setOrder(order);
            return item;
        }).collect(Collectors.toList());

        order.setItems(items);

        return orderRepository.save(order);
    }
}
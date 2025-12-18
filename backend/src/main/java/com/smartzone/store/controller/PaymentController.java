package com.smartzone.store.controller;

import com.smartzone.store.payload.PaymentRequest;
import com.smartzone.store.repository.PaymentResponsitory;
import com.smartzone.store.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*") // hoặc localhost:3000 nếu bạn muốn giới hạn
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/momo")
    public PaymentResponsitory momo(@RequestBody PaymentRequest request) {
        return paymentService.createMomoPayment(request);
    }

    @PostMapping("/vnpay")
    public PaymentResponsitory vnpay(@RequestBody PaymentRequest request) {
        return paymentService.createVnpayPayment(request);
    }

    @PostMapping("/zalopay")
    public PaymentResponsitory zalopay(@RequestBody PaymentRequest request) {
        return paymentService.createZalopayPayment(request);
    }

    @PostMapping("/bank-transfer")
    public PaymentResponsitory bankTransfer(@RequestBody PaymentRequest request) {
        return paymentService.createBankTransfer(request);
    }
}
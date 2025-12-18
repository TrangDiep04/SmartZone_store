package com.smartzone.store.repository;

public class PaymentResponsitory {
    private String payUrl;

    public PaymentResponsitory(String payUrl) {
        this.payUrl = payUrl;
    }

    public String getPayUrl() {
        return payUrl;
    }

    public void setPayUrl(String payUrl) {
        this.payUrl = payUrl;
    }

}

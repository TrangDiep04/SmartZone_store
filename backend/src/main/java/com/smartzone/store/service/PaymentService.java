package com.smartzone.store.service;

import com.smartzone.store.payload.PaymentRequest;
import com.smartzone.store.repository.PaymentResponsitory;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class PaymentService {

    // ✅ HÀM THANH TOÁN MOMO CHUẨN
    public PaymentResponsitory createMomoPayment(PaymentRequest request) {
        try {
            String endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

            // ✅ KEY TEST CỦA MOMO (bạn có thể thay bằng key thật)
            String partnerCode = "MOMO";
            String accessKey = "F8BBA842ECF85";
            String secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

            String orderId = String.valueOf(System.currentTimeMillis());
            String requestId = String.valueOf(System.currentTimeMillis());
            String orderInfo = "Thanh toán đơn hàng SmartZone";
            String redirectUrl = "http://localhost:5173/orders";
            String ipnUrl = "http://localhost:8080/api/payment/momo/ipn";
            String amount = String.valueOf(request.getAmount());
            String requestType = "captureWallet";

            // ✅ Tạo raw signature
            String rawSignature =
                    "accessKey=" + accessKey +
                            "&amount=" + amount +
                            "&extraData=" +
                            "&ipnUrl=" + ipnUrl +
                            "&orderId=" + orderId +
                            "&orderInfo=" + orderInfo +
                            "&partnerCode=" + partnerCode +
                            "&redirectUrl=" + redirectUrl +
                            "&requestId=" + requestId +
                            "&requestType=" + requestType;

            // ✅ Mã hóa HMAC SHA256
            String signature = HmacSHA256(rawSignature, secretKey);

            // ✅ Tạo JSON gửi đi
            JSONObject json = new JSONObject();
            json.put("partnerCode", partnerCode);
            json.put("partnerName", "MoMo");
            json.put("storeId", "SmartZoneStore");
            json.put("requestId", requestId);
            json.put("amount", amount);
            json.put("orderId", orderId);
            json.put("orderInfo", orderInfo);
            json.put("redirectUrl", redirectUrl);
            json.put("ipnUrl", ipnUrl);
            json.put("lang", "vi");
            json.put("extraData", "");
            json.put("requestType", requestType);
            json.put("signature", signature);

            // ✅ Gửi request đến MoMo
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json.toString()))
                    .build();

            HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            JSONObject responseJson = new JSONObject(response.body());

            // ✅ Lấy payUrl từ MoMo
            String payUrl = responseJson.getString("payUrl");

            return new PaymentResponsitory(payUrl);

        } catch (Exception e) {
            throw new RuntimeException("MoMo payment error: " + e.getMessage());
        }
    }

    // ✅ HÀM THANH TOÁN VNPAY (fake)
    public PaymentResponsitory createVnpayPayment(PaymentRequest request) {
        String fakeUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?amount=" + request.getAmount();
        return new PaymentResponsitory(fakeUrl);
    }

    // ✅ HÀM THANH TOÁN ZALOPAY (fake)
    public PaymentResponsitory createZalopayPayment(PaymentRequest request) {
        String fakeUrl = "https://sandbox.zalopay.vn/pay?amount=" + request.getAmount();
        return new PaymentResponsitory(fakeUrl);
    }

    // ✅ HÀM CHUYỂN KHOẢN
    public PaymentResponsitory createBankTransfer(PaymentRequest request) {
        String info = "Vui lòng chuyển khoản đến STK 0123456789 - Vietcombank - Nguyễn Văn A";
        return new PaymentResponsitory(info);
    }

    // ✅ HÀM MÃ HÓA HMAC SHA256
    private String HmacSHA256(String data, String secretKey) {
        try {
            Mac hmacSha256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmacSha256.init(secretKeySpec);
            byte[] hash = hmacSha256.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder result = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) result.append('0');
                result.append(hex);
            }
            return result.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error while calculating HMAC-SHA256", e);
        }
    }
}
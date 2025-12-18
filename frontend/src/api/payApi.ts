import axios from "axios";

const BASE_URL = "http://localhost:8080/api/payment";

export interface PaymentResponse {
  payUrl: string; // backend trả về URL redirect
}

export const payApi = {
  /** ✅ 1. Thanh toán MOMO */
  momoPay: async (amount: number): Promise<PaymentResponse> => {
    const res = await axios.post(`${BASE_URL}/momo`, { amount });
    return res.data;
  },

  /** ✅ 2. Thanh toán VNPAY */
  vnpayPay: async (amount: number): Promise<PaymentResponse> => {
    const res = await axios.post(`${BASE_URL}/vnpay`, { amount });
    return res.data;
  },

  /** ✅ 3. Thanh toán ZaloPay */
  zaloPay: async (amount: number): Promise<PaymentResponse> => {
    const res = await axios.post(`${BASE_URL}/zalopay`, { amount });
    return res.data;
  },

  /** ✅ 4. Chuyển khoản ngân hàng (không cần API)
   *  → Nhưng nếu bạn muốn lưu log hoặc tạo đơn trước khi chuyển khoản,
   *    bạn có thể tạo API riêng, ví dụ: /api/payment/bank-transfer
   */
  bankTransfer: async (amount: number): Promise<string> => {
    return "BANK_TRANSFER_OK";
  },
};
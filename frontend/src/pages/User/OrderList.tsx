import React, { useEffect, useState } from "react";

type OrderItem = {
  soLuong: number;
  price: number;
  product: {
    id: number;
    name: string;
    brand: string;
    image: string;
    price: number;
  };
};

type Order = {
  id: number;
  receiverName: string;
  receiverPhone: string;
  address: string;
  paymentMethod: string;
  shippingFee: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

const getPaymentText = (method: string) => {
  switch (method) {
    case "COD":
      return "Thanh toán khi nhận hàng";
    case "MOMO":
      return "Ví MOMO";
    case "VNPAY":
      return "Ví VNPAY";
    case "ZALOPAY":
      return "Ví ZaloPay";
    default:
      return method;
  }
};

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8080/api/orders");
        if (!res.ok) throw new Error("Không thể tải đơn hàng");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError("Lỗi khi tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  if (!orders.length) return <div style={{ padding: 20 }}>Không có đơn hàng nào</div>;

  return (
    <div style={{ padding: 30, maxWidth: 1000, margin: "0 auto" }}>
      <h2>Danh sách đơn hàng</h2>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 20,
            marginBottom: 20,
            background: "#fff",
          }}
        >
          <h3>Đơn hàng #{order.id}</h3>
          <p><strong>Người nhận:</strong> {order.receiverName}</p>
          <p><strong>SĐT:</strong> {order.receiverPhone}</p>
          <p><strong>Địa chỉ:</strong> {order.address}</p>
          <p><strong>Phương thức thanh toán:</strong> {getPaymentText(order.paymentMethod)}</p>
          <p><strong>Phí vận chuyển:</strong> {order.shippingFee.toLocaleString()} đ</p>
          <p><strong>Trạng thái:</strong> {order.status}</p>
          <p><strong>Ngày tạo:</strong> {new Date(order.createdAt).toLocaleString()}</p>

          <h4>Sản phẩm:</h4>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
                borderBottom: "1px solid #eee",
                padding: "10px 0",
              }}
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                style={{ width: 80, height: 80, objectFit: "contain" }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: "bold" }}>{item.product.name}</p>
                <p>Thương hiệu: {item.product.brand}</p>
                <p>Giá: {item.product.price.toLocaleString()} đ</p>
              </div>
              <div>
                <p>Số lượng: {item.soLuong}</p>
                <p>
                  Thành tiền: {(item.price * item.soLuong).toLocaleString()} đ
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default OrderList;
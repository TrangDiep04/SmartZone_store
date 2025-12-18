import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  receiverName: string;
  receiverPhone: string;
  address: string;
  paymentMethod: string;
  shippingFee: number;
  status: string;
  items: OrderItem[];
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Lỗi tải danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Đang tải đơn hàng...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách đơn hàng đã đặt</h2>

      {orders.length === 0 && <p>Bạn chưa có đơn hàng nào.</p>}

      {(orders || []).map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Đơn hàng #{order.id}</h3>
          <p><strong>Người nhận:</strong> {order.receiverName}</p>
          <p><strong>SĐT:</strong> {order.receiverPhone}</p>
          <p><strong>Địa chỉ:</strong> {order.address}</p>
          <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
          <p><strong>Phí vận chuyển:</strong> {order.shippingFee.toLocaleString()} đ</p>
          <p><strong>Trạng thái:</strong> {order.status}</p>

          <h4>Sản phẩm:</h4>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                Mã SP: {item.productId} — SL: {item.quantity} — Giá:{" "}
                {item.price.toLocaleString()} đ
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
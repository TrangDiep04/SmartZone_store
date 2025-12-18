import React from "react";

interface CartItem {
  id?: string;
  maSanPham?: string;
  tenSanPham?: string;
  name?: string;
  gia?: number;
  price?: number;
  quantity: number;
  hinhAnh?: string;
  image?: string;
}

interface Props {
  items: CartItem[];
}

const CartItems: React.FC<Props> = ({ items }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Sản phẩm đã chọn</h3>

      {items.map((item) => {
        const name = item.tenSanPham || item.name;
        const price = item.gia || item.price || 0;

        return (
          <div
            key={item.maSanPham || item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>
              {name} x {item.quantity}
            </span>
            <span>{(price * item.quantity).toLocaleString()}đ</span>
          </div>
        );
      })}
    </div>
  );
};

export default CartItems;
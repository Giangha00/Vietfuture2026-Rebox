"use client";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { LOGIN_REASONS } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function ProductActions({ product }) {
  const { requireAuth } = useAuth();

  const handleBuy = () => {
    requireAuth(
      () => {
        window.alert(`Đã khởi tạo đơn mua "${product.title}". (Demo)`);
      },
      LOGIN_REASONS.buy,
    );
  };

  const handleContact = () => {
    requireAuth(
      () => {
        window.alert(`Đã mở cuộc trò chuyện với ${product.seller.name}. (Demo)`);
      },
      LOGIN_REASONS.contact,
    );
  };

  return (
    <div className="space-y-3">
      <Button fullWidth size="lg" onClick={handleBuy}>
        <Icon name="cart" className="size-5" />
        Buy Now for ${product.price.toFixed(2)}
      </Button>
      <Button fullWidth variant="outline" size="lg" onClick={handleContact}>
        <Icon name="message" className="size-5" />
        Inquire Details
      </Button>
    </div>
  );
}

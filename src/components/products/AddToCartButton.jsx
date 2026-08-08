"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { LOGIN_REASONS } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import { backendNotifyCartAdd } from "@/lib/rebox-backend-api";

export default function AddToCartButton({ product, size = "sm", className = "" }) {
  const { addItem, isInCart } = useCart();
  const { requireAuth, user, token } = useAuth();
  const [message, setMessage] = useState("");
  const inCart = isInCart(product.id);
  const isOwn = user?.id && product.seller?.id === user.id;

  function handleAdd() {
    requireAuth(
      () => {
        if (isOwn) {
          setMessage("You cannot buy your own listing.");
          return;
        }
        const result = addItem(product);
        if (result.added) {
          setMessage("Added to cart");
          if (token) {
            backendNotifyCartAdd({
              token,
              productId: product.id,
              productTitle: product.title,
            }).catch(() => {});
          }
        } else if (result.reason === "exists") {
          setMessage("Already in cart");
        }
        window.setTimeout(() => setMessage(""), 1800);
      },
      LOGIN_REASONS.buy,
      ROUTES.order,
    );
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant={inCart ? "secondary" : "outline"}
        fullWidth
        size={size}
        disabled={Boolean(isOwn)}
        onClick={handleAdd}
      >
        <Icon name="cart" className="size-4" />
        {inCart ? "In cart" : "Add to cart"}
      </Button>
      {message ? (
        <p className="mt-1 text-center text-[11px] font-medium text-rb-muted">
          {message}
        </p>
      ) : null}
    </div>
  );
}

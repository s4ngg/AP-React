import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Minus, Plus, Trash2, Truck } from "lucide-react"
import useCartStore from "../../store/cartStore"
import useAuthStore from "../../store/authStore"
import { getCartItems, deleteCartItem, deleteSelectedCartItems, clearCart } from "../../api/cartApi"
import styles from "./CartPage.module.css"


function CartItemCard({ item }) {
  const { updateQuantity, removeItem, toggleSelect } = useCartStore()

  const handleQty = (delta) => {
    const next = item.quantity + delta
    if (next >= 1) updateQuantity(item.product.id, item.selectedOptions, next)
  }

  const handleDelete = async () => {
    if (item.cartItemId) {
      try {
        await deleteCartItem(item.cartItemId)
      } catch {
      }
    }
    removeItem(item.product.id, item.selectedOptions)
  }

  const displayName = item.product.productName || item.product.name
  const displayBrand = item.product.brandName || item.product.brand
  const displayOption = item.product.option || Object.values(item.selectedOptions || {}).join(" / ")
  const displayImage = item.product.thumbnailUrl || item.product.image

  return (
    <div className={styles.cartItem}>
      <input
        type="checkbox"
        className={styles.itemCheckbox}
        checked={item.isSelected}
        onChange={() => toggleSelect(item.product.id, item.selectedOptions)}
        aria-label="상품 선택"
      />

      <Link to={`/products/${item.product.id}`}>
        <img src={displayImage} alt={displayName} className={styles.itemImg} />
      </Link>

      <div className={styles.itemInfo}>
        {displayBrand && <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>{displayBrand}</p>}
        <Link to={`/products/${item.product.id}`} className={styles.itemName}>
          {displayName}
        </Link>
        {displayOption && <p className={styles.itemOption}>{displayOption}</p>}
        <div className={styles.itemPriceRow}>
          <span className={styles.itemPrice}>{item.product.price?.toLocaleString()}원</span>
        </div>

        <div className={styles.itemBottom}>
          <div className={styles.quantityBox}>
            <button className={styles.qtyBtn} onClick={() => handleQty(-1)} disabled={item.quantity <= 1} aria-label="수량 감소">
              <Minus size={14} />
            </button>
            <span className={styles.qtyNum}>{item.quantity}</span>
            <button className={styles.qtyBtn} onClick={() => handleQty(1)} aria-label="수량 증가">
              <Plus size={14} />
            </button>
          </div>
          <button className={styles.deleteBtn} onClick={handleDelete} aria-label="삭제">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className={styles.itemTotal}>
        <span className={styles.itemTotalPrice}>
          {(item.product.price * item.quantity).toLocaleString()}원
        </span>
      </div>
    </div>
  )
}

export default function CartPage() {
  const navigate = useNavigate()
  const { items, toggleSelectAll, getSelectedTotalPrice, clearCart: clearLocalCart, addItem } = useCartStore()
  const { user, isLoggedIn } = useAuthStore()

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return
    const syncCart = async () => {
      try {
        const res = await getCartItems(user.id)
        const serverItems = res.data || []
        clearLocalCart()
        serverItems.forEach((serverItem) => {
          addItem(
            {
              productId: serverItem.cartItemId,
              productName: serverItem.productName,
              brandName: serverItem.brandName,
              price: serverItem.price,
              option: serverItem.option,
              cartItemId: serverItem.cartItemId,
            },
            serverItem.quantity,
            {}
          )
        })
      } catch {
      }
    }
    syncCart()
  }, [isLoggedIn, user?.id])

  const allSelected = items.length > 0 && items.every((item) => item.isSelected)
  const selectedCount = items.filter((item) => item.isSelected).length
  const selectedTotal = getSelectedTotalPrice()
  const shippingFee = selectedTotal >= 50000 ? 0 : selectedTotal > 0 ? 3000 : 0
  const finalTotal = selectedTotal + shippingFee

  const handleDeleteSelected = async () => {
    const selectedItems = items.filter((item) => item.isSelected)
    const cartItemIds = selectedItems.map((item) => item.cartItemId).filter(Boolean)
    if (cartItemIds.length > 0) {
      try {
        await deleteSelectedCartItems(cartItemIds)
      } catch {
      }
    }
    selectedItems.forEach((item) => {
      useCartStore.getState().removeItem(item.product.id, item.selectedOptions)
    })
  }

  const handleClearCart = async () => {
    if (!window.confirm("장바구니를 전체 비우시겠습니까?")) return
    try {
      await clearCart()
    } catch {
    }
    clearLocalCart()
  }

  const handleOrder = () => {
    if (selectedCount === 0) { alert("선택된 상품이 없습니다."); return }
    navigate("/order")
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>장바구니</h1>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>장바구니가 비어있습니다.</p>
          <button className={styles.emptyBtn} onClick={() => navigate("/")}>쇼핑 계속하기</button>
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.leftArea}>
            <div className={styles.selectBar}>
              <div className={styles.selectLeft}>
                <input
                  type="checkbox"
                  className={styles.selectCheckbox}
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  aria-label="전체 선택"
                />
                <span className={styles.selectLabel}>전체 선택 ({selectedCount}/{items.length})</span>
              </div>
              <div className={styles.selectActions}>
                <button className={styles.actionBtn} onClick={handleDeleteSelected} disabled={selectedCount === 0}>
                  선택 삭제
                </button>
                <button className={styles.actionBtn} onClick={handleClearCart}>
                  전체 삭제
                </button>
              </div>
            </div>

            {items.map((item, index) => (
              <CartItemCard
                key={`${item.product.id}-${index}`}
                item={item}
              />
            ))}
          </div>

          <div className={styles.rightArea}>
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>주문 요약</h2>
              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>선택 상품 ({selectedCount}개)</span>
                  <span className={styles.summaryValue}>{selectedTotal.toLocaleString()}원</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>배송비</span>
                  <span className={styles.summaryValue}>{shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()}원`}</span>
                </div>
                {selectedTotal > 0 && selectedTotal < 50000 && (
                  <p className={styles.freeShippingHint}>{(50000 - selectedTotal).toLocaleString()}원 더 구매 시 무료배송</p>
                )}
              </div>
              <div className={styles.divider} />
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>총 결제금액</span>
                <span className={styles.totalPrice}>{finalTotal.toLocaleString()}원</span>
              </div>
              <button className={styles.orderBtn} onClick={handleOrder} disabled={selectedCount === 0}>
                주문하기 ({selectedCount}개)
              </button>
              <button className={styles.continueBtn} onClick={() => navigate("/")}>쇼핑 계속하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React from 'react';
import { useTranslation } from '../context/TranslationContext';
import { api } from "../api/client";

const OrdersManagement = ({ orders, setOrders, formatCurrency }) => {
  const { t } = useTranslation();
  const formatPrice =
    formatCurrency || ((amount) => `USD ${Number(amount).toFixed(2)}`);

  const handleStatusChange = async (orderId, newStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        await api.updateOrder(orderId, { ...order, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      [t("pending")]: "Pending",
      [t("inProgress")]: "In Progress",
      [t("ready")]: "Ready",
      [t("completed")]: "Completed",
      [t("cancelled")]: "Cancelled",
    };
    const originalStatus =
      Object.keys(statusMap).find((k) => statusMap[k] === status) || status;
    const colors = {
      Pending: "#FFF3CD",
      "In Progress": "#D1ECF1",
      Ready: "#D4EDDA",
      Completed: "#D4EDDA",
      Cancelled: "#F8D7DA",
    };
    return colors[originalStatus] || colors[status] || "#E2E3E5";
  };

  const getStatusTextColor = (status) => {
    const statusMap = {
      [t("pending")]: "Pending",
      [t("inProgress")]: "In Progress",
      [t("ready")]: "Ready",
      [t("completed")]: "Completed",
      [t("cancelled")]: "Cancelled",
    };
    const originalStatus =
      Object.keys(statusMap).find((k) => statusMap[k] === status) || status;
    const colors = {
      Pending: "#856404",
      "In Progress": "#0C5460",
      Ready: "#155724",
      Completed: "#155724",
      Cancelled: "#721C24",
    };
    return colors[originalStatus] || colors[status] || "#383D41";
  };

  const translateStatus = (status) => {
    const statusMap = {
      Pending: t("pending"),
      "In Progress": t("inProgress"),
      Ready: t("ready"),
      Completed: t("completed"),
      Cancelled: t("cancelled"),
    };
    return statusMap[status] || status;
  };

  return (
    <>
      <div className="form-card">
        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            marginBottom: "1.5rem",
          }}
        >
          {t("allOrders")}
        </h3>
        {orders.length === 0 ? (
          <p style={{ color: "var(--chocolate)", opacity: 0.7 }}>
            {t("noOrdersYet")}
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  padding: "1.5rem",
                  background: "var(--blush)",
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <strong
                        style={{ fontSize: "1.1rem", color: "var(--espresso)" }}
                      >
                        {order.id.startsWith("#") ? order.id : `#${order.id}`}
                      </strong>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.25rem 0.75rem",
                          background: getStatusColor(order.status),
                          color: getStatusTextColor(order.status),
                          borderRadius: "50px",
                          fontWeight: 600,
                        }}
                      >
                        {translateStatus(order.status)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--chocolate)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <strong>{t("customer")}:</strong> {order.customerName}
                    </div>
                    {order.email && (
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--chocolate)",
                          opacity: 0.7,
                          marginBottom: "0.25rem",
                        }}
                      >
                        {order.email}
                      </div>
                    )}
                    {order.phone && (
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--chocolate)",
                          opacity: 0.7,
                          marginBottom: "0.5rem",
                        }}
                      >
                        {order.phone}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--chocolate)",
                        marginTop: "0.5rem",
                      }}
                    >
                      <strong>{t("address")}:</strong> {order.address}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--chocolate)",
                        marginTop: "0.5rem",
                      }}
                    >
                      <strong>{t("delivery")}:</strong> {order.date} @{" "}
                      {order.time} ({t(order.timeOfDay)})
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "var(--terracotta)",
                        fontSize: "1.2rem",
                      }}
                    >
                      {formatPrice(order.total)}
                    </div>
                    <div style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                      <div>
                        <strong>{t("items")}:</strong>
                      </div>
                      {(order.items || []).map((i) => (
                        <div
                          key={`${order.id}-${i.id}`}
                          style={{ fontSize: "0.85rem", opacity: 0.8 }}
                        >
                          {i.name} x{i.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {order.notes && (
                  <div
                    style={{
                      marginBottom: "1rem",
                      padding: "0.75rem",
                      background: "white",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                    }}
                  >
                    <strong>{t("notes")}:</strong> {order.notes}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    {t("updateStatus")}:
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    style={{
                      padding: "0.5rem 1rem",
                      border: "2px solid var(--terracotta)",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      background: "white",
                      cursor: "pointer",
                    }}
                  >
                    <option value="Pending">{t("pending")}</option>
                    <option value="In Progress">{t("inProgress")}</option>
                    <option value="Ready">{t("ready")}</option>
                    <option value="Completed">{t("completed")}</option>
                    <option value="Cancelled">{t("cancelled")}</option>
                  </select>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      opacity: 0.7,
                      marginLeft: "auto",
                    }}
                  >
                    {t("recentOrders")}:{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersManagement;

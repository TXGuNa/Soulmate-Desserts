
const AdminPage = ({
  onNavigate,
  ingredients,
  setIngredients,
  products,
  setProducts,
  orders,
  setOrders,
  formatCurrency,
  settings,
  setSettings,
  currentCurrency,
  onResetData,
  userCountry,
}) => {
  const {
    isAdmin,
    invites,
    users,
    createInvite,
    deleteInvite,
    deleteUser,
    user,
    role,
  } = useAuth();
  const { t } = useTranslation();

  const [tab, setTab] = useState("dashboard");
  const [newInv, setNewInv] = useState({ email: "", role: "dealer", days: 7 });
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const safeProducts = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );
  const safeIngredients = useMemo(
    () => (Array.isArray(ingredients) ? ingredients : []),
    [ingredients]
  );
  const safeOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders]
  );

  const currencyDisplay =
    currentCurrency?.symbol?.trim() || currentCurrency?.code || "USD";
  const formatPrice = (amount) =>
    `${currencyDisplay} ${Number(amount || 0).toFixed(2)}`;

  // Load messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await api.getMessages();
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    loadMessages();
  }, []);

  // Persist contact info from country contacts into settings
  const handleContactInfoChange = async (contactInfo) => {
    const updatedSettings = {
      ...settings,
      contactInfo: {
        ...settings?.contactInfo,
        ...contactInfo,
      },
    };

    setSettings(updatedSettings);
    try {
      await api.updateSettings(updatedSettings);
    } catch (err) {
      console.error("Failed to update settings with contact info:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await createInvite(
      newInv.role,
      newInv.email,
      parseInt(newInv.days, 10)
    );

    if (result?.success) {
      setMsg(`${t("createdToken")} ${result.invite.token}`);
      setNewInv({ email: "", role: "dealer", days: 7 });
      setTimeout(() => setMsg(""), 5000);
    }
  };

  const getStatus = (inv) => {
    if (inv.used) return "used";
    return new Date(inv.expiresAt) < new Date() ? "expired" : "active";
  };

  const totalRevenue = safeOrders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingOrders = safeOrders.filter((o) => o.status === "Pending").length;
  const inProgressOrders = safeOrders.filter(
    (o) => o.status === "In Progress"
  ).length;
  const readyOrders = safeOrders.filter((o) => o.status === "Ready").length;
  const completedOrders = safeOrders.filter(
    (o) => o.status === "Completed"
  ).length;
  const cancelledOrders = safeOrders.filter(
    (o) => o.status === "Cancelled"
  ).length;
  const totalUsers = Array.isArray(users) ? users.length : 0;
  const unreadMessages = messages.length;

  const tabItems = [
    { key: "dashboard", label: t("overview") },
    { key: "invites", label: t("invites") },
    { key: "orders", label: t("orders") },
    { key: "products", label: t("products") },
    { key: "ingredients", label: t("ingredients") },
    { key: "users", label: t("users") },
    { key: "settings", label: t("storeSettings") },
  ];

  const visibleTabs = isMobile
    ? tabItems.filter((item) =>
        ["dashboard", "invites", "orders"].includes(item.key)
      )
    : tabItems;

  if (!isAdmin) {
    return (
      <div className="page" style={{ maxWidth: "900px" }}>
        <div className="form-card" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              marginBottom: "0.5rem",
            }}
          >
            {t("adminLogin")}
          </h2>
          <p
            style={{
              color: "var(--chocolate)",
              opacity: 0.8,
              marginBottom: "1.5rem",
            }}
          >
            {t("pleaseLoginWithAdmin")}
          </p>

          <div
            style={{
              background: "var(--blush)",
              padding: "1.25rem",
              borderRadius: "16px",
              marginBottom: "1.5rem",
            }}
          >
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                marginBottom: "0.75rem",
              }}
            >
              {t("adminCredentials")}
            </h4>
            <p style={{ margin: 0, color: "var(--espresso)" }}>
              {t("email")}: <strong>{ADMIN.email}</strong>
            </p>
            <p style={{ margin: 0, color: "var(--espresso)" }}>
              {t("password")}: <strong>{ADMIN.password}</strong>
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => onNavigate("login")}
            >
              {t("goToLogin")}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => onNavigate("home")}
            >
              {t("backToHome")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: "1200px" }}>
      <div className="page-header">
        <h1>{t("adminDashboard")}</h1>
        <p style={{ color: "var(--chocolate)", opacity: 0.75 }}>
          {t("overview")} — {user?.name || t("admin")}
        </p>
      </div>

      <div className="tabs">
        {visibleTabs.map((item) => (
          <button
            key={item.key}
            className={`tab ${tab === item.key ? "active" : ""}`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* {tab === "dashboard" && (
        <div
          className="admin-tab-content"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div className="admin-dashboard-grid">
            <div
              className="form-card"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <div style={{ fontSize: "2.4rem", marginBottom: "0.5rem" }}>
                💰
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 600,
                  color: "var(--terracotta)",
                }}
              >
                {formatPrice(totalRevenue)}
              </div>
              <div style={{ color: "var(--chocolate)", opacity: 0.7 }}>
                {t("totalRevenue")}
              </div>
            </div>
            <div
              className="form-card"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <div style={{ fontSize: "2.4rem", marginBottom: "0.5rem" }}>
                👥
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 600,
                  color: "var(--terracotta)",
                }}
              >
                {totalUsers}
              </div>
              <div style={{ color: "var(--chocolate)", opacity: 0.7 }}>
                {t("registeredUsers")}
              </div>
            </div>
            <div
              className="form-card"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <div style={{ fontSize: "2.4rem", marginBottom: "0.5rem" }}>
                ✉️
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 600,
                  color: "var(--terracotta)",
                }}
              >
                {unreadMessages}
              </div>
              <div style={{ color: "var(--chocolate)", opacity: 0.7 }}>
                {t("messages")}
              </div>
            </div>
          </div>

          <div className="form-card">
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                marginBottom: "1.5rem",
              }}
            >
              {t("recentOrders")}
            </h3>
            {safeOrders.length === 0 ? (
              <p style={{ color: "var(--chocolate)", opacity: 0.7 }}>
                {t("noOrdersYet")}
              </p>
            ) : (
              safeOrders.slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: "var(--blush)",
                    borderRadius: "12px",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div>
                    <strong>{o.id}</strong> — {o.customerName}
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--chocolate)",
                        opacity: 0.7,
                      }}
                    >
                      {(o.items || [])
                        .map((i) => `${i.name} ×${i.quantity}`)
                        .join(", ")}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{ fontWeight: 600, color: "var(--terracotta)" }}
                    >
                      {formatPrice(o.total)}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.25rem 0.75rem",
                        background:
                          o.status === "Pending"
                            ? "#FFF3CD"
                            : o.status === "Ready"
                            ? "#D4EDDA"
                            : o.status === "Cancelled"
                            ? "#F8D7DA"
                            : "#D1ECF1",
                        borderRadius: "50px",
                        display: "inline-block",
                        marginTop: "0.25rem",
                      }}
                    >
                      {t(
                        o.status === "Pending"
                          ? "pending"
                          : o.status === "Ready"
                          ? "ready"
                          : o.status === "Cancelled"
                          ? "cancelled"
                          : o.status === "In Progress"
                          ? "inProgress"
                          : o.status === "Completed"
                          ? "completed"
                          : o.status
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="form-card">
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                marginBottom: "1.5rem",
              }}
            >
              {t("messages")}
            </h3>
            {messages.length === 0 ? (
              <p style={{ color: "var(--chocolate)", opacity: 0.7 }}>
                {t("noMessagesYet")}
              </p>
            ) : (
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t("date")}</th>
                      <th>{t("sender")}</th>
                      <th>{t("phone")}</th>
                      <th>{t("message")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.slice(0, 5).map((m) => (
                      <tr key={m.id}>
                        <td
                          style={{ whiteSpace: "nowrap", fontSize: "0.9rem" }}
                        >
                          {new Date(m.date).toLocaleDateString()}{" "}
                          {new Date(m.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{m.name}</div>
                          <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                            {m.email}
                          </div>
                        </td>
                        <td>{m.phone}</td>
                        <td
                          style={{
                            maxWidth: "300px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={m.message}
                        >
                          {m.message}
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  t("confirmDelete") || "Are you sure?"
                                )
                              ) {
                                api
                                  .deleteMessage(m.id)
                                  .then(() =>
                                    setMessages((prev) =>
                                      prev.filter(
                                        (msgItem) => msgItem.id !== m.id
                                      )
                                    )
                                  )
                                  .catch((err) =>
                                    console.error(
                                      "Failed to delete message",
                                      err
                                    )
                                  );
                              }
                            }}
                            title={t("delete")}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                          >
                            <Trash2 size={18} color="#DC3545" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )} */}

      {/* {tab === "invites" && (
        <div className="admin-tab-content">
          <div className="form-card" style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                marginBottom: "1.5rem",
              }}
            >
              {t("createNewInvite")}
            </h3>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label>{t("emailOptional")}</label>
                  <input
                    type="email"
                    value={newInv.email}
                    onChange={(e) =>
                      setNewInv({ ...newInv, email: e.target.value })
                    }
                    placeholder={t("leaveBlankForAnyEmail")}
                  />
                </div>
                <div className="form-group">
                  <label>{t("role")} *</label>
                  <select
                    value={newInv.role}
                    onChange={(e) =>
                      setNewInv({ ...newInv, role: e.target.value })
                    }
                  >
                    <option value="dealer">{t("dealer")}</option>
                    <option value="public">{t("regularUser")}</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ maxWidth: "200px" }}>
                <label>{t("expiresInDays")}</label>
                <input
                  type="number"
                  value={newInv.days}
                  onChange={(e) =>
                    setNewInv({ ...newInv, days: e.target.value })
                  }
                  min="1"
                  max="90"
                />
              </div>
              {msg && <p className="form-success">{msg}</p>}
              <button
                type="submit"
                className="form-submit"
                style={{ width: "auto", padding: "0.8rem 2rem" }}
              >
                {t("createInvite")}
              </button>
            </form>
          </div>

          <div className="form-card">
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                marginBottom: "1.5rem",
              }}
            >
              {t("allInvites")}
            </h3>
            {invites.length === 0 ? (
              <p style={{ color: "var(--chocolate)", opacity: 0.7 }}>
                {t("noInvitesYet")}
              </p>
            ) : (
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t("token")}</th>
                      <th>{t("email")}</th>
                      <th>{t("role")}
                      </th><th>{t("status")}</th>
                      <th>{t("expires")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.map((inv) => {
                      const st = getStatus(inv);
                      return (
                        <tr key={inv.id}>
                          <td>
                            <span className="token">{inv.token}</span>
                          </td>
                          <td>
                            {inv.email || (
                              <em style={{ opacity: 0.5 }}>{t("any")}</em>
                            )}
                          </td>
                          <td style={{ textTransform: "capitalize" }}>
                            {inv.role === "dealer"
                              ? t("dealer")
                              : t("regularUser")}
                          </td>
                          <td>
                            <span className={`status ${st}`}>{t(st)}</span>
                          </td>
                          <td>
                            {new Date(inv.expiresAt).toLocaleDateString()}
                          </td>
                          <td>
                            {st === "active" && (
                              <button
                                onClick={() => deleteInvite(inv.id)}
                                title={t("delete")}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "4px",
                                }}
                              >
                                <Trash2 size={18} color="#DC3545" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )} */}

      {/* {tab === "orders" && (
        <div className="admin-tab-content">
          <div
            className="admin-dashboard-grid"
            style={{ marginBottom: "1.5rem" }}
          >
            <div
              className="form-card"
              style={{ textAlign: "center", padding: "1.5rem" }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "0.35rem" }}>
                📦
              </div>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "var(--terracotta)",
                }}
              >
                {pendingOrders}
              </div>
              <div style={{ color: "var(--chocolate)", opacity: 0.7 }}>
                {t("pendingOrders")}
              </div>
            </div>
            <div
              className="form-card"
              style={{ textAlign: "center", padding: "1.5rem" }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "0.35rem" }}>
                ⚙️
              </div>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "var(--terracotta)",
                }}
              >
                {inProgressOrders}
              </div>
              <div style={{ color: "var(--chocolate)", opacity: 0.7 }}>
                {t("inProgress")}
              </div>
            </div>
            <div
              className="form-card"
              style={{ textAlign: "center", padding: "1.5rem" }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "0.35rem" }}>
                ✅
              </div>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "var(--terracotta)",
                }}
              >
                {readyOrders}
              </div>
              <div style={{ color: "var(--chocolate)", opacity: 0.7 }}>
                {t("ready")}
              </div>
            </div>
          </div>

          <OrdersManagement
            orders={safeOrders}
            setOrders={setOrders}
            formatCurrency={formatCurrency}
          />
        </div>
      )} */}

      {/* {tab === "products" && (
        <div className="admin-tab-content">
          <ProductsManagement
            products={safeProducts}
            setProducts={setProducts}
            ingredients={safeIngredients}
            formatCurrency={formatCurrency}
            currentCurrency={currentCurrency}
          />
        </div>
      )} */}

      {/* {tab === "ingredients" && (
        <div className="admin-tab-content">
          <IngredientsManagement
            ingredients={safeIngredients}
            setIngredients={setIngredients}
            products={safeProducts}
            currentCurrency={currentCurrency}
          />
        </div>
      )} */}

      {/* {tab === "users" && (
        <div className="admin-tab-content">
          <div className="form-card">
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                marginBottom: "1.5rem",
              }}
            >
              {t("registeredUsers")}
            </h3>
            {!users || users.length === 0 ? (
              <p style={{ color: "var(--chocolate)", opacity: 0.7 }}>
                {t("noUsersYet")}
              </p>
            ) : (
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t("name")}</th>
                      <th>{t("email")}</th>
                      <th>{t("phone")}</th>
                      <th>{t("role")}</th>
                      <th>{t("registered")}</th>
                      <th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone || "-"}</td>
                        <td>
                          <span
                            className={`status ${
                              u.role === "dealer" ? "active" : ""
                            }`}
                            style={{
                              background:
                                u.role === "dealer" ? "#D4EDDA" : "#E2E3E5",
                            }}
                          >
                            {u.role === "dealer"
                              ? t("dealer")
                              : t("regularUser")}
                          </span>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => deleteUser(u.id)}
                          >
                            {t("remove")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )} */}

      {/* {tab === "settings" && (
        <div className="admin-tab-content">
          <div className="form-card">
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                marginBottom: "1.5rem",
              }}
            >
              {t("adminGeneralSettings")}
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label>{t("contactEmail")}</label>
                <input
                  type="email"
                  value={settings?.contactInfo?.email || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contactInfo: {
                        ...settings?.contactInfo,
                        email: e.target.value,
                      },
                    })
                  }
                  placeholder="hello@soulmatedesserts.com"
                  readOnly
                  style={{
                    background: "var(--blush)",
                    cursor: "not-allowed",
                    opacity: 0.8,
                  }}
                  title="Synced from default country contact"
                />
              </div>
              <div className="form-group">
                <label>{t("contactPhone")}</label>
                <input
                  type="text"
                  value={settings?.contactInfo?.phone || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contactInfo: {
                        ...settings?.contactInfo,
                        phone: e.target.value,
                      },
                    })
                  }
                  placeholder="(512) 555-CAKE"
                  readOnly
                  style={{
                    background: "var(--blush)",
                    cursor: "not-allowed",
                    opacity: 0.8,
                  }}
                  title="Synced from default country contact"
                />
              </div>
            </div>
            <p
              style={{
                color: "var(--chocolate)",
                opacity: 0.7,
                fontSize: "0.9rem",
                marginBottom: "2rem",
              }}
            >
              {t("footerSettingsDescription")}{" "}
              <span style={{ fontStyle: "italic" }}>
                ({t("defaultContact")} ⭐)
              </span>
            </p>

            <ContactManagement
              onDefaultChange={handleContactInfoChange}
              userCountry={userCountry}
            />

            <div
              style={{
                paddingTop: "2rem",
                borderTop: "2px solid var(--blush)",
                marginTop: "2rem",
              }}
            >
              <h4
                style={{
                  fontFamily: "'Playfair Display',serif",
                  marginBottom: "1rem",
                  color: "var(--espresso)",
                }}
              >
                {t("dataManagement")}
              </h4>
              <button className="btn btn-danger" onClick={onResetData}>
                {t("resetData")}
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AdminPage;



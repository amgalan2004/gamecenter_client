/* =========================================================
    🚀 GAME CENTER CONNECT - API UTILS
   ========================================================= */

const API_URL = "http://localhost:5000/api";

/**
 * 🛠️ COMMON FETCH WRAPPER
 */
async function apiFetch(endpoint, options = {}) {
    // ❗ ЧУХАЛ: Хөтөч дээр хадгалагдсан 'authToken' нэртэй таарууллаа
    const token = localStorage.getItem("authToken"); 
    
    const defaultHeaders = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: { ...defaultHeaders, ...options.headers },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Серверээс буруу хариу ирлээ. Backend ажиллаж байгаа эсэхийг шалгана уу.");
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Алдаа гарлаа");
    
    return data;
}

/* =========================================================
    🧾 AUTHENTICATION
   ========================================================= */

export async function register(data) {
    const result = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (result.token) {
        // 'authToken' болгож ижилсүүлэв
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userData", JSON.stringify(result.user));
    }
    return result;
}

export async function login(data) {
    const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (result.token) {
        // 'authToken' болгож ижилсүүлэв
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userEmail", result.user.email);
        localStorage.setItem("userData", JSON.stringify(result.user));
    }
    return result;
}

/* =========================================================
    📊 ADMIN, STATS, WALLET
   ========================================================= */

export async function getPlatformStats() { return await apiFetch("/stats/platform-stats"); }
export async function getMyWallet() { return await apiFetch("/wallet/me"); }
export async function getWalletTransactions() { return await apiFetch("/wallet/transactions"); }

// Төвийн мэдээлэл авах (Dashboard-д хэрэгтэй)
export async function getMyCenter() { return await apiFetch("/centers/my-center"); }

/* =========================================================
    🔑 TOKEN MANAGEMENT (Нэрийг ижилсүүлсэн)
   ========================================================= */

export function setToken(token) { localStorage.setItem("authToken", token); }
export function getToken() { return localStorage.getItem("authToken"); }
export function clearToken() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userData");
}
/* =========================================================
    💰 FINANCE & ACCOUNTANT FUNCTIONS (NEWLY ADDED)
   ========================================================= */

/**
 * 💸 Зардал шинээр бүртгэх
 * data: { center_id, description, amount, category }
 */
export async function addExpense(data) {
    return await apiFetch("/finance/add-expense", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

/**
 * 📅 Тухайн төвийн санхүүгийн тайлангуудыг авах
 */
export async function getFinanceReports() {
    return await apiFetch("/finance/reports");
}

/**
 * 📈 Шинэ тайлан нэгтгэж үүсгэх (Daily/Weekly)
 * data: { center_id, report_type }
 */
export async function generateFinanceReport(data) {
    return await apiFetch("/finance/generate-report", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

/**
 * ⚖️ Ээлжийн тооцоо тулгах (Reconcile)
 * reportId: Тайлангийн ID
 * data: { cash_reported, online_reported }
 */
export async function reconcileFinanceReport(reportId, data) {
    return await apiFetch(`/finance/reconcile/${reportId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

/**
 * 🔍 Зардлын түүхийг шүүж авах
 */
export async function getExpenseHistory() {
    return await apiFetch("/finance/expenses");
}
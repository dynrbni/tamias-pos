import { supabase } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7878/api';

// Generic fetch wrapper with auth
async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (session?.access_token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// Get user's store ID
export async function getUserStoreId(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    // First try to get from profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('store_id')
        .eq('id', session.user.id)
        .single();

    if (profile?.store_id) return profile.store_id;

    // Fallback: get store where user is owner
    const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', session.user.id)
        .single();

    return store?.id || null;
}

// ============================================
// DASHBOARD API
// ============================================

export interface DashboardStats {
    today_sales: number;
    sales_change_percent: number;
    today_transactions: number;
    transactions_change: number;
    average_transaction: number;
    average_change_percent: number;
    today_items_sold: number;
    items_change: number;
    total_products: number;
    low_stock_count: number;
    total_customers: number;
    total_employees: number;
}

export interface ChartDataPoint {
    date: string;
    day_name: string;
    total_sales: number;
    transaction_count: number;
}

export interface TopProduct {
    id: string;
    name: string;
    sold: number;
    revenue: number;
}

export interface LowStockProduct {
    id: string;
    name: string;
    stock: number;
    min_stock: number;
    category: string;
}

export interface RecentTransaction {
    id: string;
    full_id: string;
    customer: string;
    items_count: number;
    total: number;
    status: string;
    payment_method: string;
    created_at: string;
}

export async function getDashboardStats(storeId: string): Promise<DashboardStats> {
    return fetchAPI<DashboardStats>(`/dashboard/stats?store_id=${storeId}`);
}

export async function getChartData(storeId: string, days = 7): Promise<ChartDataPoint[]> {
    return fetchAPI<ChartDataPoint[]>(`/dashboard/chart?store_id=${storeId}&days=${days}`);
}

export async function getTopProducts(storeId: string, limit = 5): Promise<TopProduct[]> {
    return fetchAPI<TopProduct[]>(`/dashboard/top-products?store_id=${storeId}&limit=${limit}`);
}

export async function getLowStockProducts(storeId: string, limit = 5): Promise<LowStockProduct[]> {
    return fetchAPI<LowStockProduct[]>(`/dashboard/low-stock?store_id=${storeId}&limit=${limit}`);
}

export async function getRecentTransactions(storeId: string, limit = 5): Promise<RecentTransaction[]> {
    return fetchAPI<RecentTransaction[]>(`/dashboard/recent-transactions?store_id=${storeId}&limit=${limit}`);
}

// ============================================
// PRODUCTS API
// ============================================

export interface Product {
    id: string;
    store_id: string;
    name: string;
    price: number;
    cost: number;
    category: string;
    stock: number;
    min_stock: number;
    barcode: string;
    image_url: string;
    is_active: boolean;
    created_at: string;
}

export async function getProducts(storeId: string): Promise<Product[]> {
    return fetchAPI<Product[]>(`/products?store_id=${storeId}`);
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
    return fetchAPI<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(product),
    });
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return fetchAPI<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
    });
}

export async function deleteProduct(id: string): Promise<void> {
    return fetchAPI<void>(`/products/${id}`, { method: 'DELETE' });
}

// ============================================
// CUSTOMERS API
// ============================================

export interface Customer {
    id: string;
    store_id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    total_transactions: number;
    total_spent: number;
    created_at: string;
}

export async function getCustomers(storeId: string): Promise<Customer[]> {
    return fetchAPI<Customer[]>(`/customers?store_id=${storeId}`);
}

export async function createCustomer(customer: Partial<Customer>): Promise<Customer> {
    return fetchAPI<Customer>('/customers', {
        method: 'POST',
        body: JSON.stringify(customer),
    });
}

export async function updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    return fetchAPI<Customer>(`/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(customer),
    });
}

export async function deleteCustomer(id: string): Promise<void> {
    return fetchAPI<void>(`/customers/${id}`, { method: 'DELETE' });
}

// ============================================
// EMPLOYEES API
// ============================================

export interface Employee {
    id: string;
    store_id: string;
    user_id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    salary: number;
    is_active: boolean;
    joined_at: string;
    created_at: string;
}

export async function getEmployees(storeId: string): Promise<Employee[]> {
    return fetchAPI<Employee[]>(`/employees?store_id=${storeId}`);
}

export async function createEmployee(employee: Partial<Employee>): Promise<Employee> {
    return fetchAPI<Employee>('/employees', {
        method: 'POST',
        body: JSON.stringify(employee),
    });
}

export async function updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee> {
    return fetchAPI<Employee>(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(employee),
    });
}

export async function deleteEmployee(id: string): Promise<void> {
    return fetchAPI<void>(`/employees/${id}`, { method: 'DELETE' });
}

// ============================================
// CATEGORIES API
// ============================================

export interface Category {
    id: string;
    store_id: string;
    name: string;
    color: string;
    created_at: string;
}

export async function getCategories(storeId: string): Promise<Category[]> {
    return fetchAPI<Category[]>(`/categories?store_id=${storeId}`);
}

export async function createCategory(category: Partial<Category>): Promise<Category> {
    return fetchAPI<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify(category),
    });
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    return fetchAPI<Category>(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(category),
    });
}

export async function deleteCategory(id: string): Promise<void> {
    return fetchAPI<void>(`/categories/${id}`, { method: 'DELETE' });
}

// ============================================
// TRANSACTIONS API
// ============================================

export interface Transaction {
    id: string;
    store_id: string;
    cashier_id: string;
    customer_id: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    payment_method: string;
    status: string;
    items: any[];
    created_at: string;
}

export async function getTransactions(storeId: string): Promise<Transaction[]> {
    return fetchAPI<Transaction[]>(`/transactions?store_id=${storeId}`);
}

export async function createTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    return fetchAPI<Transaction>('/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
    });
}

// Format currency
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Format relative time
export function formatRelativeTime(date: string): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return then.toLocaleDateString('id-ID');
}

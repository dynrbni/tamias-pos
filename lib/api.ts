import { supabase } from './supabase';

// ============================================
// HELPER FUNCTIONS
// ============================================

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

// ============================================
// TYPE DEFINITIONS
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

export interface Employee {
    id: string;
    store_id: string;
    user_id: string;
    employee_id: string; // 10-digit unique ID for login
    name: string;
    email: string;
    phone: string;
    role: string;
    salary: number;
    pin: string; // Password/PIN for login
    is_active: boolean;
    joined_at: string;
    created_at: string;
}

export interface Category {
    id: string;
    store_id: string;
    name: string;
    color: string;
    created_at: string;
}

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

// ============================================
// DASHBOARD API - Direct Supabase
// ============================================

export async function getDashboardStats(storeId: string): Promise<DashboardStats> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    // Today's transactions
    const { data: todayTx } = await supabase
        .from('transactions')
        .select('total, items')
        .eq('store_id', storeId)
        .gte('created_at', todayStart.toISOString());

    // Yesterday's transactions
    const { data: yesterdayTx } = await supabase
        .from('transactions')
        .select('total, items')
        .eq('store_id', storeId)
        .gte('created_at', yesterdayStart.toISOString())
        .lt('created_at', todayStart.toISOString());

    // Products count
    const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', storeId);

    // Low stock count
    const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', storeId)
        .lte('stock', 10);

    // Customers count
    const { count: customerCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', storeId);

    // Employees count
    const { count: employeeCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', storeId);

    const todaySales = todayTx?.reduce((sum, t) => sum + (t.total || 0), 0) || 0;
    const yesterdaySales = yesterdayTx?.reduce((sum, t) => sum + (t.total || 0), 0) || 0;
    const todayCount = todayTx?.length || 0;
    const yesterdayCount = yesterdayTx?.length || 0;

    const todayItems = todayTx?.reduce((sum, t) => {
        const items = t.items || [];
        return sum + items.reduce((s: number, i: any) => s + (i.quantity || 0), 0);
    }, 0) || 0;

    const yesterdayItems = yesterdayTx?.reduce((sum, t) => {
        const items = t.items || [];
        return sum + items.reduce((s: number, i: any) => s + (i.quantity || 0), 0);
    }, 0) || 0;

    const salesChange = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 : 0;
    const avgToday = todayCount > 0 ? todaySales / todayCount : 0;
    const avgYesterday = yesterdayCount > 0 ? yesterdaySales / yesterdayCount : 0;
    const avgChange = avgYesterday > 0 ? ((avgToday - avgYesterday) / avgYesterday) * 100 : 0;

    return {
        today_sales: todaySales,
        sales_change_percent: Math.round(salesChange),
        today_transactions: todayCount,
        transactions_change: todayCount - yesterdayCount,
        average_transaction: Math.round(avgToday),
        average_change_percent: Math.round(avgChange),
        today_items_sold: todayItems,
        items_change: todayItems - yesterdayItems,
        total_products: productCount || 0,
        low_stock_count: lowStockCount || 0,
        total_customers: customerCount || 0,
        total_employees: employeeCount || 0,
    };
}

export async function getChartData(storeId: string, days = 7): Promise<ChartDataPoint[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const { data: transactions } = await supabase
        .from('transactions')
        .select('total, created_at')
        .eq('store_id', storeId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

    // Group by date
    const grouped: Record<string, { total: number; count: number }> = {};

    // Initialize all days
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const key = d.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
        grouped[key] = { total: 0, count: 0 };
    }

    // Aggregate transactions
    transactions?.forEach(tx => {
        const d = new Date(tx.created_at);
        const key = d.toLocaleDateString('en-CA');
        if (grouped[key]) {
            grouped[key].total += tx.total || 0;
            grouped[key].count += 1;
        }
    });

    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    return Object.entries(grouped).map(([date, data]) => ({
        date,
        day_name: dayNames[new Date(date).getDay()],
        total_sales: data.total,
        transaction_count: data.count,
    }));
}

export async function getTopProducts(storeId: string, limit = 5): Promise<TopProduct[]> {
    // Get recent transactions
    const { data: transactions } = await supabase
        .from('transactions')
        .select('items')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(100);

    // Aggregate product sales
    const productSales: Record<string, { name: string; sold: number; revenue: number }> = {};

    transactions?.forEach(tx => {
        const items = tx.items || [];
        items.forEach((item: any) => {
            const id = item.product_id || item.id;
            if (!productSales[id]) {
                productSales[id] = { name: item.name || 'Unknown', sold: 0, revenue: 0 };
            }
            productSales[id].sold += item.quantity || 0;
            productSales[id].revenue += (item.price || 0) * (item.quantity || 0);
        });
    });

    return Object.entries(productSales)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.sold - a.sold)
        .slice(0, limit);
}

export async function getLowStockProducts(storeId: string, limit = 5): Promise<LowStockProduct[]> {
    const { data } = await supabase
        .from('products')
        .select('id, name, stock, min_stock, category')
        .eq('store_id', storeId)
        .lte('stock', 10)
        .order('stock', { ascending: true })
        .limit(limit);

    return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        stock: p.stock || 0,
        min_stock: p.min_stock || 10,
        category: p.category || '',
    }));
}

export async function getRecentTransactions(storeId: string, limit = 5): Promise<RecentTransaction[]> {
    const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(limit);

    return (data || []).map(tx => ({
        id: tx.id.substring(0, 8),
        full_id: tx.id,
        customer: 'Pelanggan',
        items_count: (tx.items || []).reduce((s: number, i: any) => s + (i.quantity || 0), 0),
        total: tx.total || 0,
        status: tx.status || 'completed',
        payment_method: tx.payment_method || 'cash',
        created_at: tx.created_at,
    }));
}

// ============================================
// PRODUCTS API - Direct Supabase
// ============================================

export async function getProducts(storeId: string): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

// ============================================
// CUSTOMERS API - Direct Supabase
// ============================================

export async function getCustomers(storeId: string): Promise<Customer[]> {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function createCustomer(customer: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabase
        .from('customers')
        .update(customer)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteCustomer(id: string): Promise<void> {
    const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

// ============================================
// EMPLOYEES API - Direct Supabase
// ============================================

export async function getEmployees(storeId: string): Promise<Employee[]> {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function createEmployee(employee: Partial<Employee>): Promise<Employee> {
    const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee> {
    const { data, error } = await supabase
        .from('employees')
        .update(employee)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteEmployee(id: string): Promise<void> {
    const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

// ============================================
// CATEGORIES API - Direct Supabase
// ============================================

export async function getCategories(storeId: string): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeId)
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function createCategory(category: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
}

// ============================================
// TRANSACTIONS API - Direct Supabase
// ============================================

export async function getTransactions(storeId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function createTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

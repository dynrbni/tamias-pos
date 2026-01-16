import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lzcacsiuskiewpbxfavv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6Y2Fjc2l1c2tpZXdwYnhmYXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MTQ3NTIsImV4cCI6MjA4NDA5MDc1Mn0.ldFMwBQeoGHf9krKRgo23Csf-Pfom_cC7zJ66wRPdVc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
    },
    global: {
        headers: {
            'X-Client-Info': 'tamias-pos-web'
        }
    }
});

// Safe auth wrapper to handle abort errors
export const safeAuthCall = async <T>(
    authFn: () => Promise<T>
): Promise<T | null> => {
    try {
        return await authFn();
    } catch (error: any) {
        if (error?.name === 'AbortError') {
            console.log('Auth request aborted (safe to ignore)');
            return null;
        }
        throw error;
    }
};

// Database types
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    full_name: string | null;
                    role: string;
                    store_id: string | null;
                    created_at: string;
                };
            };
            stores: {
                Row: {
                    id: string;
                    name: string;
                    address: string | null;
                    owner_id: string;
                    created_at: string;
                };
            };
            products: {
                Row: {
                    id: string;
                    store_id: string;
                    name: string;
                    price: number;
                    category: string | null;
                    stock: number;
                    barcode: string | null;
                    image_url: string | null;
                    created_at: string;
                };
            };
            transactions: {
                Row: {
                    id: string;
                    store_id: string;
                    cashier_id: string;
                    total: number;
                    tax: number;
                    payment_method: string;
                    items: any;
                    created_at: string;
                };
            };
        };
    };
};

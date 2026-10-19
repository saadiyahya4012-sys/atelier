import React, { useState, useEffect } from 'react';
import { Product, Order, OrderStatus, AdminStats, WooCommerceSettings, DemoRequest } from '../types';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Server,
  Key,
  Globe,
  TrendingUp,
  FileText,
  X,
  Search,
  Sliders,
  DollarSign,
  CreditCard,
  Sparkles,
  Terminal,
  Check
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onRefreshCatalog: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore, onRefreshCatalog }) => {
  // Authentication State
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('atelier_admin_token');
  });
  const [loginEmail, setLoginEmail] = useState('admin@atelier-paris.com');
  const [loginPassword, setLoginPassword] = useState('atelier_secure_admin_2026');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'woocommerce' | 'stripe' | 'demorequests' | 'docs'>('stats');

  // Dashboard Data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [stripeConfig, setStripeConfig] = useState<any>(null);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);
  const [webhookSimResult, setWebhookSimResult] = useState<string | null>(null);
  const [wcStatus, setWcStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Product Editing / Creation Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    description: '',
    short_description: '',
    price: 350,
    regular_price: 350,
    sale_price: null,
    sku: '',
    stock_quantity: 15,
    status: 'publish',
    material: '',
    origin: '',
    categories: [{ id: 1, name: 'Femme', slug: 'femme' }],
    images: [{ id: 1, src: '/images/prod_cashmere_overcoat_1792324545026.jpg', alt: '' }],
    attributes: [
      { name: 'Taille', options: ['S', 'M', 'L'] },
      { name: 'Couleur', options: ['Noir', 'Crème'] }
    ]
  });

  // Selected Order for Modal View
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // WooCommerce Form
  const [wcForm, setWcForm] = useState({
    url: 'http://localhost/wordpress',
    consumerKey: '',
    consumerSecret: ''
  });
  const [isTestingWc, setIsTestingWc] = useState(false);

  // Search in Products
  const [productSearch, setProductSearch] = useState('');

  // Auto-clear notification
  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };
  // Check session validity & synchronize URL route
  useEffect(() => {
    if (authToken) {
      fetch('/api/admin/check-session', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Session expirée');
          }
          if (window.location.pathname !== '/admin/dashboard') {
            window.history.replaceState({}, '', '/admin/dashboard');
          }
          loadAdminData();
        })
        .catch(() => {
          setAuthToken(null);
          localStorage.removeItem('atelier_admin_token');
          if (window.location.pathname !== '/admin/login') {
            window.history.replaceState({}, '', '/admin/login');
          }
        });
    } else {
      if (window.location.pathname !== '/admin/login') {
        window.history.replaceState({}, '', '/admin/login');
      }
    }
  }, [authToken]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Identifiants administrateur incorrects');
      }
      setAuthToken(data.token);
      localStorage.setItem('atelier_admin_token', data.token);
      window.history.replaceState({}, '', '/admin/dashboard');
      showFeedback('success', 'Authentification administrateur réussie.');
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    if (authToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      }).catch(() => {});
    }
    setAuthToken(null);
    localStorage.removeItem('atelier_admin_token');
    window.history.replaceState({}, '', '/admin/login');
  };

  // Fetch all admin data
  const loadAdminData = async () => {
    if (!authToken) return;
    setLoading(true);

    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      const [statsRes, productsRes, ordersRes, wcRes, demoRes, stripeRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/products', { headers }),
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/woocommerce/status', { headers }),
        fetch('/api/admin/demo-requests', { headers }),
        fetch('/api/stripe/config')
      ]);

      if (statsRes.status === 401 || statsRes.status === 403 || productsRes.status === 401 || productsRes.status === 403) {
        setAuthToken(null);
        localStorage.removeItem('atelier_admin_token');
        window.history.replaceState({}, '', '/admin/login');
        return;
      }

      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.stats);
      }
      if (productsRes.ok) {
        const d = await productsRes.json();
        setProducts(d.data);
      }
      if (ordersRes.ok) {
        const d = await ordersRes.json();
        setOrders(d.data);
      }
      if (demoRes.ok) {
        const d = await demoRes.json();
        setDemoRequests(d.data || []);
      }
      if (stripeRes.ok) {
        const d = await stripeRes.json();
        setStripeConfig(d);
      }
      if (wcRes.ok) {
        const d = await wcRes.json();
        setWcStatus(d.config);
        setWcForm(prev => ({
          ...prev,
          url: d.config.url || prev.url
        }));
      }
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Product Save (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || productForm.price === undefined) {
      showFeedback('error', 'Le nom et le prix sont obligatoires.');
      return;
    }

    try {
      const isEdit = Boolean(editingProduct);
      const url = isEdit ? `/api/admin/products/${editingProduct!.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(productForm)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showFeedback('success', data.message);
      setIsCreatingProduct(false);
      setEditingProduct(null);
      loadAdminData();
      onRefreshCatalog();
    } catch (err: any) {
      showFeedback('error', err.message || 'Erreur lors de l\'enregistrement.');
    }
  };

  // Toggle Publish / Draft
  const handleToggleStatus = async (product: Product) => {
    const nextStatus = product.status === 'publish' ? 'draft' : 'publish';
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showFeedback(
        'success',
        `Produit passé en ${nextStatus === 'publish' ? 'Publié (visible boutique)' : 'Brouillon (masqué du catalogue)'}`
      );
      loadAdminData();
      onRefreshCatalog();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (!window.confirm(`Êtes-vous certain de vouloir supprimer définitivement "${productName}" ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showFeedback('success', data.message);
      loadAdminData();
      onRefreshCatalog();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showFeedback('success', data.message);
      loadAdminData();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // Update Demo Request Status
  const handleUpdateDemoStatus = async (demoId: string, status: 'new' | 'contacted' | 'completed') => {
    try {
      const res = await fetch(`/api/admin/demo-requests/${demoId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showFeedback('success', 'Statut de la demande de démo mis à jour.');
      loadAdminData();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // Delete Demo Request
  const handleDeleteDemo = async (demoId: string) => {
    if (!window.confirm('Supprimer cette demande de démonstration ?')) return;
    try {
      const res = await fetch(`/api/admin/demo-requests/${demoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showFeedback('success', 'Demande supprimée.');
      loadAdminData();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  // Simulate Stripe Webhook
  const handleSimulateWebhook = async (orderId?: number) => {
    setIsSimulatingWebhook(true);
    setWebhookSimResult(null);

    try {
      const res = await fetch('/api/stripe/simulate-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId || orders[0]?.id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setWebhookSimResult(`✅ Succès: Événement "checkout.session.completed" simulé pour commande #${data.order?.number || orderId}. Statut: ${data.order?.status}`);
      showFeedback('success', 'Événement Webhook Stripe simulé avec succès !');
      loadAdminData();
    } catch (err: any) {
      setWebhookSimResult(`❌ Erreur: ${err.message}`);
      showFeedback('error', err.message);
    } finally {
      setIsSimulatingWebhook(false);
    }
  };

  // Test WooCommerce Connection
  const handleTestWooCommerce = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingWc(true);
    try {
      const res = await fetch('/api/admin/woocommerce/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(wcForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showFeedback('success', data.message || 'Connexion WooCommerce vérifiée avec succès !');
      loadAdminData();
    } catch (err: any) {
      showFeedback('error', err.message);
    } finally {
      setIsTestingWc(false);
    }
  };

  // Sync products
  const handleSyncWooCommerce = async () => {
    try {
      const res = await fetch('/api/admin/woocommerce/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showFeedback('success', data.message);
      loadAdminData();
      onRefreshCatalog();
    } catch (err: any) {
      showFeedback('error', err.message);
    }
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description,
      short_description: p.short_description,
      price: p.price,
      regular_price: p.regular_price,
      sale_price: p.sale_price,
      sku: p.sku,
      stock_quantity: p.stock_quantity,
      status: p.status,
      material: p.material || '',
      origin: p.origin || '',
      categories: p.categories,
      images: p.images,
      attributes: p.attributes
    });
    setIsCreatingProduct(false);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      short_description: '',
      price: 450,
      regular_price: 450,
      sale_price: null,
      sku: `ATL-NEW-${Math.floor(Math.random() * 900 + 100)}`,
      stock_quantity: 12,
      status: 'publish',
      material: '100% Laine peignée',
      origin: 'Atelier de confection en Italie',
      categories: [{ id: 1, name: 'Femme', slug: 'femme' }],
      images: [{ id: 1, src: '/images/product_wool_coat_1792259932706.jpg', alt: 'Nouvelle pièce' }],
      attributes: [
        { name: 'Taille', options: ['36', '38', '40', '42'] },
        { name: 'Couleur', options: ['Noir', 'Crème'] }
      ]
    });
    setIsCreatingProduct(true);
  };

  const filteredAdminProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.categories.some(c => c.name.toLowerCase().includes(productSearch.toLowerCase()))
  );

  // If not logged in, render the secure login gate
  if (!authToken) {
    return (
      <div className="min-h-screen bg-[#0C0E12] text-[#E1E4EA] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#14171F] border border-[#232836] p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1F2430] border border-[#2D3446] text-white mb-2">
              <ShieldCheck className="w-6 h-6 text-[#D5CFC4]" />
            </div>
            <span className="font-serif text-2xl font-medium tracking-[0.25em] text-white uppercase block">
              ATELIER
            </span>
            <div className="text-xs uppercase tracking-widest text-[#8F96A6] font-medium">
              Espace Administration & Gestion
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-[#2D1619] border border-[#632026] text-xs text-[#FF858D] font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#9DA4B5] mb-1 font-medium">
                Identifiant Administrateur
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@atelier-paris.com"
                className="w-full bg-[#0F1218] border border-[#262B3A] px-3.5 py-2.5 text-xs text-white placeholder-[#5C6475] focus:outline-hidden focus:border-[#D5CFC4] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#9DA4B5] mb-1 font-medium">
                Mot de Passe Sécurisé
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-[#0F1218] border border-[#262B3A] px-3.5 py-2.5 text-xs text-white placeholder-[#5C6475] focus:outline-hidden focus:border-[#D5CFC4] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#FAF8F5] text-[#141414] py-3 text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isLoggingIn ? 'Authentification...' : 'Connexion au Dashboard'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#202532] flex items-center justify-between text-[11px] text-[#7A8396]">
            <span>Accès sécurisé SSL / Bearer</span>
            <button
              onClick={onBackToStore}
              className="text-[#D5CFC4] hover:text-white transition-colors cursor-pointer underline underline-offset-2"
            >
              ← Boutique Client
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col text-[#141414]">
      
      {/* Admin Top Navigation */}
      <div className="bg-[#181818] text-[#FAF8F5] border-b border-[#2C2C2C] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-serif text-xl tracking-[0.2em] font-medium uppercase">
            ATELIER ADMIN
          </span>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#A8A297]">
            <Server className="w-3.5 h-3.5" />
            <span>WooCommerce REST & Store API</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 bg-[#2E2E2E] hover:bg-[#3D3D3D] text-white px-3 py-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Voir la boutique</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[#C5BFB3] hover:text-white transition-colors cursor-pointer"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Toast feedback */}
        {feedbackMessage && (
          <div
            className={`p-4 border text-xs font-medium flex items-center justify-between shadow-sm ${
              feedbackMessage.type === 'success'
                ? 'bg-[#EAF5EC] border-[#A8DBB2] text-[#205428]'
                : 'bg-[#FBF0F0] border-[#E8C2C2] text-[#963E3E]'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedbackMessage.text}</span>
            </div>
            <button onClick={() => setFeedbackMessage(null)} className="text-xs font-bold cursor-pointer">×</button>
          </div>
        )}

        {/* Tab Strip */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E0DACE] pb-4">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'stats'
                ? 'bg-[#141414] text-white'
                : 'bg-white border border-[#DDD7CC] text-[#59554E] hover:border-[#141414]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Vue d'ensemble</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-[#141414] text-white'
                : 'bg-white border border-[#DDD7CC] text-[#59554E] hover:border-[#141414]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Gestion des Produits ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#141414] text-white'
                : 'bg-white border border-[#DDD7CC] text-[#59554E] hover:border-[#141414]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Commandes Client ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('woocommerce')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'woocommerce'
                ? 'bg-[#141414] text-white'
                : 'bg-white border border-[#DDD7CC] text-[#59554E] hover:border-[#141414]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Synchronisation WooCommerce</span>
          </button>

          <button
            onClick={() => setActiveTab('stripe')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'stripe'
                ? 'bg-[#141414] text-white'
                : 'bg-white border border-[#DDD7CC] text-[#59554E] hover:border-[#141414]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#2A5C34]" />
            <span>Passerelle Stripe (Test)</span>
          </button>

          <button
            onClick={() => setActiveTab('demorequests')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'demorequests'
                ? 'bg-[#141414] text-white'
                : 'bg-white border border-[#DDD7CC] text-[#59554E] hover:border-[#141414]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#141414]" />
            <span>Demandes de Démo ({demoRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'docs'
                ? 'bg-[#141414] text-white'
                : 'bg-white border border-[#DDD7CC] text-[#59554E] hover:border-[#141414]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Guide d'Installation</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 border border-[#E8E4DC] space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#7A746B]">Chiffre d'Affaires</span>
                <div className="font-serif text-3xl font-semibold text-[#141414] tabular-nums">
                  {stats.totalRevenue} €
                </div>
                <span className="text-[10px] text-[#2A5C34] font-medium">+14% ce mois-ci</span>
              </div>

              <div className="bg-white p-5 border border-[#E8E4DC] space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#7A746B]">Commandes Traitées</span>
                <div className="font-serif text-3xl font-semibold text-[#141414] tabular-nums">
                  {stats.totalOrders}
                </div>
                <span className="text-[10px] text-[#7A746B]">Boutique et Conciergerie</span>
              </div>

              <div className="bg-white p-5 border border-[#E8E4DC] space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#7A746B]">Panier Moyen</span>
                <div className="font-serif text-3xl font-semibold text-[#141414] tabular-nums">
                  {stats.averageOrderValue} €
                </div>
                <span className="text-[10px] text-[#7A746B]">Positionnement luxe</span>
              </div>

              <div className="bg-white p-5 border border-[#E8E4DC] space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-[#7A746B]">Catalogue Référencé</span>
                <div className="font-serif text-3xl font-semibold text-[#141414] tabular-nums">
                  {stats.totalProducts} <span className="text-sm font-sans font-normal text-[#7A746B]">pièces</span>
                </div>
                <span className="text-[10px] text-[#8A4F2A] font-medium">
                  {stats.lowStockCount} référence(s) en stock faible
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 bg-white border border-[#E8E4DC] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
                  <h3 className="font-serif text-lg font-medium text-[#141414]">
                    Dernières Commandes Reçues
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs uppercase tracking-wider text-[#141414] font-semibold underline underline-offset-4"
                  >
                    Voir tout
                  </button>
                </div>

                <div className="divide-y divide-[#E8E4DC]">
                  {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="font-bold font-mono text-[#141414]">{order.number}</span>
                        <p className="text-[#7A746B]">{order.billing.first_name} {order.billing.last_name} · {order.line_items.length} article(s)</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold tabular-nums text-sm text-[#141414]">{order.total} €</span>
                        <p className="text-[10px] uppercase font-semibold text-[#2A5C34]">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-white border border-[#E8E4DC] p-6 space-y-4">
                <h3 className="font-serif text-lg font-medium text-[#141414] border-b border-[#E8E4DC] pb-3">
                  Actions Rapides
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={openCreateModal}
                    className="w-full bg-[#141414] text-[#FAF8F5] py-2.5 px-4 text-xs font-semibold uppercase tracking-wider hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Créer un produit
                  </button>
                  <button
                    onClick={handleSyncWooCommerce}
                    className="w-full border border-[#DDD7CC] text-[#141414] py-2.5 px-4 text-xs font-semibold uppercase tracking-wider hover:border-[#141414] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Synchroniser avec WooCommerce
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white border border-[#E8E4DC] p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-normal text-[#141414]">
                  Catalogue Produits
                </h3>
                <p className="text-xs text-[#7A746B]">
                  Ajoutez, modifiez ou passez vos créations en mode brouillon pour le catalogue client.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746B]" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Filtrer par nom, SKU..."
                    className="bg-[#FAF8F5] border border-[#DDD7CC] pl-8 pr-3 py-1.5 text-xs text-[#141414] focus:outline-hidden focus:border-[#141414]"
                  />
                </div>

                <button
                  onClick={openCreateModal}
                  className="bg-[#141414] text-[#FAF8F5] px-4 py-2 text-xs uppercase font-semibold tracking-wider hover:bg-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nouveau Produit
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto border border-[#E8E4DC]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E4DC] text-[#7A746B] uppercase tracking-wider font-semibold">
                    <th className="p-3">Visuel</th>
                    <th className="p-3">Référence / Nom</th>
                    <th className="p-3">Catégorie</th>
                    <th className="p-3">Prix</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Statut Boutique</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DC]">
                  {filteredAdminProducts.map(p => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="p-3">
                        <img
                          src={p.images[0]?.src}
                          alt={p.name}
                          className="w-12 h-14 object-cover bg-[#EFECE6] border border-[#DDD7CC]"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[#141414]">{p.name}</div>
                        <div className="text-[11px] font-mono text-[#8E887E]">{p.sku}</div>
                      </td>
                      <td className="p-3 text-[#59554E]">
                        {p.categories.map(c => c.name).join(', ')}
                      </td>
                      <td className="p-3 font-semibold tabular-nums text-[#141414]">
                        {p.price} €
                        {p.on_sale && <span className="block text-[10px] text-[#2A5C34]">Promotion</span>}
                      </td>
                      <td className="p-3 tabular-nums">
                        <span className={`font-semibold ${p.stock_quantity <= 5 ? 'text-[#8A4F2A]' : 'text-[#141414]'}`}>
                          {p.stock_quantity}
                        </span>
                        <span className="text-[10px] block text-[#7A746B]">{p.stock_status}</span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                            p.status === 'publish'
                              ? 'bg-[#E7F3E9] text-[#205428] hover:bg-[#D5EBDA]'
                              : 'bg-[#F2EDE2] text-[#6A665E] hover:bg-[#E2DDD3]'
                          }`}
                          title="Cliquer pour basculer Publié / Brouillon"
                        >
                          {p.status === 'publish' ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Publié
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Brouillon
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-[#59554E] hover:text-[#141414] transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-[#9E988D] hover:text-[#963E3E] transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#E8E4DC] p-6 space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-normal text-[#141414]">
                Commandes Clients
              </h3>
              <p className="text-xs text-[#7A746B]">
                Suivi des commandes passées sur l'interface et synchronisées avec WooCommerce.
              </p>
            </div>

            <div className="overflow-x-auto border border-[#E8E4DC]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E4DC] text-[#7A746B] uppercase tracking-wider font-semibold">
                    <th className="p-3">Numéro</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Articles</th>
                    <th className="p-3">Total TTC</th>
                    <th className="p-3">Statut WooCommerce</th>
                    <th className="p-3 text-right">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DC]">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#141414]">{o.number}</td>
                      <td className="p-3 text-[#7A746B] tabular-nums">
                        {new Date(o.date_created).toLocaleDateString('fr-FR')} {new Date(o.date_created).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[#141414]">{o.billing.first_name} {o.billing.last_name}</div>
                        <div className="text-[11px] text-[#7A746B]">{o.billing.email}</div>
                      </td>
                      <td className="p-3 text-[#59554E] tabular-nums">
                        {o.line_items.length} article(s)
                      </td>
                      <td className="p-3 font-bold text-sm text-[#141414] tabular-nums">
                        {o.total} €
                      </td>
                      <td className="p-3">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="bg-white border border-[#DDD7CC] px-2 py-1 text-xs font-medium text-[#141414] focus:outline-hidden focus:border-[#141414] cursor-pointer"
                        >
                          <option value="pending">En attente (Pending)</option>
                          <option value="processing">En traitement (Processing)</option>
                          <option value="on-hold">En suspens (On hold)</option>
                          <option value="completed">Terminée (Completed)</option>
                          <option value="cancelled">Annulée (Cancelled)</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setViewingOrder(o)}
                          className="px-2.5 py-1 border border-[#DDD7CC] hover:border-[#141414] text-[11px] uppercase tracking-wider font-semibold cursor-pointer"
                        >
                          Consulter
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: WOOCOMMERCE CONNECTION & SYNC */}
        {activeTab === 'woocommerce' && (
          <div className="bg-white border border-[#E8E4DC] p-6 space-y-6 max-w-4xl">
            <div>
              <h3 className="font-serif text-2xl font-normal text-[#141414]">
                Connexion WordPress & WooCommerce
              </h3>
              <p className="text-xs text-[#7A746B]">
                Configurez l'URL et les clés secrètes d'API REST pour synchroniser votre boutique physique ou WordPress locale avec le frontend ATELIER.
              </p>
            </div>

            <form onSubmit={handleTestWooCommerce} className="space-y-4 bg-[#FAF8F5] p-6 border border-[#E8E4DC]">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                  URL de base WordPress / WooCommerce *
                </label>
                <input
                  type="url"
                  required
                  value={wcForm.url}
                  onChange={(e) => setWcForm({ ...wcForm, url: e.target.value })}
                  placeholder="http://localhost/wordpress ou https://votreboutique.com"
                  className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs font-mono text-[#141414] focus:outline-hidden focus:border-[#141414]"
                />
                <span className="text-[10px] text-[#7A746B]">
                  Exemple local : http://localhost:8080 ou http://localhost/wordpress
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                    WooCommerce Consumer Key (ck_...) *
                  </label>
                  <input
                    type="text"
                    required
                    value={wcForm.consumerKey}
                    onChange={(e) => setWcForm({ ...wcForm, consumerKey: e.target.value })}
                    placeholder="ck_72f1xxxxxxxxxxxxxxxx"
                    className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs font-mono text-[#141414] focus:outline-hidden focus:border-[#141414]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                    WooCommerce Consumer Secret (cs_...) *
                  </label>
                  <input
                    type="password"
                    required
                    value={wcForm.consumerSecret}
                    onChange={(e) => setWcForm({ ...wcForm, consumerSecret: e.target.value })}
                    placeholder="cs_98e2xxxxxxxxxxxxxxxx"
                    className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs font-mono text-[#141414] focus:outline-hidden focus:border-[#141414]"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isTestingWc}
                  className="bg-[#141414] text-[#FAF8F5] px-6 py-2.5 text-xs uppercase font-semibold tracking-wider hover:bg-[#2A2A2A] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  {isTestingWc ? 'Vérification en cours...' : 'Enregistrer & Tester la Connexion'}
                </button>

                <button
                  type="button"
                  onClick={handleSyncWooCommerce}
                  className="bg-white border border-[#DDD7CC] text-[#141414] px-5 py-2.5 text-xs uppercase font-semibold tracking-wider hover:border-[#141414] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Déclencher la synchronisation des produits
                </button>
              </div>
            </form>

            {/* Current Sync Status summary */}
            <div className="bg-white border border-[#E8E4DC] p-5 space-y-3 text-xs">
              <h4 className="font-semibold uppercase tracking-wider text-[#141414]">
                État Actuel du Moteur de Synchronisation
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div>
                  <span className="text-[10px] text-[#7A746B] uppercase">Mode Source</span>
                  <div className="font-semibold text-[#141414]">WooCommerce REST v3</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A746B] uppercase">Sécurité Clés</span>
                  <div className="font-semibold text-[#2A5C34]">Serveur Sécurisé (Proxy Node)</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A746B] uppercase">Produits en Mémoire</span>
                  <div className="font-semibold text-[#141414] tabular-nums">{products.length} références</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A746B] uppercase">Dernier Sync</span>
                  <div className="font-semibold text-[#141414] tabular-nums">
                    {wcStatus?.lastSync ? new Date(wcStatus.lastSync).toLocaleTimeString('fr-FR') : 'Initial'}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: DOCUMENTATION & WOOCOMMERCE INSTRUCTIONS */}
        {activeTab === 'docs' && (
          <div className="bg-white border border-[#E8E4DC] p-6 sm:p-8 space-y-6 max-w-4xl text-xs text-[#59554E] leading-relaxed">
            <div>
              <h3 className="font-serif text-2xl font-normal text-[#141414]">
                Guide Technique & Déploiement Headless WooCommerce
              </h3>
              <p className="text-[#7A746B]">
                Comment interconnecter votre WordPress local ou en production avec l'application ATELIER.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold uppercase tracking-wider text-[#141414] text-sm border-b border-[#E8E4DC] pb-1">
                1. Génération des Clés d'API REST WooCommerce
              </h4>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Connectez-vous à votre administration WordPress (ex: <code>http://localhost/wordpress/wp-admin</code>).</li>
                <li>Rendez-vous dans <strong>WooCommerce</strong> &gt; <strong>Réglages</strong> &gt; Onglet <strong>Avancé</strong> &gt; <strong>API REST</strong>.</li>
                <li>Cliquez sur <strong>Ajouter une clé</strong>.</li>
                <li>Donnez une description (ex: <code>ATELIER Headless Storefront</code>).</li>
                <li>Sélectionnez les droits : <strong>Lecture / Écriture (Read/Write)</strong>.</li>
                <li>Cliquez sur <strong>Générer une clé API</strong>.</li>
                <li>Copiez la <strong>Consumer Key</strong> (commençant par <code>ck_...</code>) et le <strong>Consumer Secret</strong> (commençant par <code>cs_...</code>).</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold uppercase tracking-wider text-[#141414] text-sm border-b border-[#E8E4DC] pb-1">
                2. Configuration des Variables d'Environnement (.env)
              </h4>
              <pre className="bg-[#181818] text-[#E8E4DC] p-4 font-mono text-[11px] overflow-x-auto">
{`WC_URL="http://localhost/wordpress"
WC_CONSUMER_KEY="ck_votre_cle_ici"
WC_CONSUMER_SECRET="cs_votre_secret_ici"
WC_API_VERSION="wc/v3"

ADMIN_EMAIL="admin@atelier-paris.com"
ADMIN_PASSWORD="atelier_secure_admin_2026"`}
              </pre>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold uppercase tracking-wider text-[#141414] text-sm border-b border-[#E8E4DC] pb-1">
                3. Règles de Sécurité Respectées
              </h4>
              <ul className="list-disc pl-4 space-y-1.5">
                <li><strong>Zéro exposition des secrets :</strong> Les clés REST WooCommerce ne transitent jamais dans le code JavaScript du navigateur client. Toutes les requêtes sont mandatées par le serveur Express (`server.ts`).</li>
                <li><strong>Filtrage strict des brouillons :</strong> Seuls les produits dont le statut est <code>publish</code> sont envoyés aux visiteurs du catalogue client.</li>
                <li><strong>Gestion du stock :</strong> Toute commande passée décrémente automatiquement le stock côté serveur.</li>
                <li><strong>Données bancaires :</strong> Conforme aux normes PCI-DSS, aucune donnée bancaire sensible n'est enregistrée.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: STRIPE TEST MODE CONFIGURATION & WEBHOOK TESTING */}
        {/* ========================================================================= */}
        {activeTab === 'stripe' && (
          <div className="space-y-6">
            
            {/* Top Status Banner */}
            <div className="bg-white border border-[#E8E4DC] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#2A5C34]" />
                  <h3 className="font-serif text-xl font-medium text-[#141414]">
                    Passerelle de Paiement Stripe (Mode Test)
                  </h3>
                </div>
                <p className="text-xs text-[#59554E]">
                  Intégration Stripe Checkout active en <strong>Mode Test</strong>. Aucune transaction réelle ne sera débitée.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF5EC] border border-[#A8DBB2] text-xs font-semibold text-[#205428]">
                  <span className="w-2 h-2 rounded-full bg-[#205428] animate-pulse" />
                  Mode Test Actif (MAD / Dirhams)
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FAF8F5] border border-[#DDD7CC] text-xs text-[#59554E]">
                  {stripeConfig?.configured ? 'Clé API active' : 'Simulateur Test Intégré'}
                </span>
              </div>
            </div>

            {/* Test Card & Testing Credentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Official Test Card */}
              <div className="bg-white border border-[#E8E4DC] p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#141414]">
                    Carte Bancaire de Test Officielle Stripe
                  </h4>
                  <span className="text-[10px] text-[#2A5C34] font-semibold uppercase tracking-wider">
                    Prête à l'emploi
                  </span>
                </div>

                <div className="p-4 bg-[#FAF8F5] border border-[#DDD7CC] rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-[#7A746B]">Numéro de carte</span>
                    <span className="text-[11px] text-[#2A5C34] font-semibold">Visa Test</span>
                  </div>
                  <div className="font-mono text-base tracking-widest text-[#141414] font-bold">
                    4242 • 4242 • 4242 • 4242
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8E4DC] text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-[#7A746B] block">Date d'expiration</span>
                      <span className="font-mono font-medium text-[#141414]">Toute date future (ex: 12/28)</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-[#7A746B] block">Code CVC</span>
                      <span className="font-mono font-medium text-[#141414]">Tout CVC à 3 chiffres (ex: 123)</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#6A665E] leading-relaxed">
                  Cette carte standard Stripe peut être utilisée directement lors du checkout ou lors de vos tests d'achat immédiat sur chaque fiche produit.
                </p>
              </div>

              {/* Card 2: Webhook Simulator */}
              <div className="bg-white border border-[#E8E4DC] p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#141414]">
                    Vérification Webhook Stripe
                  </h4>
                  <span className="font-mono text-[10px] text-[#7A746B]">/api/stripe/webhook</span>
                </div>

                <p className="text-xs text-[#59554E] leading-relaxed">
                  Le webhook écoute les notifications Stripe (<code>checkout.session.completed</code>) pour basculer automatiquement les commandes en statut <em>processing</em> et confirmer le paiement.
                </p>

                <div className="p-3 bg-[#FAF8F5] border border-[#DDD7CC] text-[11px] text-[#6A665E] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#141414]">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Endpoint Webhook configuré</span>
                  </div>
                  <code className="block font-mono text-[11px] text-[#141414] break-all bg-white p-1.5 border border-[#E8E4DC]">
                    {typeof window !== 'undefined' ? `${window.location.origin}/api/stripe/webhook` : '/api/stripe/webhook'}
                  </code>
                </div>

                <button
                  onClick={() => handleSimulateWebhook()}
                  disabled={isSimulatingWebhook}
                  className="w-full bg-[#141414] text-[#FAF8F5] py-2.5 text-xs uppercase font-semibold tracking-wider hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSimulatingWebhook ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Simulation en cours...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Simuler l'événement "checkout.session.completed"
                    </>
                  )}
                </button>

                {webhookSimResult && (
                  <div className="p-2.5 bg-[#FAF8F5] border border-[#DDD7CC] text-[11px] text-[#141414] font-mono">
                    {webhookSimResult}
                  </div>
                )}
              </div>

            </div>

            {/* Step-by-Step Configuration Guide */}
            <div className="bg-white border border-[#E8E4DC] p-6 sm:p-8 space-y-6 shadow-xs">
              <h4 className="font-serif text-xl font-medium text-[#141414] border-b border-[#E8E4DC] pb-3">
                Guide de Configuration des Clés Stripe Test
              </h4>

              <div className="space-y-4 text-xs text-[#59554E] leading-relaxed">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FAF8F5] border border-[#E8E4DC] space-y-2">
                    <span className="font-bold text-[#141414] uppercase text-[11px]">Étape 1 · Clés de Test</span>
                    <p>Connectez-vous à votre tableau de bord Stripe et activez l'interrupteur <strong>« Mode Test »</strong>. Rendez-vous dans <em>Développeurs &gt; Clés API</em>.</p>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] border border-[#E8E4DC] space-y-2">
                    <span className="font-bold text-[#141414] uppercase text-[11px]">Étape 2 · Fichier .env</span>
                    <p>Renseignez votre clé secrète de test (<code>sk_test_...</code>) et votre clé publique (<code>pk_test_...</code>) dans votre fichier <code>.env</code>.</p>
                  </div>
                  <div className="p-4 bg-[#FAF8F5] border border-[#E8E4DC] space-y-2">
                    <span className="font-bold text-[#141414] uppercase text-[11px]">Étape 3 · Webhooks</span>
                    <p>Ajoutez un endpoint pointant vers <code>/api/stripe/webhook</code> pour écouter l'événement <code>checkout.session.completed</code>.</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="font-semibold text-[#141414] uppercase tracking-wider text-[11px]">
                    Extrait du fichier de configuration sécurisé (.env) :
                  </span>
                  <pre className="bg-[#181818] text-[#E8E4DC] p-4 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`# Clé secrète Stripe (Mode Test - commence par sk_test_)
STRIPE_SECRET_KEY="sk_test_votre_cle_secrete_ici"

# Clé publique Stripe (Mode Test - commence par pk_test_)
STRIPE_PUBLISHABLE_KEY="pk_test_votre_cle_publique_ici"

# Secret de signature des webhooks Stripe (commence par whsec_)
STRIPE_WEBHOOK_SECRET="whsec_votre_signing_secret_ici"`}
                  </pre>
                </div>

                <div className="p-3 bg-[#EFECE6] border border-[#DDD7CC] text-[11px] text-[#6A665E]">
                  <strong>Sécurité Absolue :</strong> La clé secrète <code>STRIPE_SECRET_KEY</code> n'est jamais transmise au navigateur ni accessible dans les bundles JavaScript client. Toutes les sessions Checkout sont créées exclusivement par le serveur Express Node.js.
                </div>
              </div>
            </div>

            {/* Recent Orders paid with Stripe */}
            <div className="bg-white border border-[#E8E4DC] p-6 space-y-4 shadow-xs">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#141414]">
                Dernières Commandes Stripe Test Enregistrées ({orders.filter(o => o.payment_method === 'wc_stripe' || (o as any).is_test_payment).length})
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E8E4DC] text-[11px] uppercase tracking-wider text-[#7A746B] bg-[#FAF8F5]">
                      <th className="py-2.5 px-3">Commande</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Client</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Statut</th>
                      <th className="py-2.5 px-3">ID Session / Paiement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E4DC]">
                    {orders.filter(o => o.payment_method === 'wc_stripe' || (o as any).is_test_payment).map(order => (
                      <tr key={order.id} className="hover:bg-[#FAF8F5]">
                        <td className="py-3 px-3 font-mono font-medium text-[#141414]">
                          {order.number}
                        </td>
                        <td className="py-3 px-3 text-[#7A746B]">
                          {new Date(order.date_created).toLocaleDateString('fr-FR')} {new Date(order.date_created).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3 text-[#141414]">
                          {order.billing.first_name} {order.billing.last_name}
                        </td>
                        <td className="py-3 px-3 font-semibold tabular-nums text-[#141414]">
                          {order.total} DH
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 bg-[#EAF5EC] text-[#205428] font-semibold text-[10px] uppercase rounded-xs">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[10px] text-[#7A746B]">
                          {(order as any).stripe_session_id || 'Session Checkout Test'}
                        </td>
                      </tr>
                    ))}
                    {orders.filter(o => o.payment_method === 'wc_stripe' || (o as any).is_test_payment).length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-[#7A746B]">
                          Aucun paiement Stripe test enregistré pour le moment. Réalisez un test depuis la boutique !
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: DEMANDES DE DÉMO (VIP & PRESENTATION REQUESTS) */}
        {/* ========================================================================= */}
        {activeTab === 'demorequests' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-[#E8E4DC] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#141414]" />
                  <h3 className="font-serif text-xl font-medium text-[#141414]">
                    Demandes de Démonstration & Rendez-Vous Privés
                  </h3>
                </div>
                <p className="text-xs text-[#59554E]">
                  Suivi des demandes soumises par les clients et partenaires via la fonctionnalité <em>« Demander une démo »</em>.
                </p>
              </div>

              <span className="px-3 py-1 bg-[#FAF8F5] border border-[#DDD7CC] text-xs font-semibold text-[#141414] self-start sm:self-auto">
                {demoRequests.length} demande{demoRequests.length > 1 ? 's' : ''} au total
              </span>
            </div>

            <div className="bg-white border border-[#E8E4DC] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E8E4DC] text-[11px] uppercase tracking-wider text-[#7A746B] bg-[#FAF8F5]">
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Coordonnées</th>
                      <th className="py-3 px-4">Société / Établissement</th>
                      <th className="py-3 px-4">Type de Démo</th>
                      <th className="py-3 px-4">Créneau Souhaité</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E4DC]">
                    {demoRequests.map(demo => (
                      <tr key={demo.id} className="hover:bg-[#FAF8F5]">
                        <td className="py-3.5 px-4 font-semibold text-[#141414]">
                          {demo.first_name} {demo.last_name}
                          <span className="block text-[10px] text-[#7A746B] font-normal">
                            Reçue le {new Date(demo.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 space-y-0.5">
                          <a href={`mailto:${demo.email}`} className="text-[#141414] hover:underline block font-medium">
                            {demo.email}
                          </a>
                          {demo.phone && (
                            <span className="text-[11px] text-[#7A746B] block">
                              {demo.phone}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#59554E]">
                          {demo.company || '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-[#141414] block">
                            {demo.demo_type || 'Présentation Privée'}
                          </span>
                          {demo.message && (
                            <p className="text-[11px] text-[#7A746B] mt-0.5 max-w-xs line-clamp-2" title={demo.message}>
                              « {demo.message} »
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#59554E]">
                          {demo.preferred_date || 'Dès que possible'}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={demo.status}
                            onChange={(e) => handleUpdateDemoStatus(demo.id, e.target.value as any)}
                            className={`px-2 py-1 text-[11px] font-semibold uppercase border ${
                              demo.status === 'completed'
                                ? 'bg-[#EAF5EC] border-[#A8DBB2] text-[#205428]'
                                : demo.status === 'contacted'
                                ? 'bg-[#EBF2FA] border-[#AEC9EB] text-[#1B4B82]'
                                : 'bg-[#FAF0E6] border-[#E8D1BE] text-[#8C4614]'
                            }`}
                          >
                            <option value="new">Nouveau</option>
                            <option value="contacted">Contacté</option>
                            <option value="completed">Terminé</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteDemo(demo.id)}
                            className="p-1.5 text-[#7A746B] hover:text-[#963E3E] transition-colors cursor-pointer"
                            title="Supprimer la demande"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {demoRequests.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#7A746B]">
                          Aucune demande de démonstration enregistrée pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* PRODUCT CREATE / EDIT MODAL */}
      {(isCreatingProduct || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#E8E4DC] shadow-2xl p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
              <h3 className="font-serif text-2xl font-normal text-[#141414]">
                {editingProduct ? `Modifier "${editingProduct.name}"` : 'Créer un Nouveau Produit'}
              </h3>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreatingProduct(false);
                }}
                className="p-1 text-[#7A746B] hover:text-[#141414]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                  Nom du Produit *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="ex: Manteau Long Laine Peignée"
                  className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs focus:outline-hidden focus:border-[#141414]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                    Référence SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#141414]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                    Statut Boutique *
                  </label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value as any })}
                    className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs font-semibold focus:outline-hidden focus:border-[#141414]"
                  >
                    <option value="publish">Publié (visible par les clients)</option>
                    <option value="draft">Brouillon (masqué du catalogue)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                    Prix régulier (€) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={productForm.regular_price || ''}
                    onChange={(e) => setProductForm({
                      ...productForm,
                      regular_price: parseFloat(e.target.value),
                      price: productForm.sale_price || parseFloat(e.target.value)
                    })}
                    className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs tabular-nums focus:outline-hidden focus:border-[#141414]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                    Prix soldé (€) (Optionnel)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={productForm.sale_price || ''}
                    onChange={(e) => {
                      const val = e.target.value ? parseFloat(e.target.value) : null;
                      setProductForm({
                        ...productForm,
                        sale_price: val,
                        price: val || productForm.regular_price || 0
                      });
                    }}
                    placeholder="Laisser vide si aucun"
                    className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs tabular-nums focus:outline-hidden focus:border-[#141414]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                    Quantité en Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.stock_quantity ?? 10}
                    onChange={(e) => setProductForm({ ...productForm, stock_quantity: parseInt(e.target.value, 10) })}
                    className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs tabular-nums focus:outline-hidden focus:border-[#141414]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                  Description détaillée
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-white border border-[#DDD7CC] p-3 text-xs focus:outline-hidden focus:border-[#141414]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                    Matière d'exception
                  </label>
                  <input
                    type="text"
                    value={productForm.material || ''}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    placeholder="ex: 100% Cachemire peigné"
                    className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs focus:outline-hidden focus:border-[#141414]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                    Atelier & Origine
                  </label>
                  <input
                    type="text"
                    value={productForm.origin || ''}
                    onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                    placeholder="ex: Confectionné à Milan"
                    className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs focus:outline-hidden focus:border-[#141414]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1">
                  URL Image principale
                </label>
                <input
                  type="text"
                  value={productForm.images?.[0]?.src || ''}
                  onChange={(e) => setProductForm({
                    ...productForm,
                    images: [{ id: 1, src: e.target.value, alt: productForm.name || '' }]
                  })}
                  placeholder="/images/... ou https://..."
                  className="w-full bg-white border border-[#DDD7CC] px-3 py-2 text-xs focus:outline-hidden focus:border-[#141414]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E8E4DC]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingProduct(false);
                  }}
                  className="px-4 py-2 text-xs uppercase font-semibold tracking-wider border border-[#DDD7CC] hover:border-[#141414]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-[#141414] text-[#FAF8F5] px-6 py-2 text-xs uppercase font-semibold tracking-wider hover:bg-[#2A2A2A]"
                >
                  {editingProduct ? 'Enregistrer les modifications' : 'Créer le produit'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* VIEW ORDER DETAILS MODAL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#FAF8F5] border border-[#E8E4DC] shadow-2xl p-6 sm:p-8 my-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <div>
                <h3 className="font-serif text-2xl font-normal text-[#141414]">
                  Commande {viewingOrder.number}
                </h3>
                <span className="text-xs text-[#7A746B]">
                  Date : {new Date(viewingOrder.date_created).toLocaleString('fr-FR')}
                </span>
              </div>
              <button onClick={() => setViewingOrder(null)} className="p-1 text-[#7A746B] hover:text-[#141414]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#59554E]">
              <div className="bg-white p-4 border border-[#E8E4DC] space-y-2">
                <span className="font-semibold uppercase tracking-wider text-[#141414] block">Client & Livraison</span>
                <p><strong>Nom :</strong> {viewingOrder.billing.first_name} {viewingOrder.billing.last_name}</p>
                <p><strong>Email :</strong> {viewingOrder.billing.email}</p>
                <p><strong>Téléphone :</strong> {viewingOrder.billing.phone}</p>
                <p><strong>Adresse :</strong> {viewingOrder.shipping.address_1}, {viewingOrder.shipping.postcode} {viewingOrder.shipping.city}, {viewingOrder.shipping.country}</p>
                <p><strong>Mode de livraison :</strong> {viewingOrder.shipping_method}</p>
                <p><strong>Règlement :</strong> {viewingOrder.payment_method_title}</p>
              </div>

              <div className="bg-white p-4 border border-[#E8E4DC] space-y-3">
                <span className="font-semibold uppercase tracking-wider text-[#141414] block">Articles Commandés</span>
                <div className="divide-y divide-[#E8E4DC]">
                  {viewingOrder.line_items.map((it, idx) => (
                    <div key={idx} className="py-2 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-[#141414]">{it.name}</span>
                        <span className="block text-[11px] text-[#7A746B]">{it.size} · {it.color} (Quantité: {it.quantity})</span>
                      </div>
                      <span className="font-semibold tabular-nums text-[#141414]">{it.total} €</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#E8E4DC] flex justify-between font-bold text-sm text-[#141414]">
                  <span>Total Réglé</span>
                  <span className="tabular-nums">{viewingOrder.total} €</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setViewingOrder(null)}
                className="bg-[#141414] text-[#FAF8F5] px-6 py-2 text-xs uppercase font-semibold tracking-wider"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

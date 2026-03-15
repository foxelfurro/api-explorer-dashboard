import { useState, useEffect, useCallback } from 'react';
import { getCatalog, createCatalogProduct, updateCatalogProduct } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  sku: string;
  name: string;
  suggested_price: number;
  brand_id: number;
  image_url: string;
  [key: string]: unknown;
}

const emptyForm = { sku: '', name: '', suggested_price: 0, brand_id: 0, image_url: '' };

const AdminCatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slideOver, setSlideOver] = useState<'add' | 'edit' | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCatalog();
      setProducts(Array.isArray(data) ? data : data.data || data.products || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditProduct(null);
    setSlideOver('add');
  };

  const openEdit = (p: Product) => {
    setForm({ sku: p.sku, name: p.name, suggested_price: p.suggested_price, brand_id: p.brand_id, image_url: p.image_url });
    setEditProduct(p);
    setSlideOver('edit');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (slideOver === 'add') {
        await createCatalogProduct({ ...form, suggested_price: Number(form.suggested_price), brand_id: Number(form.brand_id) });
        toast({ title: 'Product created' });
      } else if (editProduct) {
        await updateCatalogProduct(editProduct.id, { ...form, suggested_price: Number(form.suggested_price), brand_id: Number(form.brand_id) });
        toast({ title: 'Product updated' });
      }
      setSlideOver(null);
      fetchProducts();
    } catch (err: unknown) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative h-full">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h1 className="text-sm font-semibold text-foreground">Admin Catalog</h1>
        <Button size="sm" onClick={openAdd} className="h-8 text-xs press-effect">Add Product</Button>
      </div>

      <div className="px-6 py-4">
        {error && <div className="mb-4 rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">{error}</div>}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="overflow-x-auto border border-border rounded">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">ID</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">SKU</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Price</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Brand ID</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Image</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => openEdit(p)}
                    className="border-b border-border hover:bg-accent/50 cursor-pointer transition-colors duration-150"
                  >
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                    <td className="px-3 py-3 font-mono text-xs">{p.sku}</td>
                    <td className="px-3 py-3">{p.name}</td>
                    <td className="px-3 py-3 text-right tabular-nums">${Number(p.suggested_price).toFixed(2)}</td>
                    <td className="px-3 py-3 font-mono text-xs">{p.brand_id}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground truncate max-w-[200px]">{p.image_url}</td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} className="px-3 py-8 text-center text-sm text-muted-foreground">No products</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over */}
      {slideOver && (
        <>
          <div className="fixed inset-0 bg-foreground/10 z-40" onClick={() => setSlideOver(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-[400px] bg-card border-l border-border z-50 flex flex-col animate-in slide-in-from-right duration-150">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold">{slideOver === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <button onClick={() => setSlideOver(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
            </div>
            <form onSubmit={handleSave} className="flex-1 px-6 py-4 space-y-4 overflow-auto">
              {(['sku', 'name', 'image_url'] as const).map((field) => (
                <div key={field} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{field.replace('_', ' ').toUpperCase()}</Label>
                  <Input
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="h-9 text-sm"
                    required
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">SUGGESTED PRICE</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.suggested_price}
                  onChange={(e) => setForm({ ...form, suggested_price: Number(e.target.value) })}
                  className="h-9 text-sm tabular-nums"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">BRAND ID</Label>
                <Input
                  type="number"
                  value={form.brand_id}
                  onChange={(e) => setForm({ ...form, brand_id: Number(e.target.value) })}
                  className="h-9 text-sm"
                  required
                />
              </div>
              <Button type="submit" disabled={saving} className="w-full h-9 text-sm press-effect">
                {saving ? 'Saving…' : slideOver === 'add' ? 'Create' : 'Update'}
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCatalogPage;

import { useState, useEffect, useCallback } from 'react';
import { getExplore, addToInventory } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface CatalogProduct {
  id: number;
  sku: string;
  name: string;
  suggested_price: number;
  image_url: string;
  [key: string]: unknown;
}

const VendorExplorePage = () => {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingId, setAddingId] = useState<number | null>(null);
  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState(0);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getExplore();
      setProducts(Array.isArray(data) ? data : data.data || data.products || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleAdd = async (catalogId: number) => {
    try {
      await addToInventory({ catalog_id: catalogId, stock, precio_personalizado: price });
      toast({ title: 'Added to inventory' });
      setAddingId(null);
      fetchProducts();
    } catch (err: unknown) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="px-6 py-4 border-b border-border">
        <h1 className="text-sm font-semibold text-foreground">Explore Catalog</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Products not yet in your inventory</p>
      </div>

      <div className="px-6 py-4">
        {error && <div className="mb-4 rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">{error}</div>}
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => (
              <div key={p.id} className="border border-border rounded bg-card p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{p.sku}</p>
                </div>
                <p className="text-sm tabular-nums text-foreground">${Number(p.suggested_price).toFixed(2)}</p>

                {addingId === p.id ? (
                  <div className="space-y-2 border-t border-border pt-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Stock</Label>
                      <Input type="number" min={1} value={stock} onChange={(e) => setStock(Number(e.target.value))} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Custom Price</Label>
                      <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="h-8 text-sm tabular-nums" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAdd(p.id)} className="h-7 text-xs flex-1 press-effect">Confirm</Button>
                      <Button size="sm" variant="outline" onClick={() => setAddingId(null)} className="h-7 text-xs press-effect">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => { setAddingId(p.id); setPrice(p.suggested_price); setStock(1); }} className="w-full h-8 text-xs press-effect">
                    Add to my inventory
                  </Button>
                )}
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full text-center py-8">No products available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorExplorePage;

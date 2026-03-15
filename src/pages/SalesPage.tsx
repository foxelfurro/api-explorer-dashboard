import { useState, useEffect, useCallback } from 'react';
import { getInventory, registerSale } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: number;
  stock: number;
  product?: { name: string };
  catalog?: { name: string };
  name?: string;
  product_name?: string;
  [key: string]: unknown;
}

const SalesPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventarioId, setInventarioId] = useState<number>(0);
  const [cantidad, setCantidad] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getInventory();
      const list = Array.isArray(data) ? data : data.data || data.inventory || [];
      setItems(list);
      if (list.length > 0 && !inventarioId) setInventarioId(list[0].id);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [inventarioId]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const getName = (item: InventoryItem) =>
    item.product?.name || item.catalog?.name || item.name || item.product_name || `Item #${item.id}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await registerSale({ inventario_id: inventarioId, cantidad });
      toast({ title: 'Sale registered' });
      setCantidad(1);
      fetchInventory();
    } catch (err: unknown) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="px-6 py-4 border-b border-border">
        <h1 className="text-sm font-semibold text-foreground">Register Sale</h1>
      </div>

      <div className="px-6 py-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading inventory…</p>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">INVENTORY ITEM</Label>
              <select
                value={inventarioId}
                onChange={(e) => setInventarioId(Number(e.target.value))}
                className="flex h-9 w-full rounded border border-input bg-card px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {getName(item)} (stock: {item.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">QUANTITY</Label>
              <Input
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="h-9 text-sm tabular-nums"
                required
              />
            </div>

            <Button type="submit" disabled={submitting || items.length === 0} className="h-9 text-sm press-effect">
              {submitting ? 'Registering…' : 'Register Sale'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SalesPage;

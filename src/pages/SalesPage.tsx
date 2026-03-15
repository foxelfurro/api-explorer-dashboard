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
  const [error, setError] = useState('');
  const [inventarioId, setInventarioId] = useState<number>(0);
  const [cantidad, setCantidad] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getInventory();
      const list = Array.isArray(data) ? data : data.data || data.inventory || [];
      setItems(list);

      if (list.length === 0) {
        setInventarioId(0);
        return;
      }

      setInventarioId((prevId) => (list.some((item: InventoryItem) => item.id === prevId) ? prevId : list[0].id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const getName = (item: InventoryItem) =>
    item.product?.name || item.catalog?.name || item.name || item.product_name || `Item #${item.id}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inventarioId || cantidad < 1) {
      toast({ title: 'Invalid sale data', description: 'Please select an item and a valid quantity.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      await registerSale({ inventario_id: inventarioId, cantidad });
      toast({ title: 'Sale registered' });
      setCantidad(1);
      await fetchInventory();
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
        {error && (
          <div className="mb-4 rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

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
                disabled={items.length === 0}
              >
                {items.length === 0 ? (
                  <option value={0}>No inventory available</option>
                ) : (
                  items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {getName(item)} (stock: {item.stock})
                    </option>
                  ))
                )}
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

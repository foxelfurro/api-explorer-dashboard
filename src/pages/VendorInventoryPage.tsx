import { useState, useEffect, useCallback } from 'react';
import { getInventory, updateInventoryItem } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: number;
  stock: number;
  precio_personalizado: number;
  product?: { name: string; sku: string };
  catalog?: { name: string; sku: string };
  name?: string;
  product_name?: string;
  [key: string]: unknown;
}

const VendorInventoryPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState(0);
  const [editPrice, setEditPrice] = useState(0);
  const { toast } = useToast();

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getInventory();
      setItems(Array.isArray(data) ? data : data.data || data.inventory || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const startEdit = (item: InventoryItem) => {
    setEditId(item.id);
    setEditStock(item.stock);
    setEditPrice(item.precio_personalizado);
  };

  const saveEdit = async () => {
    if (editId === null) return;
    try {
      await updateInventoryItem(editId, { stock: editStock, precio_personalizado: editPrice });
      toast({ title: 'Inventory updated' });
      setEditId(null);
      fetchInventory();
    } catch (err: unknown) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed', variant: 'destructive' });
    }
  };

  const getName = (item: InventoryItem) =>
    item.product?.name || item.catalog?.name || item.name || item.product_name || '—';

  return (
    <div>
      <div className="px-6 py-4 border-b border-border">
        <h1 className="text-sm font-semibold text-foreground">Vendor Inventory</h1>
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
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Product</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Stock</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Custom Price</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-accent/50 transition-colors duration-150">
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{item.id}</td>
                    <td className="px-3 py-3">{getName(item)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {editId === item.id ? (
                        <Input type="number" value={editStock} onChange={(e) => setEditStock(Number(e.target.value))} className="h-7 w-20 text-sm text-right ml-auto" />
                      ) : item.stock}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {editId === item.id ? (
                        <Input type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className="h-7 w-24 text-sm text-right ml-auto" />
                      ) : `$${Number(item.precio_personalizado).toFixed(2)}`}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {editId === item.id ? (
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" onClick={saveEdit} className="h-7 text-xs press-effect">Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditId(null)} className="h-7 text-xs press-effect">Cancel</Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEdit(item)} className="h-7 text-xs press-effect">Edit</Button>
                      )}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={5} className="px-3 py-8 text-center text-sm text-muted-foreground">No inventory items</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorInventoryPage;

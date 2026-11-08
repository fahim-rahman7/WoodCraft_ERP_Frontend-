import { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { useTenant } from '../../../context/TenantContext';

export const InventoryPage = () => {
  const { currentOrg } = useTenant();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      if (!currentOrg?._id) return;
      try {
        setLoading(true);
        // ব্যাকএন্ডের স্টক এন্ডপয়েন্ট কল করা হচ্ছে
        const res = await api.get('/inventory/stocks', {
          headers: { 'x-organization-id': currentOrg._id },
        });
        setStocks(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch inventory stocks:', err);
        setError('Failed to load inventory stock data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [currentOrg]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Inventory & Stock Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage raw wood materials, stock counts, warehouses, and batches for {currentOrg?.name}.
          </p>
        </div>
        <button
          onClick={() => alert('Add Stock / Item Modal will open here')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm"
        >
          + Add Stock Item
        </button>
      </div>

      {/* Main Content / Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Warehouse Stock Levels</h3>
          <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-medium">
            Total Items: {stocks.length}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading stock inventory...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 text-sm">{error}</div>
        ) : stocks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No stock records found in this organization.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-100 uppercase font-semibold">
                  <th className="p-4">Item Name / SKU</th>
                  <th className="p-4">Warehouse</th>
                  <th className="p-4">Batch Number</th>
                  <th className="p-4">Available Qty</th>
                  <th className="p-4">Reserved Qty</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stocks.map((stock) => (
                  <tr key={stock._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-medium text-slate-900">
                      <div>{stock.itemId?.name || 'Unknown Item'}</div>
                      <div className="text-[10px] text-slate-400">{stock.itemId?.sku || 'N/A'}</div>
                    </td>
                    <td className="p-4">{stock.warehouseId?.name || 'Main Warehouse'}</td>
                    <td className="p-4 font-mono text-slate-500 text-[11px]">
                      {stock.batchId?.batchNumber || stock.batchId || 'N/A'}
                    </td>
                    <td className="p-4 font-bold text-emerald-600">{stock.availableQuantity}</td>
                    <td className="p-4 font-medium text-amber-600">{stock.reservedQuantity || 0}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md font-semibold text-[10px]">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
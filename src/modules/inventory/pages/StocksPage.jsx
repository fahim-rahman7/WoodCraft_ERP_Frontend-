import { Boxes, Package, Plus, TriangleAlert, Warehouse } from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { useStockSummary } from '../hooks/stocks.hooks';
import {
  ActionButton,
  Badge,
  Card,
  DashboardShell,
  EmptyState,
  PageHeader,
  TableHeader,
} from '../../dashboard/components/shared';
import { formatNumber, humanize } from '../../dashboard/components/dashboardTheme';

// ---------- Presentation helpers (design only) ----------

// Groups the fetched stock rows by warehouse for the summary cards.
const summarizeByWarehouse = (stocks) =>
  Object.values(
    stocks.reduce((acc, stock) => {
      const id = stock.warehouseId?._id || stock.warehouseId || 'unknown';
      const unit = stock.itemId?.unit || 'UNITS';
      if (!acc[id]) {
        acc[id] = {
          id,
          name: stock.warehouseId?.name || 'Main Warehouse',
          code: stock.warehouseId?.code,
          location: stock.warehouseId?.location,
          lines: 0,
          batches: new Set(),
          totals: {},
        };
      }
      acc[id].lines += 1;
      if (stock.batchId) acc[id].batches.add(stock.batchId?._id || stock.batchId);
      acc[id].totals[unit] = (acc[id].totals[unit] || 0) + (Number(stock.availableQuantity) || 0);
      return acc;
    }, {})
  );

const itemSpecs = (item) => {
  const wood = item?.woodAttributes || {};
  const dims = [wood.thickness, wood.width, wood.length].every((v) => v != null)
    ? `${wood.thickness} × ${wood.width} × ${wood.length}`
    : null;
  return [wood.grade && `Grade ${wood.grade}`, dims, wood.moistureContent != null && `MC ${wood.moistureContent}%`]
    .filter(Boolean)
    .join(' · ');
};

const Qty = ({ value, unit, className = '' }) => (
  <span className={`font-mono font-semibold ${className}`}>
    {formatNumber(value, 2)}
    {unit && <span className="ml-1 text-[10px] font-normal text-[#8a7b6f]">{unit}</span>}
  </span>
);

export const StocksPage = () => {
  const { currentOrg } = useTenant();

  // stock data
  const { data: stocks = [], isPending: loading, isError } = useStockSummary(currentOrg?._id);
  const error = isError ? 'Failed to load inventory stock data.' : null;

  const warehouses = summarizeByWarehouse(stocks);

  return (
    <DashboardShell>
      {/* Page Header */}
      <PageHeader
        eyebrow="Inventory · Stock"
        tag="Balances"
        title="Stock Overview & Balances"
        subtitle={`Manage raw wood materials, stock counts, warehouses, and batches for ${currentOrg?.name || 'your workspace'}.`}
        actions={
          <ActionButton icon={Plus} onClick={() => alert('Add Stock / Item Modal will open here')}>
            Add Stock Item
          </ActionButton>
        }
      />

      {/* Warehouse Summary Cards */}
      {!loading && !error && warehouses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {warehouses.map((w) => {
            const [primary, ...others] = Object.entries(w.totals).sort((a, b) => b[1] - a[1]);
            return (
              <div
                key={w.id}
                className="flex flex-col rounded-xl border border-[#ece4da] bg-white p-4 shadow-[0_1px_2px_rgba(60,35,20,0.05)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b5d52]">
                      {w.location || 'Warehouse'}
                    </p>
                    <p className="mt-1 truncate font-serif text-base font-bold text-[#2a1a10]">{w.name}</p>
                    {w.code && <p className="font-mono text-[11px] text-[#8a7b6f]">{w.code}</p>}
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#f6f0e9] text-[#7a4a2a]">
                    <Warehouse className="h-4 w-4" />
                  </span>
                </div>

                <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[#8a7b6f]">Available</p>
                <p className="font-serif text-2xl font-bold text-[#2a1a10]">
                  {formatNumber(primary[1], 2)}
                  <span className="ml-1.5 text-base">{primary[0]}</span>
                </p>
                {others.length > 0 && (
                  <p className="mt-0.5 font-mono text-[11px] text-[#6b5d52]">
                    + {others.map(([unit, total]) => `${formatNumber(total, 2)} ${unit}`).join(' · ')}
                  </p>
                )}

                <div className="mt-auto pt-3">
                  <div className="flex items-center justify-between border-t border-dashed border-[#ece4da] pt-2.5 font-mono text-[10px] uppercase tracking-wider text-[#8a7b6f]">
                    <span>{w.lines} stock lines</span>
                    <span>{w.batches.size} batches</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Content / Stock Table */}
      <Card
        title="Warehouse Stock Levels"
        icon={Boxes}
        meta={<Badge tone="neutral">Total Items: {stocks.length}</Badge>}
        bodyClassName="p-0"
      >
        {loading ? (
          <div className="divide-y divide-[#f1ebe3]">
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className="flex animate-pulse items-center gap-6 px-5 py-4">
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 rounded bg-[#efe7dd]" />
                  <div className="h-3 w-1/5 rounded bg-[#f3ede6]" />
                </div>
                <div className="h-5 w-24 rounded bg-[#f3ede6]" />
                <div className="h-4 w-16 rounded bg-[#efe7dd]" />
                <div className="h-4 w-16 rounded bg-[#efe7dd]" />
              </div>
            ))}
            <p className="px-5 py-3 text-center font-mono text-[11px] text-[#8a7b6f]">Loading stock inventory...</p>
          </div>
        ) : error ? (
          <div className="p-5">
            <div className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              <TriangleAlert className="h-4 w-4" />
              {error}
            </div>
          </div>
        ) : stocks.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={Package} title="No stock records found in this organization." />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <TableHeader
                  columns={[
                    { label: 'Item & Specifications' },
                    { label: 'Type / Species' },
                    { label: 'Warehouse' },
                    { label: 'Batch Number' },
                    { label: 'Physical Total', className: 'text-right' },
                    { label: 'Reserved Qty', className: 'text-right' },
                    { label: 'Available Qty', className: 'text-right' },
                    { label: 'Status' },
                  ]}
                />
                <tbody className="divide-y divide-[#f1ebe3]">
                  {stocks.map((stock) => {
                    const unit = stock.itemId?.unit;
                    const specs = itemSpecs(stock.itemId);
                    return (
                      <tr key={stock._id} className="align-top transition-colors hover:bg-[#fbf8f4]">
                        <td className="px-5 py-3.5">
                          <p className="font-serif font-bold text-[#2a1a10]">{stock.itemId?.name || 'Unknown Item'}</p>
                          <p className="font-mono text-[11px] text-[#8a7b6f]">SKU: {stock.itemId?.sku || 'N/A'}</p>
                          {specs && <p className="mt-0.5 text-[11px] text-[#6b5d52]">{specs}</p>}
                        </td>
                        <td className="px-5 py-3.5">
                          {stock.itemId?.itemType ? (
                            <Badge tone="neutral">{humanize(stock.itemId.itemType)}</Badge>
                          ) : (
                            <span className="text-[#a89888]">—</span>
                          )}
                          {stock.itemId?.woodAttributes?.species && (
                            <p className="mt-1 text-[11px] italic text-[#6b5d52]">{stock.itemId.woodAttributes.species}</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-[#2a1a10]">{stock.warehouseId?.name || 'Main Warehouse'}</p>
                          {stock.warehouseId?.code && (
                            <p className="font-mono text-[11px] text-[#8a7b6f]">{stock.warehouseId.code}</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="rounded border border-[#e2d6c8] bg-[#f6f0e9] px-1.5 py-0.5 font-mono text-[11px] text-[#5a3e2b]">
                            {stock.batchId?.batchNumber || stock.batchId || 'N/A'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Qty value={stock.quantity} unit={unit} className="text-[#2a1a10]" />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Qty value={stock.reservedQuantity || 0} unit={unit} className="text-[#b4532a]" />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Qty value={stock.availableQuantity} unit={unit} className="text-emerald-700" />
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge tone="green">ACTIVE</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[#f1ebe3] px-5 py-3 font-mono text-[11px] text-[#8a7b6f]">
              Showing {stocks.length} tracked inventory {stocks.length === 1 ? 'line' : 'lines'}
            </div>
          </>
        )}
      </Card>
    </DashboardShell>
  );
};

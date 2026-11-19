import { Bar } from 'react-chartjs-2';
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  ClipboardList,
  Factory,
  Gauge,
  Hourglass,
  Package,
  TriangleAlert,
  Truck,
} from 'lucide-react';
import {
  Badge,
  Card,
  DashboardShell,
  DonutChart,
  EmptyState,
  KpiCard,
  KpiGrid,
  LegendDot,
  PageHeader,
  ProgressBar,
  SectionLabel,
  StackedBar,
  StatTile,
  TableHeader,
} from './shared';
import {
  COLORS,
  CHART_SERIES,
  barOptions,
  formatCurrency,
  formatNumber,
  formatPercent,
  humanize,
  movementDirection,
  timeAgo,
  toneFor,
} from './dashboardTheme';

// Matches the backend low-stock rule (availableQuantity <= 10).
const LOW_STOCK_THRESHOLD = 10;

const WIP_STATUSES = ['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];
const WIP_COLORS = {
  OPEN: COLORS.sand,
  IN_PROGRESS: COLORS.brown,
  ON_HOLD: COLORS.tan,
  COMPLETED: COLORS.walnut,
  CANCELLED: COLORS.rust,
};

const sum = (list, pick) => list.reduce((total, item) => total + (Number(pick(item)) || 0), 0);

export const ManagerDashboardView = ({ data, org }) => {
  const activeWorkOrders = data?.production?.activeWorkOrders || [];
  const wipSummary = data?.production?.wipSummary || [];
  const lowStockItems = data?.inventoryAlerts?.lowStockItems || [];
  const recentMovements = data?.inventoryAlerts?.recentMovements || [];
  const recentPOs = data?.procurement?.recentPurchaseOrders || [];
  const activeSuppliers = data?.procurement?.activeSuppliersCount || 0;

  // Production / WIP figures
  const wipByStatus = WIP_STATUSES.map(
    (status) =>
      wipSummary.find((w) => w._id === status) || {
        _id: status,
        count: 0,
        totalQuantityIn: 0,
        totalCompleted: 0,
      }
  );
  const wipBatches = sum(wipSummary, (w) => w.count);
  const wipIn = sum(wipSummary, (w) => w.totalQuantityIn);
  const wipDone = sum(wipSummary, (w) => w.totalCompleted);
  const wipYield = wipIn ? (wipDone / wipIn) * 100 : 0;

  const inProgressOrders = activeWorkOrders.filter((w) => w.status === 'IN_PROGRESS').length;
  const pendingOrders = activeWorkOrders.filter((w) => w.status === 'PENDING').length;

  // Inventory & procurement figures
  const outOfStock = lowStockItems.filter((i) => (Number(i.availableQuantity) || 0) <= 0).length;
  const pendingPOs = recentPOs.filter((p) => ['DRAFT', 'PENDING'].includes(p.status)).length;
  const poValue = sum(recentPOs, (p) => p.totalAmount);

  const poStatusItems = Object.entries(
    recentPOs.reduce((acc, po) => {
      acc[po.status] = (acc[po.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ label: humanize(status), value: count }));

  const wipChart = {
    labels: wipByStatus.map((w) => humanize(w._id)),
    datasets: [
      {
        label: 'Quantity in',
        data: wipByStatus.map((w) => w.totalQuantityIn),
        backgroundColor: COLORS.sand,
        borderRadius: 4,
        maxBarThickness: 36,
      },
      {
        label: 'Completed',
        data: wipByStatus.map((w) => w.totalCompleted),
        backgroundColor: COLORS.brown,
        borderRadius: 4,
        maxBarThickness: 36,
      },
    ],
  };

  return (
    <DashboardShell>
      <PageHeader
        eyebrow="Plant Monitoring & Yard Telemetry"
        tag="Live Feed"
        title="Factory Operations Dashboard"
        subtitle={`${org?.name || 'Your workspace'} — production floor, timber reserves and procurement in one view.`}
      />

      <KpiGrid>
        <KpiCard
          label="Low-Stock Alert"
          badge={outOfStock > 0 ? 'Critical' : lowStockItems.length > 0 ? 'Low' : 'OK'}
          badgeTone={outOfStock > 0 ? 'red' : lowStockItems.length > 0 ? 'amber' : 'green'}
          value={formatNumber(lowStockItems.length)}
          unit="Items"
          alert={lowStockItems.length > 0}
          sub={`At or below ${LOW_STOCK_THRESHOLD} units`}
          footer={`${formatNumber(outOfStock)} out of stock`}
        />
        <KpiCard
          label="In Production"
          badge="Active"
          badgeTone="brown"
          value={formatNumber(activeWorkOrders.length)}
          unit="Orders"
          sub={`${inProgressOrders} in progress · ${pendingOrders} pending`}
        />
        <KpiCard
          label="WIP Yield"
          value={formatPercent(wipYield)}
          sub={`${formatNumber(wipDone)} of ${formatNumber(wipIn)} units completed`}
          footer={`${formatNumber(wipBatches)} WIP batches`}
        />
        <KpiCard
          label="Pending POs"
          badge={pendingPOs > 0 ? 'Pending' : undefined}
          badgeTone="amber"
          value={formatNumber(pendingPOs)}
          unit="Orders"
          sub={`${formatCurrency(poValue)} in recent orders`}
          footer={`${recentPOs.length} recent purchase orders`}
        />
        <KpiCard
          label="Active Suppliers"
          value={formatNumber(activeSuppliers)}
          unit="Vendors"
          sub="Approved supplier network"
        />
      </KpiGrid>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card
          title="Production Status & WIP Output"
          icon={Factory}
          meta={<span>Yield: {formatPercent(wipYield)}</span>}
          className="xl:col-span-2"
        >
          <div className="rounded-lg border border-[#ece4da] bg-[#fbf8f4] p-4">
            <div className="flex flex-wrap justify-between gap-2 font-mono text-[11px] text-[#5a3e2b]">
              <span>Open: {wipByStatus[0].count} batches</span>
              <span>In progress: {wipByStatus[1].count} batches</span>
              <span>Completed: {wipByStatus[3].count} batches</span>
            </div>
            <div className="mt-2.5">
              <StackedBar
                segments={wipByStatus.map((w) => ({
                  label: humanize(w._id),
                  value: w.count,
                  color: WIP_COLORS[w._id],
                }))}
              />
            </div>
            <div className="mt-2.5 flex flex-wrap gap-4">
              {wipByStatus.map((w) => (
                <LegendDot key={w._id} color={WIP_COLORS[w._id]} label={humanize(w._id)} />
              ))}
            </div>
          </div>

          <SectionLabel className="mt-6">WIP quantity by stage (units)</SectionLabel>
          <div className="mt-2 h-72">
            <Bar data={wipChart} options={barOptions()} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatTile icon={Gauge} label="Overall yield" value={`${formatPercent(wipYield)} efficiency`} />
            <StatTile
              icon={Hourglass}
              label="Still in process"
              value={`${formatNumber(Math.max(0, wipIn - wipDone))} units`}
            />
          </div>
        </Card>

        <Card title="Procurement Pipeline" icon={Truck} meta={<span>{formatCurrency(poValue)}</span>}>
          {recentPOs.length === 0 ? (
            <EmptyState icon={Truck} title="No purchase orders yet" text="New POs will appear here." />
          ) : (
            <>
              <DonutChart
                centerValue={formatNumber(recentPOs.length)}
                centerLabel="Recent POs"
                colors={CHART_SERIES}
                items={poStatusItems}
              />
              <ul className="mt-5 divide-y divide-dashed divide-[#ece4da] border-t border-dashed border-[#ece4da]">
                {recentPOs.map((po) => (
                  <li key={po._id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs font-semibold text-[#2a1a10]">
                        {po.purchaseOrderNumber || '—'}
                      </p>
                      <p className="text-[11px] text-[#8a7b6f]">{timeAgo(po.orderDate || po.createdAt)}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge tone={toneFor(po.status)}>{humanize(po.status)}</Badge>
                      <span className="font-mono text-[11px] text-[#5a3e2b]">
                        {formatCurrency(po.totalAmount)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>

      <Card
        title="Low-Stock Watchlist"
        icon={TriangleAlert}
        meta={
          <>
            <Badge tone={outOfStock > 0 ? 'red' : 'amber'}>
              {outOfStock} Critical / {lowStockItems.length} Low
            </Badge>
            <span>Auto threshold ≤ {LOW_STOCK_THRESHOLD} units</span>
          </>
        }
        bodyClassName="p-0"
      >
        {lowStockItems.length === 0 ? (
          <div className="p-5">
            <EmptyState icon={Package} title="All stock levels are healthy" text="Nothing is below the alert threshold." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <TableHeader
                columns={[
                  { label: 'Item & SKU' },
                  { label: 'Warehouse' },
                  { label: 'Available', className: 'text-right' },
                  { label: 'Reserved', className: 'text-right' },
                  { label: 'Buffer level', className: 'w-40' },
                  { label: 'Status' },
                ]}
              />
              <tbody className="divide-y divide-[#f1ebe3]">
                {lowStockItems.map((item) => {
                  const qty = Number(item.availableQuantity) || 0;
                  const critical = qty <= 0;
                  return (
                    <tr key={item._id} className="hover:bg-[#fbf8f4]">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-[#2a1a10]">{item.itemId?.name || 'Unnamed item'}</p>
                        <p className="font-mono text-[11px] text-[#8a7b6f]">SKU: {item.itemId?.sku || '—'}</p>
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone="neutral">{item.warehouseId?.name || item.warehouseId?.code || '—'}</Badge>
                      </td>
                      <td
                        className={`px-5 py-3 text-right font-mono font-semibold ${critical ? 'text-red-600' : 'text-[#b4532a]'}`}
                      >
                        {formatNumber(qty, 2)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-[#5a3e2b]">
                        {formatNumber(item.reservedQuantity, 2)}
                      </td>
                      <td className="px-5 py-3">
                        <ProgressBar value={qty} max={LOW_STOCK_THRESHOLD} tone={critical ? 'red' : 'amber'} />
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={critical ? 'red' : 'amber'}>{critical ? 'Critical' : 'Low'}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          title="Active Work Orders"
          icon={ClipboardList}
          meta={<Badge tone="brown">{activeWorkOrders.length} Active</Badge>}
        >
          {activeWorkOrders.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No active work orders" text="Pending and in-progress orders show up here." />
          ) : (
            <ul className="space-y-3">
              {activeWorkOrders.map((wo) => {
                const target = Number(wo.targetQuantity) || 0;
                const done = Number(wo.completedQuantity) || 0;
                return (
                  <li key={wo._id} className="rounded-lg border border-[#ece4da] bg-[#fbf8f4] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[#2a1a10]">{wo.workOrderNumber}</span>
                          <Badge tone={toneFor(wo.status)}>{humanize(wo.status)}</Badge>
                        </div>
                        <p className="mt-1 truncate text-xs text-[#6b5d52]">
                          {wo.operationName || 'Operation'}
                          {wo.sequence ? ` · Step ${wo.sequence}` : ''}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] text-[#8a7b6f]">{timeAgo(wo.createdAt)}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <ProgressBar value={done} max={target} />
                      <span className="shrink-0 font-mono text-[11px] text-[#5a3e2b]">
                        {formatNumber(done, 2)} / {formatNumber(target, 2)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title="Recent Stock Movements" icon={Activity} meta={<span>Live ledger log</span>}>
          {recentMovements.length === 0 ? (
            <EmptyState icon={Activity} title="No stock movements yet" text="Receipts, issues and transfers appear here." />
          ) : (
            <ul className="divide-y divide-dashed divide-[#ece4da]">
              {recentMovements.map((m) => {
                const direction = movementDirection(m);
                const inbound = direction > 0;
                return (
                  <li key={m._id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                        inbound ? 'bg-emerald-50 text-emerald-700' : 'bg-[#f6f0e9] text-[#b4532a]'
                      }`}
                    >
                      {inbound ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-mono text-sm font-semibold ${inbound ? 'text-emerald-700' : 'text-[#b4532a]'}`}
                        >
                          {inbound ? '+' : '−'} {formatNumber(Math.abs(Number(m.quantity) || 0), 2)}
                        </span>
                        <Badge tone="neutral">{humanize(m.movementType)}</Badge>
                        <span className="truncate text-sm font-semibold text-[#2a1a10]">
                          {m.itemId?.name || 'Item'}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#8a7b6f]">
                        {m.referenceType ? `${humanize(m.referenceType)} · ` : ''}
                        Balance after: {formatNumber(m.balanceAfter, 2)}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-[#8a7b6f]">{timeAgo(m.createdAt)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
};

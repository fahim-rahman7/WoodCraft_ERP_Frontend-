export const ManagerDashboardView = ({ data, org }) => {
    const lowStockItems = data?.inventoryAlerts?.lowStockItems || [];
    const activeWorkOrders = data?.production?.activeWorkOrders || [];
  
    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-1">{org?.name} - Operations & Production ⚙️</h2>
          <p className="text-slate-300 text-sm">Monitor day-to-day manufacturing, inventory levels, and material alerts.</p>
        </div>
  
        {/* Grid Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">⚠️ Inventory & Low Stock Alerts</h3>
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-400">No low stock items right now.</p>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item._id} className="p-3 bg-red-50/50 border border-red-100 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{item.itemId?.name}</span>
                      <span className="text-slate-500 ml-2">({item.warehouseId?.name})</span>
                    </div>
                    <span className="font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-md">
                      Qty: {item.availableQuantity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          {/* Active Work Orders */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">🏭 Active Work Orders</h3>
            {activeWorkOrders.length === 0 ? (
              <p className="text-xs text-slate-400">No active work orders found.</p>
            ) : (
              <div className="space-y-3">
                {activeWorkOrders.map((wo) => (
                  <div key={wo._id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{wo.workOrderNumber}</span>
                      <div className="text-[10px] text-slate-500">Target: {wo.targetQuantity}</div>
                    </div>
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {wo.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
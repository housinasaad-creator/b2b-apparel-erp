import React, { useState } from 'react';
import { Header, ProgressBar, Modal, Alert, SmartOrderForm } from '../components';
import { manufacturingOrders as initialOrders, inventoryItems as initialInventory } from '../data';
import { ManufacturingOrder, Material, InventoryItem } from '../types';
import { ChevronDown, Plus, Trash2, Edit } from 'lucide-react';
import { useI18n } from '../i18n';

const stageColors = {
  Pending: 'bg-slate-100 text-slate-700',
  Cutting: 'bg-blue-100 text-blue-700',
  Sewing: 'bg-purple-100 text-purple-700',
  QA_Inspection: 'bg-orange-100 text-orange-700',
  Packaging: 'bg-green-100 text-green-700',
  Completed: 'bg-emerald-100 text-emerald-700',
};

export const Manufacturing: React.FC = () => {
  const { t, td } = useI18n();
  const [orders, setOrders] = useState<ManufacturingOrder[]>(initialOrders);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [selectedOrder, setSelectedOrder] = useState<ManufacturingOrder | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ManufacturingOrder | null>(null);
  const [lowStockWarning, setLowStockWarning] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');

  const stageLabels: { [key: string]: string } = {
    Pending: t('stagePending'),
    Cutting: t('stageCutting'),
    Sewing: t('stageSewing'),
    QA_Inspection: t('stageQA'),
    Packaging: t('stagePackaging'),
    Completed: t('stageCompleted'),
  };

  // Inventory check
  const checkInventory = (materials: Material[]): { canProceed: boolean; message: string } => {
    const warnings: string[] = [];

    for (const material of materials) {
      const inventoryItem = inventory.find(
        (item) => item.name.toLowerCase() === material.name.toLowerCase()
      );

      if (!inventoryItem) {
        warnings.push(`⚠️ ${t('material')} "${td(material.name)}" ${t('notInStock')}`);
        continue;
      }

      if (inventoryItem.quantity < material.quantity) {
        warnings.push(
          `⚠️ ${t('material')} "${td(material.name)}" - ${t('availableWord')}: ${inventoryItem.quantity} ${td(material.unit)}، ${t('requiredWord')}: ${material.quantity} ${td(material.unit)}`
        );
      }
    }

    return {
      canProceed: warnings.length === 0,
      message: warnings.join('\n'),
    };
  };

  const handleAddOrder = (newOrder: ManufacturingOrder, materials: Material[]) => {
    const inventoryCheck = checkInventory(materials);

    if (!inventoryCheck.canProceed) {
      setLowStockWarning(inventoryCheck.message);
      return;
    }

    const updatedInventory = inventory.map((item) => {
      const materialUsed = materials.find(
        (m) => m.name.toLowerCase() === item.name.toLowerCase()
      );
      if (materialUsed) {
        return { ...item, quantity: item.quantity - materialUsed.quantity };
      }
      return item;
    });
    setInventory(updatedInventory);

    if (editingOrder) {
      setOrders(orders.map((o) => (o.id === newOrder.id ? newOrder : o)));
      setSuccessMessage(t('updateOrderSuccess'));
    } else {
      setOrders([...orders, newOrder]);
      setSuccessMessage(t('addOrderSuccess'));
    }

    setShowOrderForm(false);
    setEditingOrder(null);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleEditOrder = (order: ManufacturingOrder) => {
    setEditingOrder(order);
    setShowOrderForm(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    const orderToDelete = orders.find((o) => o.id === orderId);
    if (orderToDelete?.materials) {
      const updatedInventory = inventory.map((item) => {
        const materialUsed = orderToDelete.materials!.find(
          (m) => m.name.toLowerCase() === item.name.toLowerCase()
        );
        if (materialUsed) {
          return { ...item, quantity: item.quantity + materialUsed.quantity };
        }
        return item;
      });
      setInventory(updatedInventory);
    }

    setOrders(orders.filter((o) => o.id !== orderId));
    setSuccessMessage(t('deleteOrderSuccess'));
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const updateOrderQuantity = (orderId: string, newQuantity: number) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, quantity: newQuantity } : o
      )
    );
  };

  const totalProductionValue = orders.reduce((sum, order) => {
    const estimatedPrice = 25;
    return sum + order.quantity * estimatedPrice;
  }, 0);

  const filters = [t('filterAll'), t('filterPending'), t('filterInProduction'), t('filterCompleted')];

  return (
    <div className="space-y-8">
      <Header title={t('productionTitle')} />

      <div className="px-4 sm:px-8 py-6 space-y-6">
        {/* Warning Messages */}
        {lowStockWarning && (
          <Alert
            type="error"
            title={t('stockAlert')}
            message={lowStockWarning}
            onClose={() => setLowStockWarning('')}
          />
        )}

        {successMessage && (
          <Alert
            type="success"
            title={t('successTitle')}
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
        )}

        {/* Top Actions */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-all duration-200 transform hover:scale-105"
              >
                {filter}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setEditingOrder(null);
              setShowOrderForm(true);
              setLowStockWarning('');
            }}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-bold flex items-center gap-2"
          >
            <Plus size={20} />
            {t('addOrder')}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
            <p className="text-sm opacity-90">{t('totalOrders')}</p>
            <p className="text-3xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4">
            <p className="text-sm opacity-90">{t('completedCount')}</p>
            <p className="text-3xl font-bold">
              {orders.filter((o) => o.currentStage === 'Completed').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4">
            <p className="text-sm opacity-90">{t('inProductionCount')}</p>
            <p className="text-3xl font-bold">
              {orders.filter((o) => o.currentStage !== 'Completed' && o.currentStage !== 'Pending').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
            <p className="text-sm opacity-90">{t('totalValue')}</p>
            <p className="text-2xl font-bold">${totalProductionValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-bold whitespace-nowrap">{t('colOrderNo')}</th>
                  <th className="px-6 py-4 text-right text-sm font-bold whitespace-nowrap">{t('colProduct')}</th>
                  <th className="px-6 py-4 text-right text-sm font-bold whitespace-nowrap">{t('colQty')}</th>
                  <th className="px-6 py-4 text-right text-sm font-bold whitespace-nowrap">{t('colPrice')}</th>
                  <th className="px-6 py-4 text-right text-sm font-bold whitespace-nowrap">{t('colTotal')}</th>
                  <th className="px-6 py-4 text-right text-sm font-bold whitespace-nowrap">{t('colStage')}</th>
                  <th className="px-6 py-4 text-right text-sm font-bold whitespace-nowrap">{t('colProgress')}</th>
                  <th className="px-6 py-4 text-center text-sm font-bold whitespace-nowrap">{t('colAction')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => {
                  const estimatedPrice = 25;
                  const orderTotal = order.quantity * estimatedPrice;

                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-slate-50 transition-all duration-200 cursor-pointer">
                        <td className="px-6 py-4 font-bold text-indigo-600 whitespace-nowrap">{order.orderNumber}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">{td(order.productName)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={order.quantity}
                              onChange={(e) => updateOrderQuantity(order.id, parseInt(e.target.value))}
                              onClick={(e) => e.stopPropagation()}
                              className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
                            />
                            <span className="text-slate-600">{td(order.unit)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-green-600">${estimatedPrice}</td>
                        <td className="px-6 py-4 font-bold text-blue-600">${orderTotal.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ${stageColors[order.currentStage]}`}>
                            {stageLabels[order.currentStage]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-24">
                              <ProgressBar progress={order.progress} />
                            </div>
                            <span className="text-sm font-bold text-slate-900 w-12">
                              {order.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedOrder(expandedOrder === order.id ? null : order.id);
                              }}
                              className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200"
                            >
                              <ChevronDown
                                size={20}
                                className={`transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                              />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditOrder(order);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrder(order.id);
                              }}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Materials Row */}
                      {expandedOrder === order.id && order.materials && (
                        <tr className="bg-slate-50 border-t-2 border-indigo-300">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="bg-white rounded-lg p-4">
                              <h4 className="font-bold text-slate-900 mb-4">📦 {t('materialsUsed')}:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {order.materials.map((material) => (
                                  <div
                                    key={material.id}
                                    className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200"
                                  >
                                    <div>
                                      <p className="font-semibold text-slate-900">{td(material.name)}</p>
                                      <p className="text-sm text-slate-600">
                                        {material.quantity} {td(material.unit)}
                                      </p>
                                    </div>
                                    <div className="text-2xl">📦</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Smart Order Form Modal */}
      <SmartOrderForm
        isOpen={showOrderForm}
        onClose={() => {
          setShowOrderForm(false);
          setEditingOrder(null);
          setLowStockWarning('');
        }}
        onSubmit={handleAddOrder}
        editingOrder={editingOrder}
        inventory={inventory}
      />

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? td(selectedOrder.productName) : t('orderDetails')}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">{t('colOrderNo')}</p>
                <p className="text-lg font-bold text-slate-900">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">{t('colQty')}</p>
                <p className="text-lg font-bold text-slate-900">
                  {selectedOrder.quantity} {td(selectedOrder.unit)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-600 font-bold">{t('currentStage')}</p>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${stageColors[selectedOrder.currentStage]}`}>
                {stageLabels[selectedOrder.currentStage]}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-600 mb-2 font-bold">{t('materialsUsed')}</p>
              <div className="space-y-2">
                {selectedOrder.materials?.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{td(material.name)}</p>
                      <p className="text-sm text-slate-600">
                        {material.quantity} {td(material.unit)}
                      </p>
                    </div>
                    <div className="text-2xl">✓</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

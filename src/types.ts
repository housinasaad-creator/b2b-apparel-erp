// Data Types for ERP System

// Authentication & User Types
export type UserRole = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (action: string) => boolean;
}

// Alert/Notification Types
export type AlertType = 'info' | 'warning' | 'error' | 'success';
export type AlertCategory = 'inventory' | 'machine' | 'order' | 'system';

export interface Notification {
  id: string;
  type: AlertType;
  category: AlertCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface StatCard {
  title: string;
  value: number | string;
  unit?: string;
  icon: string;
  color: string;
  trend?: number;
}

export interface ChartData {
  name: string;
  value?: number;
  sales?: number;
  production?: number;
  efficiency?: number;
  availability?: number;
  quality?: number;
  oee?: number;
}

export interface ManufacturingOrder {
  id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  unit: string;
  currentStage: OrderStage;
  progress: number;
  startDate: string;
  expectedDate: string;
  materials?: Material[];
}

export type OrderStage = 'Pending' | 'Cutting' | 'Sewing' | 'QA_Inspection' | 'Packaging' | 'Completed';

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  unitCost: number;
  reorderPoint: number;
  status: 'Normal' | 'Critical' | 'Low';
}

export interface Machine {
  id: string;
  name: string;
  status: 'Running' | 'Idle' | 'Maintenance';
  efficiency: number;
  availability: number;
  quality: number;
  oee: number;
  productionRate: number;
  downtimeMinutes: number;
}

export interface PurchaseOrder {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  supplier: string;
  estimatedCost: number;
  status: 'Draft' | 'Pending' | 'Confirmed' | 'Delivered';
  createdDate: string;
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import CategoryList from './components/CategoryList';
import CreateProduct from './components/CreateCategory';
import CategoryDetails from './components/CategoryDetails';
import AnimalList from './components/AnimalList';
import AnimalDetails from './components/AnimalDetails';
import CreateAnimal from './components/CreateAnimal';
import CustomerList from './components/CustomerList';
import CreateCustomer from './components/CreateCustomer';
import CustomerDetails from './components/CustomerDetails';
import CreateAddress from './components/CreateAddress';
import AddressDetails from './components/AddressDetails';
import InventoryList from './components/InventoryList';
import InventoryAnimals from './components/InventoryAnimals';
import OrderList from './components/OrderList';
import OrderDetails from './components/OrderDetails';
import CreateOrder from './components/CreateOrder';
import PurchaseList from './components/PurchaseList';
import CreatePurchase from './components/CreatePurchase';
import CreateEvent from './components/CreateEvent';
import MilkProductionList from './components/MilkProductionList';
import { ThemeProvider } from './contexts/ThemeContext';
import { authService } from './services/authService';
import './App.css';
import GlobalToast from './components/GlobalToast';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <GlobalToast />
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes wrapped in Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="animals" element={<AnimalList />} />
            <Route path="animals/new" element={<CreateAnimal />} />
            <Route path="animals/:id" element={<AnimalDetails />} />
            <Route path="events/new" element={<CreateEvent />} />

            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/new" element={<CreateCustomer />} />
            <Route path="customers/:id" element={<CustomerDetails />} />

            <Route path="addresses/:id" element={<AddressDetails />} />
            <Route path="customers/:customerId/addresses/new" element={<CreateAddress />} />

            <Route path="inventory" element={<InventoryList />} />
            <Route path="inventory/:inventoryId/animals" element={<InventoryAnimals />} />

            <Route path="orders" element={<OrderList />} />
            <Route path="orders/new" element={<CreateOrder />} />
            <Route path="orders/:id" element={<OrderDetails />} />

            <Route path="category" element={<CategoryList />} />
            <Route path="category/new" element={<CreateProduct />} />
            <Route path="category/:id" element={<CategoryDetails />} />

            <Route path="purchase" element={<PurchaseList />} />
            <Route path="purchase/new" element={<CreatePurchase />} />

            <Route path="production/milk" element={<MilkProductionList />} />
          </Route>

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

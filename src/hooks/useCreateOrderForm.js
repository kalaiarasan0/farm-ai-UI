import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../services/customerService';
import { categoryService } from '../services/categoryService';
import { inventoryService } from '../services/inventoryService';
import { orderService } from '../services/orderService';
import { toastEventEmitter } from '../utils/toastEventEmitter';

export const useCreateOrderForm = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [addresses, setAddresses] = useState([]);

    const [formData, setFormData] = useState({
        customer_id: '',
        category_id: '',
        inventory_id: '',
        quantity: '',
        discount_value: '',
        discount_percent: '',
        unit_price: '',
        billing_address_id: '',
        shipping_address_id: '',
        shipping: '',
        tax: '',
    });

    const [sameAsBilling, setSameAsBilling] = useState(false);
    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [calculated, setCalculated] = useState({
        grossTotal: 0,
        netTotal: 0
    });

    // Fetch Lookups
    useEffect(() => {
        const fetchLookups = async () => {
            try {
                const [custRes, prodRes] = await Promise.all([
                    customerService.getCustomerLookup(),
                    categoryService.getCategoryLookups()
                ]);
                setCustomers(custRes);
                setCategories(prodRes);
            } catch (error) {
                console.error("Error fetching lookups:", error);
                toastEventEmitter.emit("Failed to load form data", "error");
            }
        };
        fetchLookups();
    }, []);

    // Fetch Addresses when Customer changes
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!formData.customer_id) {
                setAddresses([]);
                return;
            }
            try {
                const response = await customerService.getCustomerAddresses(formData.customer_id);
                setAddresses(response || []);
            } catch (error) {
                console.error("Error fetching addresses:", error);
                setAddresses([]);
            }
        };
        fetchAddresses();
    }, [formData.customer_id]);

    // Handle Same As Billing
    useEffect(() => {
        if (sameAsBilling) {
            setFormData(prev => ({
                ...prev,
                shipping_address_id: prev.billing_address_id
            }));
        }
    }, [sameAsBilling, formData.billing_address_id]);

    // Fetch Inventory when category changes
    useEffect(() => {
        const fetchInventory = async () => {
            if (!formData.category_id) {
                setInventory(null);
                setFormData(prev => ({ ...prev, inventory_id: '', unit_price: '' }));
                return;
            }

            const selectedCategory = categories.find(p => p.category_id === parseInt(formData.category_id));
            if (!selectedCategory) return;

            setLoading(true);
            try {
                // Use category ID for lookup as requested
                const response = await inventoryService.getInventoryByCategoryId(formData.category_id);

                if (response && response.length > 0) {
                    setInventory(response[0]);
                    setFormData(prev => ({
                        ...prev,
                        inventory_id: response[0].inventory_id,
                        unit_price: response[0].unit_price
                    }));
                } else {
                    setInventory(null);
                    setFormData(prev => ({ ...prev, unit_price: '' }));
                    toastEventEmitter.emit("No inventory found for this category", "warning");
                }
            } catch (error) {
                console.error("Error fetching inventory:", error);
                setInventory(null);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, [formData.category_id, categories]);

    // Calculations
    useEffect(() => {
        const qty = parseInt(formData.quantity) || 0;
        const unitPrice = parseFloat(formData.unit_price) || 0;
        const gross = qty * unitPrice;
        const discountVal = parseFloat(formData.discount_value) || 0;
        const tax = parseFloat(formData.tax) || 0;
        const shipping = parseFloat(formData.shipping) || 0;

        // Calculating item net total (gross - discount)
        const net = Math.max(0, gross - discountVal);

        // Order Total = Item Net Total + Tax + Shipping
        const orderTotal = net + tax + shipping;

        setCalculated({
            grossTotal: gross,
            netTotal: net,
            orderTotal: orderTotal
        });
    }, [formData.quantity, formData.unit_price, formData.discount_value, formData.tax, formData.shipping]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle discount logic specifically
        if (name === 'discount_value' || name === 'discount_percent') {
            const qty = parseInt(formData.quantity) || 0;
            const unitPrice = parseFloat(formData.unit_price) || 0;
            const gross = qty * unitPrice;

            if (name === 'discount_value') {
                const val = parseFloat(value) || 0;
                const percent = gross > 0 ? ((val / gross) * 100).toFixed(2) : 0;
                setFormData(prev => ({
                    ...prev,
                    discount_value: value,
                    discount_percent: percent
                }));
            } else {
                const percent = parseFloat(value) || 0;
                const val = gross > 0 ? ((gross * percent) / 100).toFixed(2) : 0;
                setFormData(prev => ({
                    ...prev,
                    discount_percent: value,
                    discount_value: val
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.customer_id || !formData.category_id || !formData.inventory_id || !formData.quantity) {
            toastEventEmitter.emit("Please fill all required fields", "warning");
            return;
        }

        if (!formData.billing_address_id || !formData.shipping_address_id) {
            toastEventEmitter.emit("Please select billing and shipping addresses", "warning");
            return;
        }

        const qty = parseInt(formData.quantity);
        // Note: We bypass strict inventory.quantity check if we want to allow backorders, 
        // but current logic enforces it. Keeping enforcement as per previous code.
        if (inventory && qty > inventory.quantity) {
            toastEventEmitter.emit(`Quantity cannot exceed available stock (${inventory.quantity})`, "error");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                customer_id: parseInt(formData.customer_id),
                billing_address_id: parseInt(formData.billing_address_id),
                shipping_address_id: parseInt(formData.shipping_address_id),
                shipping: parseFloat(formData.shipping) || 0,
                tax: parseFloat(formData.tax) || 0,
                discount: 0, // Order level discount is 0, using item level discount
                items: [
                    {
                        category_id: parseInt(formData.category_id),
                        inventory_id: parseInt(formData.inventory_id),
                        quantity: qty,
                        unit_price: parseFloat(formData.unit_price) || 0,
                        discount_value: parseFloat(formData.discount_value) || 0,
                        discount_percent: parseFloat(formData.discount_percent) || 0
                    }
                ]
            };

            await orderService.placeOrder(payload);
            toastEventEmitter.emit("Order placed successfully!", "success");
            navigate('/orders');
        } catch (error) {
            console.error("Error placing order:", error);
            toastEventEmitter.emit("Failed to place order", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return {
        customers,
        categories,
        addresses,
        formData,
        sameAsBilling,
        setSameAsBilling,
        inventory,
        loading,
        submitting,
        calculated,
        handleChange,
        handleSubmit,
        navigate // Returning this if the component needs to handle some navigation manually (e.g. back button)
    };
};

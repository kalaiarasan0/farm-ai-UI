import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toastEventEmitter } from '../utils/toastEventEmitter';
import { purchaseService } from '../services/purchaseServices';

export const useCreatePurchaseForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        material_name: '',
        type_of_material: '',
        purchase_date: new Date().toISOString().split('T')[0],
        notes: '',
        material_expiry_date: '',
        quantity: '',
        unit_price: '',
        gross_price: '',
        discount_amount: '',
        discount_percentage: '',
        total_price: '',
        batch_number: '',
        supplier: '',
        material_description: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Calculations
    useEffect(() => {
        const qty = parseInt(formData.quantity) || 0;
        const unitPrice = parseFloat(formData.unit_price) || 0;
        const gross = qty * unitPrice;

        let discountVal = parseFloat(formData.discount_amount) || 0;

        // If discount value is greater than gross, cap it? Or just valid logic.
        // Usually, we just calculate net.

        const net = Math.max(0, gross - discountVal);

        // We update the calculated fields in the state itself as per requirements to send them in payload?
        // The user request said: "calculate the gross price discount price or discount percentage like we did in create Order"
        // And the payload requires: total_price, gross_price, discount_amount, discount_percentage.
        // So we should keep them in sync in formData or derived state.

        // However, this useEffect might cause infinite loops if we setFormData inside it dependent on formData.
        // Better to handle calculation in handleChange or use a separate effect that only listens to specific fields
        // AND only updates if values are different.
    }, [formData.quantity, formData.unit_price, formData.discount_amount]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        // We will update the state, and then trigger calculation if needed.
        // But to ensure we have the latest state for calculation, we can calculate based on the new value immediately.

        let newFormData = { ...formData, [name]: value };

        if (['quantity', 'unit_price', 'discount_amount', 'discount_percentage'].includes(name)) {
            const qty = name === 'quantity' ? (parseInt(value) || 0) : (parseInt(formData.quantity) || 0);
            const unitPrice = name === 'unit_price' ? (parseFloat(value) || 0) : (parseFloat(formData.unit_price) || 0);

            const gross = qty * unitPrice;
            newFormData.gross_price = gross.toFixed(2);

            let discountAmount = parseFloat(newFormData.discount_amount) || 0;
            let discountPercent = parseFloat(newFormData.discount_percentage) || 0;

            if (name === 'discount_amount') {
                discountAmount = parseFloat(value) || 0;
                discountPercent = gross > 0 ? ((discountAmount / gross) * 100) : 0;
                newFormData.discount_percentage = discountPercent.toFixed(2);
            } else if (name === 'discount_percentage') {
                discountPercent = parseFloat(value) || 0;
                discountAmount = gross > 0 ? ((gross * discountPercent) / 100) : 0;
                newFormData.discount_amount = discountAmount.toFixed(2);
            } else {
                // quantity or unit_price changed, recalculate discount based on percentage if percentage exists, else amount?
                // Let's stick to holding percentage constant if it exists? Or amount?
                // In CreateOrder, they recalculate distinct values based on what was changed.
                // "if name is discount_value ... else if name is discount_percent"
                // If Quantity changes, gross changes. Should we keep discount % constant?
                // Let's keep discount AMOUNT constant unless it exceeds gross?
                // Actually, usually percentage is kept constant if quantity changes, but let's just update the GROSS and TOTAL for now
                // and let the user adjust discount if needed.
                // But wait, if I have 10% discount, and I double quantity, discount amount should double.
                // So keeping percentage constant is safer.

                if (discountPercent > 0) {
                    discountAmount = (gross * discountPercent) / 100;
                    newFormData.discount_amount = discountAmount.toFixed(2);
                }
            }

            const total = Math.max(0, gross - discountAmount);
            newFormData.total_price = total.toFixed(2);
        }

        setFormData(newFormData);
    };

    const handleBack = () => {
        navigate('/purchase'); // check route
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Validation?
        // quantity > 0
        if (parseInt(formData.quantity) <= 0) {
            toastEventEmitter.emit("Quantity must be a positive integer", "warning");
            setSubmitting(false);
            return;
        }

        try {
            await purchaseService.createPurchase({
                ...formData,
                quantity: parseInt(formData.quantity),
                unit_price: parseFloat(formData.unit_price),
                total_price: parseFloat(formData.total_price),
                gross_price: parseFloat(formData.gross_price),
                discount_amount: parseFloat(formData.discount_amount),
                discount_percentage: parseFloat(formData.discount_percentage)
            });
            toastEventEmitter.emit("Purchase created successfully", "success");
            navigate('/purchase');
        } catch (error) {
            console.error(error);
            toastEventEmitter.emit("Failed to create purchase", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return {
        formData,
        loading,
        submitting,
        handleChange,
        handleBack,
        handleSubmit
    };
};
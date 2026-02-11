import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import { toastEventEmitter } from '../utils/toastEventEmitter';

const GlobalToast = () => {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const unsubscribe = toastEventEmitter.subscribe((event) => {
            setToast(event);
        });

        return () => unsubscribe();
    }, []);

    if (!toast) return null;

    return (
        <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => setToast(null)}
        />
    );
};

export default GlobalToast;

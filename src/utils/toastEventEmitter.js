class ToastEventEmitter {
    constructor() {
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    emit(message, type = 'info', duration = 3000) {
        this.listeners.forEach(callback => callback({ message, type, duration }));
    }
}

export const toastEventEmitter = new ToastEventEmitter();

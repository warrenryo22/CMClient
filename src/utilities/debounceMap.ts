class DebounceMap {
    private timeouts: Record<string, ReturnType<typeof setTimeout>>;

    constructor() {
        this.timeouts = {};
    }

    debounce(key: string, callback: () => void, delay: number): void {
        if (this.timeouts[key]) {
            clearTimeout(this.timeouts[key]);
        }

        this.timeouts[key] = setTimeout(() => {
            callback();
            delete this.timeouts[key]; // cleanup
        }, delay);
    }

    clear(key: string): void {
        if (this.timeouts[key]) {
            clearTimeout(this.timeouts[key]);
            delete this.timeouts[key];
        }
    }

    clearAll(): void {
        Object.values(this.timeouts).forEach(timeoutId => clearTimeout(timeoutId));
        this.timeouts = {};
    }
}

export const debounceMap = new DebounceMap();

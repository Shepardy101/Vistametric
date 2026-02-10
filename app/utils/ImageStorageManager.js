const DB_NAME = 'DroneApp_ImageStorage';
const STORE_NAME = 'images';
const DB_VERSION = 1;

class ImageStorageManager {
    constructor() {
        this.db = null;
        this.initPromise = null;
    }

    async init() {
        if (typeof window === 'undefined') return null;

        if (this.initPromise) return this.initPromise;

        this.initPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error('Erro ao abrir IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async saveImage(id, data) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(data, id);

            request.onsuccess = () => resolve(id);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async getImage(id) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async deleteImage(id) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async clearObsoleteImages(activeIds) {
        await this.initPromise;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAllKeys();

            request.onsuccess = () => {
                const keys = request.result;
                const deletePromises = keys
                    .filter(key => !activeIds.includes(key))
                    .map(key => this.deleteImage(key));

                Promise.all(deletePromises).then(resolve).catch(reject);
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }
}

const storageManager = new ImageStorageManager();
export default storageManager;

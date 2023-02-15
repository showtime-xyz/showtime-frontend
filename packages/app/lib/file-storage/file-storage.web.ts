export class FileStorage {
  private readonly dbName: string;
  private readonly storeName: string;
  private db?: IDBDatabase;

  constructor(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
    const request = window.indexedDB.open(this.dbName, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: "id" });
      }
    };

    request.onerror = (error) => {
      console.error(error);
    };

    request.onsuccess = () => {
      this.db = request.result;
    };
  }

  public async saveFile(file: File, id: string) {
    return new Promise<any>((resolve) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const objectStore = transaction.objectStore(this.storeName);
        const object = { id: id, data: file };
        objectStore.delete(object.id);
        const addRequest = objectStore.add(object);

        addRequest.onerror = (e) => {
          console.error(e);
        };

        addRequest.onsuccess = () => {
          resolve(object.id);
        };
      }
    });
  }

  public async getFile(id: any) {
    return new Promise<File>((resolve) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], "readonly");
        const objectStore = transaction.objectStore(this.storeName);
        const getRequest = objectStore.get(id);

        getRequest.onerror = (e) => {
          console.error(e);
        };

        getRequest.onsuccess = () => {
          const file = (getRequest.result as { id: number; data: File })?.data;
          resolve(file);
        };
      }
    });
  }
}

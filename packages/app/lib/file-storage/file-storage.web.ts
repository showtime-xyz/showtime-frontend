import { Logger } from "app/lib/logger";

export class FileStorage {
  private readonly dbName: string;
  private db?: IDBDatabase;

  constructor(dbName: string) {
    this.dbName = dbName;
    this.getOrInitialiseDB();
  }

  getOrInitialiseDB() {
    return new Promise<IDBDatabase>((resolve) => {
      if (this.db) {
        resolve(this.db);
      } else {
        const request = window.indexedDB.open(this.dbName, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(this.dbName)) {
            db.createObjectStore(this.dbName, { keyPath: "id" });
          }
        };

        request.onerror = (error) => {
          Logger.error(error);
        };

        request.onsuccess = () => {
          this.db = request.result;
          resolve(request.result);
        };
      }
    });
  }

  public async saveFile(file: File, id: string) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<any>(async (resolve) => {
      if (!this.db) {
        this.db = await this.getOrInitialiseDB();
      }
      const transaction = this.db.transaction([this.dbName], "readwrite");
      const objectStore = transaction.objectStore(this.dbName);
      const object = { id: id, data: file };
      objectStore.delete(object.id);
      const addRequest = objectStore.add(object);

      addRequest.onerror = (e) => {
        Logger.error(e);
      };

      addRequest.onsuccess = () => {
        resolve(object.id);
      };
    });
  }

  public async clearStorage() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve) => {
      if (!this.db) {
        this.db = await this.getOrInitialiseDB();
      }
      const req = indexedDB.deleteDatabase(this.dbName);
      req.onsuccess = () => {
        resolve();
      };
    });
  }

  public async getFile(id: any) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<File>(async (resolve) => {
      if (!this.db) {
        this.db = await this.getOrInitialiseDB();
      }
      const transaction = this.db.transaction([this.dbName], "readonly");
      const objectStore = transaction.objectStore(this.dbName);
      const getRequest = objectStore.get(id);

      getRequest.onerror = (e) => {
        Logger.error(e);
      };

      getRequest.onsuccess = () => {
        const file = (getRequest.result as { id: number; data: File })?.data;
        resolve(file);
      };
    });
  }
}

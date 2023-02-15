export class FileStorage {
  private readonly dbName: string;
  private readonly storeName: string;
  private db?: IDBDatabase;

  constructor(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  public async saveFile(file: File, id: string) {}

  public async getFile(id: any) {}

  public async clearStorage() {}
}

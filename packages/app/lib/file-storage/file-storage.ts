/* eslint-disable unused-imports/no-unused-vars */
// @ts-nocheck
export class FileStorage {
  private readonly dbName: string;
  private db?: IDBDatabase;

  constructor(dbName: string) {
    this.dbName = dbName;
  }

  public async saveFile(file: File, id: string) {}

  public async getFile(id: any) {}

  public async clearStorage() {}
}

export type LocalStorageKeys = "LS_Route"|"LS_Route_Detail"|"LS_Settings";

class StorageClass {
  private getKey(key: LocalStorageKeys) {
    return key;
  }
  getLocal = (key: LocalStorageKeys) => localStorage.getItem(this.getKey(key));

  setLocal = (key: LocalStorageKeys, value: string) =>
    localStorage.setItem(this.getKey(key), value);

  removeLocal = (key: LocalStorageKeys) =>
    localStorage.removeItem(this.getKey(key));

  clear = () => localStorage.clear();
}

export const Storage = new StorageClass();

export type LocalStorageKeys = "LS_Route";

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

export interface IStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

class LocalStorageAdapter  implements IStorageAdapter {
   public async getItem(key: string): Promise<string | null> {
      return localStorage.getItem(key);
   }
   
   public async setItem(key: string, value: string): Promise<void> {
      localStorage.setItem(key, value);
   }
   
   public async removeItem(key: string): Promise<void> {
      localStorage.removeItem(key);
   }
   
   public async clear(): Promise<void> {
      localStorage.clear();
   }
}

class SessionStorageAdapter   implements IStorageAdapter {
   public async getItem(key: string): Promise<string | null> {
      return sessionStorage.getItem(key);
   }
   
   public async setItem(key: string, value: string): Promise<void> {
      sessionStorage.setItem(key, value);
   }
   
   public async removeItem(key: string): Promise<void> {
      sessionStorage.removeItem(key);
   }
   
   public async clear(): Promise<void> {
      sessionStorage.clear();
   }
}

export class StorageAdapterFactory {
   private static readonly cache: Map<string, IStorageAdapter> = new Map();

   public static create(type : ('local' | 'session')): IStorageAdapter {
      if (StorageAdapterFactory.cache.has(type)) {
         return StorageAdapterFactory.cache.get(type)!;
      }
      
      if (type === 'local') {
         return StorageAdapterFactory.cache.set(type, new LocalStorageAdapter()).get(type)!;
      }

      if (type === 'session') {
        return StorageAdapterFactory.cache.set(type, new SessionStorageAdapter()).get(type)!;
      }

      throw new Error(`Storage adapter type "${type}" is not supported.`);
   }
}
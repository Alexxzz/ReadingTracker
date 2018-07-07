export interface IAsyncStorage {
  getItem(key: string, callback?: (error?: Error, result?: string) => void): Promise<string>;
  setItem(key: string, value: string, callback?: (error?: Error) => void): Promise<void>;
}

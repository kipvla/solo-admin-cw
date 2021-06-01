export interface CustomResponse<T> {
  serverRes: T;
  error: boolean;
}

export interface CustomAPIPromise<T> {
  (): Promise<CustomResponse<T>>;
}

export interface ReqOptions {
  [key: string]: () => Promise<{serverRes: any; error: boolean}>;
}

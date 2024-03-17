export interface iServerResponse {
  status: number;
  code: ServerCode;
  data?: any;
  msg?: string;
}

export enum ServerCode {
  Ok = 0,
  Err = -1,
}

export interface TokenPayload {
  userID: number;
  admin: boolean;
  username: string;
  mapUploader: boolean;
  exp: number;
  iat: number;
}

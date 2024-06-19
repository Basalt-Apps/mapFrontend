export interface TokenPayload {
  userID: number;
  admin: boolean;
  username: string;
  exp: number,
  iat: number
}

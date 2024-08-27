import { Request } from 'express';
export interface RefreshTokenPayload {
  userId: number;
  username: string;
  email: string;
  createdAt?: number;
  expiredAt?: number;
}
export interface AccessTokenPayload {
  userId: number;
  username: string;
  email: string;
  createdAt?: number;
  expiredAt?: number;
}
export interface CustomRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

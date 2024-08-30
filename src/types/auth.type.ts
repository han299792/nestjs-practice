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

export interface UserPublicDto {
  id: number;
  username: string;
  email: string;
}

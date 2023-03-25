import { JwtPayload } from 'jsonwebtoken';

export interface JWTPayload extends JwtPayload {
  id?: number,
  name?: string,
  email?: string
}
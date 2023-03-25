import { ExpressRequestInterface } from '@app/types/express.request.interface';
import { NestMiddleware, Injectable } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from 'dotenv';
import { UserService } from '../user.service';
import { JWTPayload } from '../types/jwtPayload.interface';

config();

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {    
    if (!req.headers.authorization) {
      req.user = null;
      next()
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const {id} = verify(token, process.env.SECRET_KEY) as JWTPayload;
      const user = await this.userService.findUserById(id)
      req.user = user
      next()
    } catch (err) {
      req.user = null; 
      next()
    }
  }
}
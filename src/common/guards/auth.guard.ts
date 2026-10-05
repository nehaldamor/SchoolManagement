import {
	CanActivate,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedUser {
	id: string;
	email: string;   
	role: string;
}

type AuthenticatedRequest = Request & { user: AuthenticatedUser };

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
		const authorization = request.headers.authorization;
		const bearerMatch = authorization?.match(/^Bearer\s+(\S+)$/i);  

		if (!bearerMatch) {
			throw new UnauthorizedException('Bearer token is required');
		}

		const secret = process.env.SECRET_KEY;
		if (!secret) {
			throw new InternalServerErrorException();
		}

		try {
			const payload = jwt.verify(bearerMatch[1], secret);
			if (
				typeof payload === 'string' ||
				!this.isAuthenticatedUser(payload)
			) {
				throw new UnauthorizedException('Invalid token payload');
			}

			request.user = {
				id: payload.id,
				email: payload.email,
				role: payload.role,
			};
			return true;
		}catch (error) {
			if (error instanceof UnauthorizedException){
				throw error;
			}
			throw new UnauthorizedException('Invalid or expired token');
		}
	}

	private isAuthenticatedUser(
		payload: string | JwtPayload,
	): payload is JwtPayload & AuthenticatedUser {
		return (
			typeof payload === 'object' &&
			typeof payload.id === 'string' &&
			typeof payload.email === 'string' &&
			typeof payload.role === 'string'
		);
	}
}

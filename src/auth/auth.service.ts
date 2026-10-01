import { Injectable, NotFoundException, HttpException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserLoginDto } from './dto/user-login-dto';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
@Injectable()
export class AuthService {
    constructor(private readonly authRepository: AuthRepository) { }
    generateJwt(payload) {
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
        return token;
    }
    async login(loginData: UserLoginDto) {
        try {
            const user = await this.authRepository.findUser(loginData.email);
            if (!user) {
                throw new NotFoundException("user not found")
            }

            const isPasswordMatch = await bcrypt.compare(loginData.password, user.passwordHash);
            if (!isPasswordMatch) {
                throw new UnauthorizedException("incorrect email or password");
            }
            const resUser = {
                email: user.email,
                role: user.role.name,
                id: user.id
            }
            const token = await this.generateJwt(resUser);

            return { token, resUser };
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new InternalServerErrorException("internal server error");
        }

    }
}

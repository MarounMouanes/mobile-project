import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('Headers:', request.headers); // Log all headers
    
    const token = this.extractTokenFromHeader(request);
    console.log('Extracted token:', token ? `${token.substring(0, 10)}...` : 'null');
    
    if (!token) {
      console.log('No token provided');
      throw new UnauthorizedException('No token provided');
    }
    
    const user = await this.authService.validateToken(token);
    console.log('User from token:', user ? `ID: ${user.id}, Name: ${user.name}` : 'null');
    
    if (!user) {
      console.log('Invalid or expired token');
      throw new UnauthorizedException('Invalid or expired token');
    }
    
    // Attach the user to the request object
    request.user = user;
    console.log('User attached to request');
    
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    console.log('Authorization header:', authHeader);
    
    if (!authHeader) {
      return undefined;
    }
    
    const [type, token] = authHeader.split(' ');
    console.log('Auth type:', type, 'Token present:', !!token);
    
    return type === 'Bearer' ? token : undefined;
  }
} 
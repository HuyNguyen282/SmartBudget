import { Injectable , UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
    if (info) {
      console.log('LÝ DO TỪ CHỐI TOKEN LÀ:', info.message);
    }
    if (err) {
      console.log('LỖI HỆ THỐNG JWT LÀ:', err.message);
    }
    
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

import { jwtDecode } from "jwt-decode";

export class DecoderTokenService {
  static decodeToken(token: string): any {
    if (!token) {
      return null;
    }
    const  decodificado  =  jwtDecode ( token ) ;
    return decodificado;
  }
}

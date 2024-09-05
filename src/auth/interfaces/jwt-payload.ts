
export interface JwtPayload {
    
    id: string;
    iat?: number; //Date of creation - It's optional
    exp?: number; //Date of expire - It's optional

}

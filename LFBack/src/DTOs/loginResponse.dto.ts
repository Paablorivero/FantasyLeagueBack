export interface LoginResponseDto{
    token: string;
    user: userDataResponseDto;
}

interface userDataResponseDto{
    uuid: string;
    username: string;
    rol: string;
}

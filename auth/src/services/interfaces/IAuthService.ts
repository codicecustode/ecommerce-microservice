export interface IAuthService {
  login(
    username: string,
    password: string
  ): Promise<{
    success: boolean;
    token?: string;
    message?: string;
  }>;

  getUserById(id: string): Promise<any>;
  register(user: any): Promise<any>;
  findUserByUsername(username: string): Promise<any>;
}

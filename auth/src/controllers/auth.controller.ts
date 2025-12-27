import { Request, Response } from "express";
import { IAuthService } from "../services/interfaces/IAuthService";

/**
 * Controller layer
 * - Handles HTTP (req/res)
 * - Delegates business logic to AuthService
 * - Does NOT create dependencies (low coupling)
 */

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

class AuthController {
  constructor(private authService: IAuthService) {}

  /**
   * POST /auth/login
   */
  login = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;

    const result = await this.authService.login(username, password);

    if (result.success) {
      return res.status(200).json({ token: result.token });
    }

    return res.status(400).json({ message: result.message });
  };

  /**
   * POST /auth/register
   */
  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const existingUser = await this.authService.findUserByUsername(
        req.body.username
      );

      if (existingUser) {
        return res.status(400).json({
          message: "Username already taken",
        });
      }
      const result = await this.authService.register(req.body);
      return res.status(201).json(
        {
          success: true,
          message: "User registered successfully",
          user: result
        }
      );
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };

  /**
   * GET /auth/profile
   */
  getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      console.log(req.user)
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const user = await this.authService.getUserById(userId);
      return res.status(200).json(user);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  };
}

export default AuthController;

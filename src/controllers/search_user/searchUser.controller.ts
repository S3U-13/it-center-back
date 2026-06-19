import { Request, Response } from "express";
import { SearchUserService } from "../../services/search_user/searchUser.service";

export class SearchUserController {
  static async searchUser(req: Request, res: Response) {
    try {
      const { cid } = req.query;
      const data = await SearchUserService.searchUser(String(cid));

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}

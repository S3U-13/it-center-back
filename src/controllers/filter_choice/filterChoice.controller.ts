import { Request, Response } from "express";
import { FilterChoiceService } from "../../services/filter_choice/filterChoice.service";

export class FilterChoiceController {
  static async Choice(req: Request, res: Response) {
    try {
      const location = await FilterChoiceService.Location(req.query);
      const func_unit = await FilterChoiceService.FuncUnit(req.query);
      const dispense_status = await FilterChoiceService.DispenseStatus(
        req.query,
      );
      const payers = await FilterChoiceService.Payers(req.query);

      const count_location = location.length ?? 0;
      const count_func_unit = func_unit.length ?? 0;
      return res.status(200).json({
        success: true,
        location,
        func_unit,
        dispense_status,
        payers,
        count_location,
        count_func_unit,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

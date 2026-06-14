import { Router } from "express";
import { AllInOneController } from "../controllers/all_in_one/allInOne.controller";
import { DesktopController } from "../controllers/desktop/desktop.controller";
import { MiniPcController } from "../controllers/mini_pc/miniPc.controller";
import { MonitorController } from "../controllers/monitor/monitor.controller";
import { PcController } from "../controllers/pc/pc.controller";
import { PrinterController } from "../controllers/printer/printer.controller";
import { UpsController } from "../controllers/ups/ups.controller";
import { FilterChoiceController } from "../controllers/filter_choice/filterChoice.controller";
import { DashboardController } from "../controllers/dashboard/dashboard.controller";
import { HardwareController } from "../controllers/hardware/hardware.controller";
// import { apiKeyAuth } from "../middleware/apiKeyAuth";
const router = Router();
// const apiLogger = require("../middleware/apiLogger");
// const {
//   authenticateToken,
//   authorizeRole,
// } = require("../middleware/authMiddleware");

//route
// router.use(authenticateToken, apiLogger, authorizeRole(1));

// router.get("/mapAll", AllChoiceController.mapAll);
// router.use(apiKeyAuth); // ใช้ middleware สำหรับตรวจสอบ API key

// all in one
router.get("/all-in-one", HardwareController.index);
router.post("/all-in-one", HardwareController.create);
router.get("/all-in-one/:id", AllInOneController.show);
router.put("/all-in-one/:id", AllInOneController.edit);
router.delete("/all-in-one/:id", AllInOneController.delete);

// desktop
router.get("/desktop", DesktopController.index);
router.post("/desktop", DesktopController.create);
router.get("/desktop/:id", DesktopController.show);
router.put("/desktop/:id", DesktopController.edit);
router.delete("/desktop/:id", DesktopController.delete);

// mini pc
router.get("/mini-pc", MiniPcController.index);
router.post("/mini-pc", MiniPcController.create);
router.get("/mini-pc/:id", MiniPcController.show);
router.put("/mini-pc/:id", MiniPcController.edit);
router.delete("/mini-pc/:id", MiniPcController.delete);

// monitor
router.get("/monitor", MonitorController.index);
router.post("/monitor", MonitorController.create);
router.get("/monitor/:id", MonitorController.show);
router.put("/monitor/:id", MonitorController.edit);
router.delete("/monitor/:id", MonitorController.delete);

// pc
router.get("/pc", PcController.index);
router.post("/pc", PcController.create);
router.get("/pc/:id", PcController.show);
router.put("/pc/:id", PcController.edit);
router.delete("/pc/:id", PcController.delete);
// printer
router.get("/printer", PrinterController.index);
router.post("/printer", PrinterController.create);
router.get("/printer/:id", PrinterController.show);
router.put("/printer/:id", PrinterController.edit);
router.delete("/printer/:id", PrinterController.delete);

// ups
router.get("/ups", UpsController.index);
router.post("/ups", UpsController.create);
router.get("/ups/:id", UpsController.show);
router.put("/ups/:id", UpsController.edit);
router.delete("/ups/:id", UpsController.delete);

// choice
router.get("/choice", FilterChoiceController.Choice);

// dashboard
router.get("/dashboard", DashboardController.DashboardSummary);

export default router;

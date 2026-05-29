import { Router } from "express";
import { AllInOneController } from "../controllers/all_in_one/allInOne.controller";
import { DesktopController } from "../controllers/desktop/desktop.controller";
import { MiniPcController } from "../controllers/mini_pc/miniPc.controller";
import { MonitorController } from "../controllers/monitor/monitor.controller";
import { PcController } from "../controllers/pc/pc.controller";
import { PrinterController } from "../controllers/printer/printer.controller";
import { UpsController } from "../controllers/ups/ups.controller";
import { FilterChoiceController } from "../controllers/filter_choice/filterChoice.controller";
const router = Router();
// const apiLogger = require("../middleware/apiLogger");
// const {
//   authenticateToken,
//   authorizeRole,
// } = require("../middleware/authMiddleware");

//route
// router.use(authenticateToken, apiLogger, authorizeRole(1));

// router.get("/mapAll", AllChoiceController.mapAll);

// all in one
router.get("/all-in-one", AllInOneController.index);
router.post("/all-in-one", AllInOneController.create);
router.get("/all-in-one/:id", AllInOneController.show);
router.put("/all-in-one/:id", AllInOneController.edit);
router.delete("/all-in-one/:id", AllInOneController.delete);

// desktop
router.get("/desktop", DesktopController.index);
router.post("/desktop", DesktopController.create);
router.get("/desktop/:id", DesktopController.show);
router.put("/desktop/:id", DesktopController.edit);

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

// pc
router.get("/pc", PcController.index);
router.post("/pc", PcController.create);
router.get("/pc/:id", PcController.show);
router.put("/pc/:id", PcController.edit);

// printer
router.get("/printer", PrinterController.index);
router.post("/printer", PrinterController.create);
router.get("/printer/:id", PrinterController.show);
router.put("/printer/:id", PrinterController.edit);

// ups
router.get("/ups", UpsController.index);
router.post("/ups", UpsController.create);
router.get("/ups/:id", UpsController.show);
router.put("/ups/:id", UpsController.edit);

// choice
router.get("/choice", FilterChoiceController.Choice);

export default router;

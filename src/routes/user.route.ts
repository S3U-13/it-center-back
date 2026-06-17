import { Router } from "express";
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
router.get("/all-in-one/:id", HardwareController.show);
router.put("/all-in-one/:id", HardwareController.edit);
// router.delete("/all-in-one/:id", AllInOneController.delete);

// desktop
router.get("/desktop", HardwareController.index);
router.post("/desktop", HardwareController.create);
router.get("/desktop/:id", HardwareController.show);
router.put("/desktop/:id", HardwareController.edit);
// router.delete("/desktop/:id", DesktopController.delete);

// mini pc
router.get("/mini-pc", HardwareController.index);
router.post("/mini-pc", HardwareController.create);
router.get("/mini-pc/:id", HardwareController.show);
router.put("/mini-pc/:id", HardwareController.edit);
// router.delete("/mini-pc/:id", MiniPcController.delete);

// monitor
router.get("/monitor", HardwareController.index);
router.post("/monitor", HardwareController.create);
router.get("/monitor/:id", HardwareController.show);
router.put("/monitor/:id", HardwareController.edit);
// router.delete("/monitor/:id", MonitorController.delete);

// pc
router.get("/pc", HardwareController.index);
router.post("/pc", HardwareController.create);
router.get("/pc/:id", HardwareController.show);
router.put("/pc/:id", HardwareController.edit);
// router.delete("/pc/:id", PcController.delete);

// printer
router.get("/printer", HardwareController.index);
router.post("/printer", HardwareController.create);
router.get("/printer/:id", HardwareController.show);
router.put("/printer/:id", HardwareController.edit);
// router.delete("/printer/:id", PrinterController.delete);

// ups
router.get("/ups", HardwareController.index);
router.post("/ups", HardwareController.create);
router.get("/ups/:id", HardwareController.show);
router.put("/ups/:id", HardwareController.edit);
// router.delete("/ups/:id", UpsController.delete);

// tablet
router.get("/tablet", HardwareController.index);
router.post("/tablet", HardwareController.create);
router.get("/tablet/:id", HardwareController.show);
router.put("/tablet/:id", HardwareController.edit);

// choice
router.get("/choice", FilterChoiceController.Choice);

// dashboard
router.get("/dashboard", DashboardController.DashboardSummary);

export default router;

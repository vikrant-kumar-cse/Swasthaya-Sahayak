import express from 'express';
import {
    getAllOutbreaks,
    checkOutbreak,
    runDailyCheck,
    getStats
} from '../controllers/outbreakController.js';
import * as outbreakDataController from "../controllers/outbreakDataController.js";

const router = express.Router();

// ========================================
// MAIN OUTBREAK DETECTION ROUTES
// ========================================
router.get('/', getAllOutbreaks);                    // Get active outbreaks
router.get('/check', checkOutbreak);                 // Manual outbreak check
router.post('/daily-check', runDailyCheck);          // Automated daily check
router.get('/stats', getStats);              // Dashboard stats (FIXED: renamed)

// ========================================
// DATA MANAGEMENT ROUTES
// ========================================
router.get("/generate-mock-data", outbreakDataController.generateMockData);
router.get("/all", outbreakDataController.getAllOutbreaks);
router.get("/current", outbreakDataController.getCurrentOutbreaks);
router.get("/stats/detailed", outbreakDataController.getStats);  // FIXED: renamed to avoid conflict
router.get("/district/:district", outbreakDataController.getOutbreaksByDistrict);
router.get("/disease/:disease", outbreakDataController.getOutbreaksByDisease);
router.get("/:id", outbreakDataController.getOutbreakById);
router.delete("/delete-all", outbreakDataController.deleteAllOutbreaks);

export default router;

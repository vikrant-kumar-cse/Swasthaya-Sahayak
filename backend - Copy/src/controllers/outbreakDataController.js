// controllers/outbreakController.js

import Outbreak from "../models/Outbreak.js";
import generateMockOutbreaks from "../scrapers/mockDataGenerator.js";

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. GENERATE MOCK DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const generateMockData = async (req, res) => {
    try {
        console.log("🚀 Starting mock data generation...\n");
        const result = await generateMockOutbreaks();
        
        res.json({
            success: true,
            message: "Mock data generated successfully",
            ...result
        });
    } catch (error) {
        console.error("❌ Error generating mock data:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. GET ALL OUTBREAKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const getAllOutbreaks = async (req, res) => {
    try {
        const { limit = 100, page = 1 } = req.query;
        const skip = (page - 1) * limit;

        const outbreaks = await Outbreak.find()
            .sort({ reportDate: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Outbreak.countDocuments();

        res.json({
            success: true,
            count: outbreaks.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: outbreaks
        });
    } catch (error) {
        console.error("❌ Error fetching outbreaks:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. GET CURRENT WEEK OUTBREAKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const getCurrentOutbreaks = async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const currentOutbreaks = await Outbreak.find({
            reportDate: { $gte: oneWeekAgo },
            alertLevel: { $in: ["MEDIUM", "HIGH", "CRITICAL"] }
        })
            .sort({ alertLevel: -1, casesCount: -1 })
            .lean();

        // Group by severity
        const bySeverity = {
            CRITICAL: currentOutbreaks.filter(o => o.alertLevel === "CRITICAL"),
            HIGH: currentOutbreaks.filter(o => o.alertLevel === "HIGH"),
            MEDIUM: currentOutbreaks.filter(o => o.alertLevel === "MEDIUM")
        };

        res.json({
            success: true,
            count: currentOutbreaks.length,
            summary: {
                critical: bySeverity.CRITICAL.length,
                high: bySeverity.HIGH.length,
                medium: bySeverity.MEDIUM.length
            },
            data: currentOutbreaks,
            bySeverity
        });
    } catch (error) {
        console.error("❌ Error fetching current outbreaks:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. GET STATISTICS FOR DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const getStats = async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Total active outbreaks (last 7 days)
        const activeOutbreaks = await Outbreak.countDocuments({
            reportDate: { $gte: oneWeekAgo },
            alertLevel: { $in: ["MEDIUM", "HIGH", "CRITICAL"] }
        });

        // By disease (last 7 days)
        const byDisease = await Outbreak.aggregate([
            { $match: { reportDate: { $gte: oneWeekAgo } } },
            {
                $group: {
                    _id: "$disease",
                    totalCases: { $sum: "$casesCount" },
                    count: { $sum: 1 },
                    maxCases: { $max: "$casesCount" },
                    avgCases: { $avg: "$casesCount" }
                }
            },
            { $sort: { totalCases: -1 } }
        ]);

        // By district (last 7 days - top 10)
        const byDistrict = await Outbreak.aggregate([
            {
                $match: {
                    reportDate: { $gte: oneWeekAgo },
                    alertLevel: { $in: ["MEDIUM", "HIGH", "CRITICAL"] }
                }
            },
            {
                $group: {
                    _id: "$district",
                    totalCases: { $sum: "$casesCount" },
                    diseases: { $addToSet: "$disease" },
                    outbreakCount: { $sum: 1 }
                }
            },
            { $sort: { totalCases: -1 } },
            { $limit: 10 }
        ]);

        // Total cases (last 7 days)
        const totalCasesResult = await Outbreak.aggregate([
            { $match: { reportDate: { $gte: oneWeekAgo } } },
            { $group: { _id: null, total: { $sum: "$casesCount" } } }
        ]);

        // Severity breakdown
        const severityBreakdown = await Outbreak.aggregate([
            { $match: { reportDate: { $gte: oneWeekAgo } } },
            {
                $group: {
                    _id: "$alertLevel",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Trend data (last 14 days for chart)
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const trendData = await Outbreak.aggregate([
            { $match: { reportDate: { $gte: fourteenDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$reportDate"
                        }
                    },
                    totalCases: { $sum: "$casesCount" },
                    outbreakCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                activeOutbreaks,
                totalCases: totalCasesResult[0]?.total || 0,
                byDisease,
                byDistrict,
                severityBreakdown,
                trendData,
                dataUpdatedAt: new Date()
            }
        });
    } catch (error) {
        console.error("❌ Error fetching stats:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. GET OUTBREAKS BY DISTRICT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const getOutbreaksByDistrict = async (req, res) => {
    try {
        const { district } = req.params;

        if (!district) {
            return res.status(400).json({
                success: false,
                error: "District parameter is required"
            });
        }

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const outbreaks = await Outbreak.find({
            district: new RegExp(district, "i"), // Case-insensitive
            reportDate: { $gte: oneWeekAgo }
        })
            .sort({ reportDate: -1, alertLevel: -1 })
            .lean();

        if (outbreaks.length === 0) {
            return res.json({
                success: true,
                message: `No recent outbreaks found in ${district}`,
                count: 0,
                data: []
            });
        }

        res.json({
            success: true,
            district,
            count: outbreaks.length,
            data: outbreaks
        });
    } catch (error) {
        console.error("❌ Error fetching district outbreaks:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. GET OUTBREAKS BY DISEASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const getOutbreaksByDisease = async (req, res) => {
    try {
        const { disease } = req.params;

        if (!disease) {
            return res.status(400).json({
                success: false,
                error: "Disease parameter is required"
            });
        }

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const outbreaks = await Outbreak.find({
            disease: new RegExp(disease, "i"),
            reportDate: { $gte: oneWeekAgo }
        })
            .sort({ casesCount: -1 })
            .lean();

        if (outbreaks.length === 0) {
            return res.json({
                success: true,
                message: `No recent ${disease} outbreaks found`,
                count: 0,
                data: []
            });
        }

        // Get affected districts
        const affectedDistricts = [
            ...new Set(outbreaks.map((o) => o.district))
        ];

        res.json({
            success: true,
            disease,
            count: outbreaks.length,
            affectedDistricts,
            data: outbreaks
        });
    } catch (error) {
        console.error("❌ Error fetching disease outbreaks:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. DELETE ALL OUTBREAKS (For testing/reset)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const deleteAllOutbreaks = async (req, res) => {
    try {
        const result = await Outbreak.deleteMany({});

        res.json({
            success: true,
            message: "All outbreaks deleted",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error("❌ Error deleting outbreaks:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. GET OUTBREAK BY ID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
export const getOutbreakById = async (req, res) => {
    try {
        const { id } = req.params;

        const outbreak = await Outbreak.findById(id);

        if (!outbreak) {
            return res.status(404).json({
                success: false,
                error: "Outbreak not found"
            });
        }

        res.json({
            success: true,
            data: outbreak
        });
    } catch (error) {
        console.error("❌ Error fetching outbreak:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
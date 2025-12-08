import Outbreak from '../models/Outbreak.js';
import User from '../models/User.js';
import { detectOutbreak } from '../services/outbreakDetection.js';
import { generateAlertMessage } from '../services/alertGenerator.js';
import { sendBulkAlerts } from '../services/whatsappService.js';
import { sendBulkSMS } from '../services/smsService.js';  // ✅ LINE 1: Import SMS service

// ========================================
// Get all active outbreaks
// ========================================
export const getAllOutbreaks = async (req, res) => {
    try {
        const outbreaks = await Outbreak.find({ isActive: true })
            .sort({ reportDate: -1 })
            .limit(100);

        res.json({
            status: 'success',
            count: outbreaks.length,
            data: outbreaks
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// ========================================
// Check outbreak for specific location (Manual Check)
// ========================================
export const checkOutbreak = async (req, res) => {
    try {
        const { district, disease } = req.query;

        // Validation
        if (!district || !disease) {
            return res.status(400).json({
                status: "error",
                message: "District and disease parameters are required"
            });
        }

        // Run detection
        const result = await detectOutbreak(district, disease);

        // Handle insufficient data
        if (!result) {
            return res.json({
                status: "success",
                message: "Insufficient data for analysis",
                data: {
                    district,
                    disease,
                    isOutbreak: false,
                    alertLevel: "INSUFFICIENT_DATA",
                    reason: "Need at least 4 weeks of historical data and 1 week of current data"
                }
            });
        }

        // Generate alert message
        const message = generateAlertMessage(result, "en");

        return res.json({
            status: "success",
            data: {
                ...result,
                alertMessage: message
            }
        });

    } catch (error) {
        console.error("❌ ERROR in checkOutbreak:", error);
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// ========================================
// Daily automated outbreak detection and alerts
// ========================================
export const runDailyCheck = async (req, res) => {
    try {
        console.log("🤖 Starting daily outbreak check...");

        // Get all unique districts from database
        const districts = await Outbreak.distinct('district');
        const diseases = ['Dengue', 'Malaria', 'COVID-19', 'Food Poisoning'];

        const detectedOutbreaks = [];
        const alertsSent = [];

        // Check each district-disease combination
        for (const district of districts) {
            for (const disease of diseases) {
                
                // Run detection
                const outbreak = await detectOutbreak(district, disease);

                // Skip if no outbreak detected
                if (!outbreak || !outbreak.isOutbreak) {
                    console.log(`✅ No outbreak → ${district} - ${disease}`);
                    continue;
                }

                console.log(`⚠️ OUTBREAK DETECTED → ${district} - ${disease} (${outbreak.alertLevel})`);

                // Get latest outbreak record for this combination
                const latestOutbreak = await Outbreak.findOne({
                    district,
                    disease
                }).sort({ reportDate: -1 });

                // Store detection result
                detectedOutbreaks.push({
                    district,
                    disease,
                    alertLevel: outbreak.alertLevel,
                    currentCases: outbreak.currentCases,
                    averageCases: outbreak.averageCases,
                    increasePercent: outbreak.increasePercent,
                    outbreakId: latestOutbreak?._id
                });

                // Get users (same query as before)
                const users = await User.find({
                    district,
                    isActive: true,
                    'notificationPreference.whatsapp': true
                }).select('_id name phoneNumber email district');

                console.log(`📱 Found ${users.length} users in ${district}`);

                if (users.length === 0) {
                    console.log(`⚠️ No users to notify in ${district}`);
                    continue;
                }

                // Generate Hindi message
                const message = generateAlertMessage(outbreak, 'hi');

                // Send WhatsApp alerts (existing)
                const whatsappSent = await sendBulkAlerts(
                    users,
                    message,
                    latestOutbreak?._id,
                    disease,
                    outbreak.alertLevel
                );

                // ✅ LINE 2: Send SMS alerts (SAME users, SAME message)
                const smsSent = await sendBulkSMS(users, message);

                alertsSent.push({
                    district,
                    disease,
                    userCount: users.length,
                    whatsappSent: whatsappSent,
                    smsSent: smsSent,  // ✅ Track SMS count
                    totalSent: whatsappSent + smsSent
                });

                console.log(`✅ Alerts sent for ${district} - ${disease}`);
                console.log(`   WhatsApp: ${whatsappSent}/${users.length}`);
                console.log(`   SMS: ${smsSent}/${users.length}`);
            }
        }

        // Calculate totals
        const totalWhatsApp = alertsSent.reduce((sum, a) => sum + (a.whatsappSent || 0), 0);
        const totalSMS = alertsSent.reduce((sum, a) => sum + (a.smsSent || 0), 0);

        return res.json({
            status: "success",
            message: "Daily outbreak check completed",
            summary: {
                districtsChecked: districts.length,
                diseasesChecked: diseases.length,
                totalCombinations: districts.length * diseases.length,
                outbreaksDetected: detectedOutbreaks.length,
                whatsappAlertsSent: totalWhatsApp,
                smsAlertsSent: totalSMS,  // ✅ Show SMS count
                totalAlertsSent: totalWhatsApp + totalSMS
            },
            outbreaks: detectedOutbreaks,
            alerts: alertsSent,
            timestamp: new Date()
        });

    } catch (error) {
        console.error("❌ Daily Check ERROR:", error);
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// ========================================
// Get outbreak statistics for dashboard
// ========================================
export const getStats = async (req, res) => {
    try {
        const totalOutbreaks = await Outbreak.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments({ isActive: true });

        const byDisease = await Outbreak.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$disease',
                    count: { $sum: 1 },
                    totalCases: { $sum: '$casesCount' }
                }
            },
            { $sort: { totalCases: -1 } }
        ]);

        const byState = await Outbreak.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$state',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const byDistrict = await Outbreak.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$district',
                    count: { $sum: 1 },
                    totalCases: { $sum: '$casesCount' }
                }
            },
            { $sort: { totalCases: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            status: 'success',
            data: {
                totalOutbreaks,
                totalUsers,
                byDisease,
                byState,
                topDistricts: byDistrict
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
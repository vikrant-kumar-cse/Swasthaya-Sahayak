import Outbreak from '../models/Outbreak.js';

/**
 * Detect outbreak using statistical analysis with disease-specific thresholds
 * @param {string} district - District name
 * @param {string} disease - Disease name (Dengue, Malaria, COVID-19, Food Poisoning)
 * @returns {object|null} Detection result or null if insufficient data
 */
export const detectOutbreak = async (district, disease) => {
    try {
        // ========================================
        // 1. DATE CALCULATIONS
        // ========================================
        const today = new Date();
        
        // Last 12 weeks for historical baseline
        const twelveWeeksAgo = new Date(today);
        twelveWeeksAgo.setDate(today.getDate() - 84);
        
        // Current week starts 7 days ago
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);

        // ========================================
        // 2. FETCH DATA FROM DATABASE
        // ========================================
        const allData = await Outbreak.find({
            district,
            disease,
            reportDate: { $gte: twelveWeeksAgo }
        }).sort({ reportDate: 1 });

        // Minimum data check
        if (allData.length < 4) {
            console.log(`⚠️ Insufficient data: ${district} - ${disease} (${allData.length} records)`);
            return null;
        }

        // Split into historical vs current week
        const historical = allData.filter(d => d.reportDate < oneWeekAgo);
        const currentWeek = allData.filter(d => d.reportDate >= oneWeekAgo);

        if (historical.length < 3 || currentWeek.length < 1) {
            console.log(`⚠️ Data split failed: historical=${historical.length}, current=${currentWeek.length}`);
            return null;
        }

        // ========================================
        // 3. CALCULATE STATISTICS
        // ========================================
        const historicalCases = historical.map(d => d.casesCount);
        const historicalAvg = historicalCases.reduce((sum, val) => sum + val, 0) / historicalCases.length;
        
        // Standard Deviation calculation
        const variance = historicalCases.reduce((sum, val) => 
            sum + Math.pow(val - historicalAvg, 2), 0
        ) / historicalCases.length;
        const stdDev = Math.sqrt(variance);

        const currentWeekTotal = currentWeek.reduce((sum, record) => sum + record.casesCount, 0);
        
        // Percentage increase
        const increasePercent = historicalAvg > 0 
            ? ((currentWeekTotal - historicalAvg) / historicalAvg) * 100 
            : 0;
        
        // Z-Score (statistical significance)
        const zScore = stdDev > 0 
            ? (currentWeekTotal - historicalAvg) / stdDev 
            : 0;

        // ========================================
        // 4. DISEASE-SPECIFIC THRESHOLDS
        // ========================================
        const diseaseConfig = {
            'Dengue': { 
                minCases: 10,
                yellowPercent: 50,
                redPercent: 100,
                yellowZScore: 2,
                redZScore: 3
            },
            'Malaria': { 
                minCases: 8,
                yellowPercent: 40,
                redPercent: 90,
                yellowZScore: 2,
                redZScore: 3
            },
            'COVID-19': { 
                minCases: 5,
                yellowPercent: 30,
                redPercent: 70,
                yellowZScore: 1.5,
                redZScore: 2.5
            },
            'Food Poisoning': { 
                minCases: 15,
                yellowPercent: 60,
                redPercent: 120,
                yellowZScore: 2,
                redZScore: 3
            }
        };

        const config = diseaseConfig[disease] || diseaseConfig['Dengue'];

        // ========================================
        // 5. OUTBREAK DETECTION LOGIC
        // ========================================
        let alertLevel = "GREEN";
        let isOutbreak = false;
        let reason = "Normal levels";

        // Check 1: Minimum absolute cases threshold
        if (currentWeekTotal < config.minCases) {
            return {
                isOutbreak: false,
                alertLevel: "GREEN",
                district,
                disease,
                currentCases: currentWeekTotal,
                averageCases: Math.round(historicalAvg),
                currentWeekCount: currentWeekTotal,
                previousWeekAvg: Math.round(historicalAvg),
                increasePercent: Math.round(increasePercent),
                standardDeviation: Math.round(stdDev),
                zScore: zScore.toFixed(2),
                reason: `Below minimum threshold (${config.minCases} cases required)`,
                analysisDate: new Date()
            };
        }

        // Check 2: RED Alert (Critical Outbreak)
        if (zScore >= config.redZScore || increasePercent >= config.redPercent) {
            alertLevel = "RED";
            isOutbreak = true;
            reason = `Critical: ${Math.round(increasePercent)}% increase, Z-score: ${zScore.toFixed(1)}`;
        }
        // Check 3: YELLOW Alert (Warning)
        else if (zScore >= config.yellowZScore || increasePercent >= config.yellowPercent) {
            alertLevel = "YELLOW";
            isOutbreak = true;
            reason = `Warning: ${Math.round(increasePercent)}% increase, Z-score: ${zScore.toFixed(1)}`;
        }

        // ========================================
        // 6. RETURN STANDARDIZED RESULT
        // ========================================
        const result = {
            isOutbreak,
            alertLevel,
            district,
            disease,
            currentCases: currentWeekTotal,
            averageCases: Math.round(historicalAvg),
            currentWeekCount: currentWeekTotal,
            previousWeekAvg: Math.round(historicalAvg),
            increasePercent: Math.round(increasePercent),
            standardDeviation: Math.round(stdDev),
            zScore: zScore.toFixed(2),
            reason,
            historicalWeeks: historical.length,
            analysisDate: new Date(),
            dateRange: {
                historicalFrom: twelveWeeksAgo,
                historicalTo: oneWeekAgo,
                currentFrom: oneWeekAgo,
                currentTo: today
            }
        };

        // Log result for debugging
        console.log(`
📊 Detection Result:
   District: ${district}
   Disease: ${disease}
   Current: ${currentWeekTotal} cases
   Average: ${Math.round(historicalAvg)} cases
   Increase: ${Math.round(increasePercent)}%
   Z-Score: ${zScore.toFixed(2)}
   Alert: ${alertLevel}
   Outbreak: ${isOutbreak ? '⚠️ YES' : '✅ NO'}
        `);

        return result;

    } catch (error) {
        console.error('❌ Error in detectOutbreak:', error);
        throw error;
    }
};
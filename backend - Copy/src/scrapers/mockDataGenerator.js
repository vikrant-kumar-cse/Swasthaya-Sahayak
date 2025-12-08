import Outbreak from "../models/Outbreak.js";

/*
 PERFECT OUTBREAK GENERATOR — 100% DETECTABLE
 - 12 weeks historical stable data
 - Current week : guaranteed 5x–10x spike
*/

const generateMockOutbreaks = async () => {
    console.log("🎲 Generating perfect mock outbreak dataset...\n");

    try {
        // 1️⃣ Clear old data
        const del = await Outbreak.deleteMany({});
        console.log(`🗑️ Deleted old records: ${del.deletedCount}\n`);

        const districts = [
            "Mumbai", "Pune", "Nagpur", "Nashik", "Thane",
            "Aurangabad", "Solapur", "Amravati", "Kolhapur",
            "Parbhani", "Jalgaon", "Latur", "Dhule", "Ahmednagar",
            "Satara", "Ratnagiri", "Sangli", "Yavatmal", "Nanded"
        ];

        const diseases = [
            "Dengue",
            "Malaria",
            "Food Poisoning",
            "Gastroenteritis",
            "Typhoid",
            "Viral Fever",
            "Hepatitis",
            "Cholera"
        ];

        const outbreaks = [];
        const today = new Date();

        console.log("📊 Creating 12 weeks stable historical data...\n");

        /*
        ────────────────────────────────────────────
        12 WEEKS LOW STABLE DATA (10–14 cases)
        ────────────────────────────────────────────
        */
        for (let w = 12; w >= 1; w--) {
            const date = new Date(today);
            date.setDate(today.getDate() - w * 7);

            for (const district of districts) {
                for (const disease of diseases) {
                    const stableCases = 10 + (w % 5); // 10–14 stable

                    outbreaks.push({
                        state: "Maharashtra",
                        district,
                        disease,
                        casesCount: stableCases,
                        reportDate: date,
                        isActive: true,
                        alertLevel: "LOW",
                        alertText: `Weekly stable report (${stableCases} cases)`,
                        sourceUrl: "https://idsp.mohfw.gov.in/"
                    });
                }
            }
        }

        console.log(`✔ Added ${outbreaks.length} historical records\n`);

        /*
        ────────────────────────────────────────────
        CURRENT WEEK SPIKES → 5x to 10x jump
        ────────────────────────────────────────────
        */
        console.log("🚨 Adding SPIKE outbreak scenarios...\n");

        const outbreakScenarios = [
            { district: "Pune", disease: "Dengue" },
            { district: "Mumbai", disease: "Food Poisoning" },
            { district: "Nagpur", disease: "Malaria" },
            { district: "Nashik", disease: "Gastroenteritis" },
            { district: "Thane", disease: "Viral Fever" }
        ];

        for (const o of outbreakScenarios) {
            // stable avg = 12 → spike = 5x to 10x = 60 to 120
            const spike = Math.floor(60 + Math.random() * 60); // 60–120 guaranteed

            outbreaks.push({
                state: "Maharashtra",
                district: o.district,
                disease: o.disease,
                casesCount: spike,
                reportDate: today,
                alertLevel: spike > 90 ? "CRITICAL" : "HIGH",
                isActive: true,
                alertText: `Outbreak spike (${spike} cases reported!)`,
                sourceUrl: "https://health.maharashtra.gov.in/alerts"
            });

            console.log(`🔥 Outbreak: ${o.district} | ${o.disease} → ${spike} cases`);
        }

        console.log(`\n📦 Total records prepared: ${outbreaks.length}`);

        // BULK INSERT (FAST)
        const saved = await Outbreak.insertMany(outbreaks);
        console.log(`💾 Saved: ${saved.length} records\n`);

        return {
            success: true,
            message: "Perfect outbreak dataset generated",
            totalGenerated: outbreaks.length,
            totalSaved: saved.length,
            outbreakScenarios: outbreakScenarios.length
        };

    } catch (error) {
        console.error("❌ Error:", error);
        return { success: false, message: error.message };
    }
};

export default generateMockOutbreaks;

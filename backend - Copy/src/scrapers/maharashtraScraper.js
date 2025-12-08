import puppeteer from "puppeteer";
import Outbreak from "../models/Outbreak.js";

// Delay function to replace deprecated waitForTimeout()
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/* 
------------------------------------------
NORMALIZE DISEASE (IMPORTANT FOR ENUM SAFE)
------------------------------------------
*/
const normalizeDisease = (disease) => {
    const map = {
        "food poisoning": "Food Poisoning",
        "dengue": "Dengue",
        "malaria": "Malaria",
        "gastroenteritis": "Gastroenteritis",
        "cholera": "Cholera",
        "measles": "Measles",
        "typhoid": "Typhoid",
        "jaundice": "Jaundice",
        "hepatitis": "Hepatitis",
        "diarrhoea": "Diarrhoea",
        "diarrhea": "Diarrhoea",
        "viral fever": "Viral Fever",
        "fever": "Fever",
        "rabies": "Rabies",
    };

    const key = disease.toLowerCase().trim();
    return map[key] || "Unknown";
};

/*
------------------------------------------
MAIN SCRAPER FUNCTION
------------------------------------------
*/
const scrapeMaharashtra = async () => {
    console.log("🕷️ Scraping Maharashtra health data from IDSP...");

    const url =
        "https://idsp.mohfw.gov.in/index1.php?lang=1&level=2&lid=7048&sublinkid=8932";

    let browser;

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        );

        console.log("📡 Loading IDSP page...");
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

        await delay(5000);

        /*
        ------------------------------------------
        SCRAPE ALL TEXT BLOCKS (Works on IDSP)
        ------------------------------------------
        */
        const scraped = await page.evaluate(() => {
            const nodes = document.querySelectorAll("div, p, td, span");
            const alerts = [];

            nodes.forEach((el) => {
                const text = el.innerText?.trim();
                if (!text || text.length < 30) return;

                const lower = text.toLowerCase();

                // Must contain Maharashtra
                if (!lower.includes("maharashtra")) return;

                alerts.push(text.substring(0, 500));
            });

            return alerts;
        });

        await browser.close();

        console.log(`📋 Found ${scraped.length} raw Maharashtra texts`);

        if (scraped.length === 0) {
            return {
                success: false,
                recordsFound: 0,
                message: "No Maharashtra outbreaks found",
            };
        }

        /*
        ------------------------------------------
        PARSE ALERTS - NLP EXTRACTION
        ------------------------------------------
        */
        const finalAlerts = scraped.map((text) => {
            const lower = text.toLowerCase();

            // Extract district
            const districtMatch =
                text.match(/in\s+([A-Za-z ]+),\s*Maharashtra/i) ||
                text.match(/at\s+([A-Za-z ]+),\s*Maharashtra/i) ||
                text.match(/([A-Za-z]+)\s+district/i);

            const district = districtMatch
                ? districtMatch[1].trim()
                : "Unknown";

            // Extract disease
            let disease = "Unknown";
            const diseaseKeywords = [
                "dengue",
                "malaria",
                "food poisoning",
                "gastroenteritis",
                "cholera",
                "measles",
                "typhoid",
                "jaundice",
                "hepatitis",
                "diarrhea",
                "diarrhoea",
                "viral fever",
                "fever",
                "rabies",
            ];

            for (const key of diseaseKeywords) {
                if (lower.includes(key)) {
                    disease = key;
                    break;
                }
            }

            disease = normalizeDisease(disease);

            // Extract cases
            const caseMatch =
                text.match(
                    /(\d+)\s*(cases|students|children|people|persons)/i
                ) || text.match(/(\d+)\s*(fell|sick|ill)/i);

            let casesCount = caseMatch ? parseInt(caseMatch[1]) : 0;

            return {
                state: "Maharashtra",
                district,
                disease,
                casesCount,
                reportDate: new Date(),
                sourceUrl: url,
                alertText: text,
            };
        });

        /*
        ------------------------------------------
        REMOVE DUPLICATES
        ------------------------------------------
        */
        const unique = [];
        const seen = new Set();

        for (const a of finalAlerts) {
            const key = `${a.district}-${a.disease}-${a.casesCount}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(a);
            }
        }

        console.log(
            `🔄 Unique alerts extracted: ${unique.length} (from ${scraped.length})`
        );

        /*
        ------------------------------------------
        SAVE TO DATABASE
        ------------------------------------------
        */
        let saved = 0;

        for (const record of unique) {
            try {
                await Outbreak.findOneAndUpdate(
                    {
                        state: record.state,
                        district: record.district,
                        disease: record.disease,
                    },
                    { $set: record },
                    { upsert: true, new: true, runValidators: true }
                );
                saved++;
            } catch (err) {
                console.error(`❌ Save error: ${err.message}`);
            }
        }

        console.log(`💾 Saved to DB: ${saved} records`);

        return {
            success: true,
            recordsFound: finalAlerts.length,
            uniqueRecords: unique.length,
            recordsSaved: saved,
            data: unique,
        };
    } catch (error) {
        if (browser) await browser.close();
        console.error("❌ Error:", error.message);
        return { success: false, error: error.message };
    }
};

export default scrapeMaharashtra;

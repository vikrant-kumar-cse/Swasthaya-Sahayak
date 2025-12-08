// 📁 services/alertGenerator.js

export const generateAlertMessage = (outbreakInfo, language = "en") => {
    const { district, disease, alertLevel, currentCases, averageCases } = outbreakInfo;

    // ========================================
    // ✅ FIXED: Map alert levels properly
    // ========================================
    const messages = {
        hi: {
            RED: `🚨 *अत्यंत गंभीर अलर्ट* 🚨
📍 स्थान: ${district}
🦠 बीमारी: ${disease}
📊 वर्तमान मामले: ${currentCases}
📈 औसत मामले: ${averageCases}

⚠️ आपके क्षेत्र में गंभीर प्रकोप पाया गया!
- भीड़ भरे स्थानों से बचें
- स्वच्छता का विशेष ध्यान रखें
- लक्षण दिखने पर तुरंत डॉक्टर से संपर्क करें

📞 आपातकाल: 108`,

            YELLOW: `⚠️ *चेतावनी अलर्ट* ⚠️
📍 स्थान: ${district}
🦠 बीमारी: ${disease}
📊 वर्तमान मामले: ${currentCases}
📈 औसत मामले: ${averageCases}

⚠️ सावधानी बरतें!
- स्वच्छता बनाए रखें
- सतर्क रहें`,

            GREEN: `✅ *स्थिति सामान्य*
📍 ${district} में ${disease} की स्थिति सामान्य है।
📊 मामले: ${currentCases}`,

            INSUFFICIENT_DATA: `ℹ️ *जानकारी*
📍 ${district} में ${disease} के लिए पर्याप्त डेटा उपलब्ध नहीं है।`
        },
        
        en: {
            RED: `🚨 *CRITICAL ALERT* 🚨
📍 Location: ${district}
🦠 Disease: ${disease}
📊 Current Cases: ${currentCases}
📈 Average Cases: ${averageCases}

⚠️ Severe outbreak detected in your area!
- Avoid crowded places
- Maintain strict hygiene
- Consult doctor immediately if symptoms appear

📞 Emergency: 108`,

            YELLOW: `⚠️ *WARNING ALERT* ⚠️
📍 Location: ${district}
🦠 Disease: ${disease}
📊 Current Cases: ${currentCases}
📈 Average Cases: ${averageCases}

⚠️ Stay alert and take precautions!
- Maintain hygiene
- Stay cautious`,

            GREEN: `✅ *NORMAL STATUS*
📍 ${disease} situation in ${district} is under control.
📊 Cases: ${currentCases}`,

            INSUFFICIENT_DATA: `ℹ️ *INFO*
📍 Insufficient data available for ${disease} in ${district}.`
        }
    };

    // ========================================
    // VALIDATION
    // ========================================
    if (!messages[language]) {
        console.error(`❌ Language '${language}' not supported`);
        return "Alert message unavailable - unsupported language";
    }

    if (!messages[language][alertLevel]) {
        console.error(`❌ Alert level '${alertLevel}' not found for language '${language}'`);
        return `Alert message unavailable - unknown alert level: ${alertLevel}`;
    }

    return messages[language][alertLevel];
};
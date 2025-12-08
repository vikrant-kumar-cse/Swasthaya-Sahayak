import twilio from 'twilio';
import dotenv from 'dotenv';
import Alert from '../models/Alert.js';

// Load environment variables FIRST
dotenv.config();

// Initialize Twilio client with credentials
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export const sendWhatsAppMessage = async (
    phoneNumber,
    message,
    userId,
    outbreakId,
    disease,
    alertLevel
) => {
    // Validate credentials exist
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        console.error("❌ Twilio credentials missing!");
        throw new Error("Twilio credentials not configured");
    }

    console.log("\n================= TWILIO DEBUG =================");
    console.log("🔐 Credentials Check:");
    console.log({
        TWILIO_SID: process.env.TWILIO_ACCOUNT_SID?.slice(0, 10) + "******",
        TWILIO_TOKEN_LENGTH: process.env.TWILIO_AUTH_TOKEN?.length,
        TWILIO_FROM: process.env.TWILIO_WHATSAPP_NUMBER
    });
    console.log("=================================================\n");

    try {
        // ✅ FIX: Handle phone number format (10 digits or +91 format)
        const phoneWithCode = phoneNumber.startsWith('+') 
            ? phoneNumber 
            : `+91${phoneNumber}`;

        const result = await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${phoneWithCode}`,  // ✅ Fixed
            body: message
        });

        console.log(`✅ WhatsApp sent successfully!`);
        console.log(`   To: ${phoneWithCode}`);
        console.log(`   SID: ${result.sid}`);

        // ✅ FIX: Add phoneNumber field
        await Alert.create({
            user: userId,
            outbreak: outbreakId,
            disease,
            alertLevel,
            message,
            phoneNumber: phoneWithCode,  // ✅ CRITICAL: Added this field
            status: 'sent',
            twilioSid: result.sid,  // ✅ Added for tracking
            sentAt: new Date()
        });

        console.log(`✅ Alert saved to database`);

        return { success: true, sid: result.sid };

    } catch (error) {
        console.log("\n❌ TWILIO ERROR =====================");
        console.error("Code:", error.code);
        console.error("Message:", error.message);
        console.error("Status:", error.status);
        console.log("=====================================\n");

        // ✅ FIX: Add phoneNumber even for failed alerts
        const phoneWithCode = phoneNumber.startsWith('+') 
            ? phoneNumber 
            : `+91${phoneNumber}`;

        try {
            await Alert.create({
                user: userId,
                outbreak: outbreakId,
                disease,
                alertLevel,
                message,
                phoneNumber: phoneWithCode,  // ✅ CRITICAL: Added this field
                status: 'failed',
                error: error.message,  // ✅ Store error message
                sentAt: new Date()
            });
            console.log(`✅ Failed alert logged to database`);
        } catch (saveError) {
            console.error(`❌ Failed to save error alert:`, saveError.message);
        }

        return { success: false, error: error.message };
    }
};

export const sendBulkAlerts = async (users, message, outbreakId, disease, alertLevel) => {

    console.log("📦 sendBulkAlerts() received:", {
        users: users.length,
        outbreakId,
        disease,
        alertLevel
    });

    // ✅ FIX: Debug user data
    console.log("👥 User details:");
    users.forEach(u => {
        console.log(`   - ${u.name}: phone=${u.phoneNumber}, id=${u._id}`);
    });

    let sentCount = 0;

    for (const user of users) {
        // ✅ FIX: Validate phoneNumber exists
        if (!user.phoneNumber) {
            console.error(`❌ SKIP: User ${user._id} (${user.name || 'Unknown'}) has no phoneNumber`);
            continue;
        }

        const phone = user.phoneNumber;

        const result = await sendWhatsAppMessage(
            phone,
            message,
            user._id,
            outbreakId,
            disease,
            alertLevel
        );

        if (result.success) sentCount++;

        // Rate limiting: delay between messages
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`📊 Bulk Alerts Summary: ${sentCount}/${users.length} sent successfully`);
    return sentCount;  // ✅ Return count for controller
};
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// ========================================
// Send SMS to multiple users (same as WhatsApp function)
// ========================================
export const sendBulkSMS = async (users, message) => {
    try {
        console.log(`📤 Starting bulk SMS to ${users.length} users...`);

        let successCount = 0;

        for (const user of users) {
            // Skip if no phone number
            if (!user.phoneNumber) {
                console.log(`⚠️ No phone for ${user.name}`);
                continue;
            }

            try {
                // Format phone number
                const phone = user.phoneNumber.startsWith('+') 
                    ? user.phoneNumber 
                    : `+91${user.phoneNumber}`;

                // Send SMS
                await client.messages.create({
                    body: message,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: phone
                });

                successCount++;
                console.log(`✅ SMS sent to ${user.name} (${phone})`);

                // Wait 100ms to avoid rate limit
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.error(`❌ SMS failed for ${user.name}:`, error.message);
            }
        }

        console.log(`✅ SMS Complete: ${successCount}/${users.length} sent`);
        return successCount;

    } catch (error) {
        console.error('❌ Bulk SMS Error:', error);
        return 0;
    }
};
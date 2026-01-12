import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing in your .env file.");
    return null;
  }

  try {
    console.log(`Sending premium welcome email to: ${userEmail}`);

    const { data, error } = await resend.emails.send({
      from: 'The Digital Roast <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'ברוכים הבאים ל-The Digital Roast! ☕',
      html: `
      <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFCF0; border-radius: 20px; overflow: hidden; border: 1px solid #E5E7EB;">
        <div style="background-color: #2D1B14; padding: 40px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 28px;">ברוכים הבאים, ${userName}!</h1>
        </div>
        <div style="padding: 40px; color: #2D1B14; line-height: 1.6; text-align: center;">
          <p style="font-size: 18px;">איזה כיף שהצטרפת לקהילת הקפה הדיגיטלית שלנו.</p>
          <p>מעכשיו תוכלו ליצור תמונות קפה מדהימות ב-AI, לשמור את המועדפים שלכם ולבצע הזמנות בקלות.</p>
          
          <div style="margin: 40px 0; padding: 30px; background-color: #FFFFFF; border-radius: 15px; border: 1px dashed #CAB3A3;">
            <p style="margin: 0; font-weight: bold; color: #8B4513;">הקפה הראשון שלך כבר מחכה שתעצב אותו...</p>
          </div>
          
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" style="display: inline-block; background-color: #2D1B14; color: #FFFFFF; padding: 15px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">חזרה לאתר</a>
        </div>
        <div style="background-color: #F3F4F6; padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF;">
          © 2026 The Digital Roast. כל הזכויות שמורות.
        </div>
      </div>
    `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return null;
    }

    console.log("Welcome email sent successfully via Resend!");
    return data;
  } catch (error) {
    console.error("Fatal error in mailer system:", error);
    return null;
  }
};

export const sendLoginEmail = async (userEmail: string, userName: string) => {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: 'The Digital Roast <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'התחברת בהצלחה! ☕ | The Digital Roast',
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFCF0; border-radius: 24px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <!-- Header with Gradient -->
          <div style="background: linear-gradient(135deg, #2D1B14 0%, #4A2C21 100%); padding: 50px 40px; text-align: center;">
            <div style="display: inline-block; background: rgba(255,255,255,0.1); padding: 15px; border-radius: 50%; margin-bottom: 20px;">
              <span style="font-size: 40px;">☕</span>
            </div>
            <h1 style="color: #FFFFFF; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">ברוכים השבים, ${userName}!</h1>
          </div>

          <!-- Content Body -->
          <div style="padding: 40px; color: #2D1B14; line-height: 1.8; text-align: center;">
            <div style="margin-bottom: 30px;">
              <p style="font-size: 18px; margin: 0; font-weight: 500;">זיהינו התחברות חדשה לחשבון שלך.</p>
              <p style="font-size: 15px; color: #6B7280; margin-top: 5px;">אנחנו דואגים שהקפה שלך (והחשבון שלך) יישאר בטוח.</p>
            </div>
            
            <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; padding: 25px; margin: 30px 0; display: inline-block; min-width: 250px;">
              <div style="font-size: 13px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">פרטי התחברות</div>
              <div style="font-size: 16px; font-weight: 700; color: #8B4513;">📅 ${new Date().toLocaleDateString('he-IL')}</div>
              <div style="font-size: 16px; font-weight: 700; color: #8B4513;">🕒 ${new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>

            <div style="margin-top: 20px;">
              <a href="${(process.env.NEXTAUTH_URL || 'http://localhost:3000')}/gallery" style="display: inline-block; background-color: #2D1B14; color: #FFFFFF; padding: 16px 40px; text-decoration: none; border-radius: 14px; font-weight: bold; font-size: 16px; transition: all 0.3s ease;">מעבר לגלריה הדיגיטלית</a>
            </div>
          </div>

          <!-- Security Footer -->
          <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="margin: 0; font-size: 13px; color: #6B7280;">לא היית אתה? אל תלחץ, פשוט אפס את הסיסמה שלך.</p>
            <div style="margin-top: 15px; font-size: 11px; color: #9CA3AF;">
              © 2026 The Digital Roast AI Coffee Experience<br>
              נשלח באהבה מהבריסטה הדיגיטלי שלך ☕
            </div>
          </div>
        </div>
      `,
    });
    console.log(`Premium login email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending premium login email:", error);
  }
};

export const sendOrderConfirmationEmail = async (userEmail: string, userName: string, orderData: any) => {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const itemsHtml = orderData.items.map((item: any) => {
      const sizeBadge = item.size
        ? `<span style="display: inline-block; background: #FEF3C7; color: #92400E; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; margin-right: 6px;">${item.size === 'S' ? 'קטן' : item.size === 'M' ? 'בינוני' : 'גדול'}</span>`
        : '';

      return `
            <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; color: #4B5563;">
                    ${item.product?.name || 'מוצר'} ${sizeBadge} x ${item.quantity}
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; text-align: left; font-weight: bold; color: #2D1B14;">₪${(item.product?.price * item.quantity).toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    await resend.emails.send({
      from: 'The Digital Roast <onboarding@resend.dev>',
      to: [userEmail],
      subject: `אישור הזמנה #${orderData.id.slice(-6)} ☕ | The Digital Roast`,
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFCF0; border-radius: 24px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background: #2D1B14; padding: 30px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0; font-size: 22px;">תודה על ההזמנה שלך!</h1>
          </div>

          <!-- Body -->
          <div style="padding: 40px; color: #2D1B14;">
            <p style="font-size: 18px; margin-bottom: 20px;">היי ${userName},</p>
            <p>ההזמנה שלך התקבלה בהצלחה והיא כבר בדרך להכנה על ידי הבריסטה הדיגיטלי שלנו.</p>
            
            <div style="margin: 30px 0; padding: 25px; background: #FFFFFF; border-radius: 16px; border: 1px solid #E5E7EB;">
              <h3 style="margin-top: 0; color: #8B4513; border-bottom: 2px solid #FDFCF0; padding-bottom: 10px;">סיכום הזמנה #${orderData.id.slice(-6)}</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                ${itemsHtml}
                <tr>
                  <td style="padding: 20px 0 0; font-size: 18px; font-weight: 800;">סה"כ לתשלום:</td>
                  <td style="padding: 20px 0 0; text-align: left; font-size: 18px; font-weight: 800; color: #8B4513;">₪${orderData.total.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 14px; color: #6B7280;">הקפה שלך יהיה מוכן בקרוב!</p>
              <a href="${(process.env.NEXTAUTH_URL || 'http://localhost:3000')}/orders" style="display: inline-block; background-color: #2D1B14; color: #FFFFFF; padding: 14px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 15px;">צפייה בהזמנות שלי</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB; font-size: 12px; color: #9CA3AF;">
            © 2026 The Digital Roast AI. כל הזכויות שמורות.
          </div>
        </div>
      `,
    });
    console.log(`Order confirmation email sent to ${userEmail} for order ${orderData.id}`);
  } catch (error) {
    console.error("Error sending order email:", error);
  }
};

export const sendNewsletterEmail = async (userEmail: string) => {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: 'The Digital Roast <onboarding@resend.dev>',
      to: [userEmail],
      subject: '☕ ברוכים הבאים למועדון הקפה הדיגיטלי!',
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFCF0; border-radius: 24px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2D1B14 0%, #4A2C21 100%); padding: 50px 40px; text-align: center;">
            <div style="display: inline-block; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 50%; margin-bottom: 20px;">
              <span style="font-size: 60px;">☕</span>
            </div>
            <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 800;">תודה שהצטרפת!</h1>
            <p style="color: #FFFFFF; opacity: 0.9; margin-top: 10px;">קיבלת 15% הנחה על ההזמנה הראשונה</p>
          </div>

          <!-- Coupon Code -->
          <div style="padding: 40px;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #6B3410 100%); border-radius: 16px; padding: 30px; text-align: center; box-shadow: 0 4px 15px rgba(139, 69, 19, 0.2);">
              <p style="margin: 0; color: #FFFFFF; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9;">קוד קופון שלך</p>
              <p style="margin: 10px 0 0; color: #FFFFFF; font-size: 32px; font-weight: 800; letter-spacing: 4px; font-family: monospace;">WELCOME15</p>
              <p style="margin: 10px 0 0; color: #FFFFFF; font-size: 12px; opacity: 0.8;">תקף ל-30 יום הקרובים</p>
            </div>

            <div style="margin-top: 40px; text-align: center;">
              <h2 style="color: #2D1B14; font-size: 22px; margin-bottom: 15px;">מה מחכה לך:</h2>
              <div style="text-align: right; color: #4B5563; line-height: 1.8;">
                <p>☕ גישה מוקדמת למוצרים חדשים</p>
                <p>🎨 יצירות AI בלעדיות מהבריסטה הדיגיטלי</p>
                <p>🎁 מבצעים והנחות מיוחדות</p>
                <p>📰 טיפים והמלצות שבועיות</p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <a href="${(process.env.NEXTAUTH_URL || 'http://localhost:3000')}" style="display: inline-block; background-color: #2D1B14; color: #FFFFFF; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">התחל לקנות עכשיו</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="margin: 0; font-size: 13px; color: #6B7280;">זה לא אתה? תוכל לבטל את המנוי בכל עת</p>
            <div style="margin-top: 15px; font-size: 11px; color: #9CA3AF;">
              © 2026 The Digital Roast AI Coffee Experience
            </div>
          </div>
        </div>
      `,
    });
    console.log(`Newsletter welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending newsletter email:", error);
  }
};

export const sendAIImageEmail = async (userEmail: string, imageUrl: string, prompt: string) => {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await resend.emails.send({
      from: 'The Digital Roast <onboarding@resend.dev>',
      to: [userEmail],
      subject: '🎨 התמונה שיצרת עם AI Barista',
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFCF0; border-radius: 24px; overflow: hidden; border: 1px solid #E5E7EB;">
          <div style="background: linear-gradient(135deg, #2D1B14 0%, #8B4513 100%); padding: 40px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0; font-size: 24px;">היצירה שלך מוכנה! ☕✨</h1>
          </div>

          <div style="padding: 40px; text-align: center;">
            <p style="font-size: 16px; color: #2D1B14; margin-bottom: 20px;">הנה התמונה שיצרת עם הבריסטה הדיגיטלי שלנו:</p>
            
            <div style="margin: 30px 0; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.1);">
              <img src="${imageUrl}" style="width: 100%; height: auto; display: block;" alt="AI Generated Coffee" />
            </div>

            <div style="background: #F9FAFB; padding: 20px; border-radius: 12px; text-align: right; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #6B7280;"><strong>התיאור שלך:</strong></p>
              <p style="margin: 10px 0 0; font-size: 15px; color: #2D1B14;">${prompt}</p>
            </div>

            <a href="${(process.env.NEXTAUTH_URL || 'http://localhost:3000')}/ai-barista" style="display: inline-block; background-color: #2D1B14; color: #FFFFFF; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 20px;">צור עוד יצירות</a>
          </div>

          <div style="background-color: #F9FAFB; padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF;">
            © 2026 The Digital Roast AI
          </div>
        </div>
      `,
    });
    console.log(`AI image email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending AI image email:", error);
  }
};

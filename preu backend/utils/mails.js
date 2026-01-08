import { createTransport } from "nodemailer"

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIl_PASS
    }
})

export const sendMail = async (email,otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Thanks for signing Up for PREU",
            html: `
                    <div style="background-color: #f4f7fa; padding: 50px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center;">
    <div style="max-width: 400px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e8ed;">
        <div style="background-color: #000000; padding: 25px;">
            <h1 style="margin: 0; color: #ffffff; font-size: 22px; letter-spacing: 2px; font-weight: 800;">PREU</h1>
            <p style="margin: 5px 0 0; color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Prompt Rate Use & Explore</p>
        </div>
        <div style="padding: 40px 30px;">
            <p style="margin: 0 0 25px 0; color: #444; font-size: 16px; font-weight: 500;">Your Verification Code</p>
            <div style="background-color: #f8f9fa; border: 2px solid #000000; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #000000;">
                    ${otp}
                </span>
            </div>
            <p style="margin: 0; color: #777; font-size: 13px; line-height: 1.5;">
                This code was sent by <strong>PREU</strong> to verify your account. It will expire in 10 minutes.
            </p>
        </div>
        <div style="background-color: #fafafa; padding: 20px; border-top: 1px solid #eeeeee;">
            <p style="margin: 0; color: #bbb; font-size: 11px;">&copy; 2026 PREU Official</p>
        </div>
    </div>
</div>
                `,
        }
        await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
      
    }
}
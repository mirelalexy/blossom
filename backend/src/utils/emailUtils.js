const RESEND_API_URL = "https://api.resend.com/emails"

export async function sendResetPasswordEmail(to, resetLink) {
    const res = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
            from: process.env.EMAIL_FROM,
            to,
            subject: "Reset your Blossom password",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Reset your Blossom password</title>
                </head>
                <body style="margin:0;padding:0;background:#f8f6f2;font-family:Arial,Helvetica,sans-serif;color:#3b3b3b;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;padding:48px 40px;">
                                    <tr>
                                        <td align="center">
                                            <h1 style="margin:0;font-size:28px;font-weight:700;color:#3b3b3b;">
                                                🌸 Blossom
                                            </h1>

                                            <h2 style="margin:0 0 16px;font-size:24px;color:#3b3b3b;">
                                                Reset your password
                                            </h2>

                                            <p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#555;">
                                                I received a request to reset your password. Click the button below to choose a new one.
                                            </p>

                                            <table role="presentation" cellspacing="0" cellpadding="0" align="center">
                                                <tr>
                                                    <td align="center" bgcolor="#c05878" style="border-radius:999px;">
                                                        <a
                                                            href="${resetLink}"
                                                            style="
                                                                display:inline-block;
                                                                background:#c05878;
                                                                color:#ffffff;
                                                                text-decoration:none;
                                                                padding:14px 28px;
                                                                border-radius:999px;
                                                                font-size:16px;
                                                                font-weight:600;
                                                            "
                                                        >
                                                            Choose a new password
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>

                                            <p style="margin:32px 0 0;font-size:14px;line-height:1.6;color:#777;">
                                                This link will expire in <strong>1 hour</strong>.
                                            </p>

                                            <p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#777;">
                                                If you didn't request a password reset, you can safely ignore this email. Your password won't change.
                                            </p>

                                            <hr style="margin:40px 0;border:none;border-top:1px solid #eeeeee;" />

                                            <p style="margin:0;font-size:12px;color:#999;line-height:1.5;">
                                                If the button doesn't work, copy and paste this link into your browser:
                                            </p>

                                            <p style="margin:12px 0 0;font-size:12px;word-break:break-all;color:#666;">
                                                ${resetLink}
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin-top:20px;font-size:12px;color:#999;">
                                    © 2026 Blossom. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        })
    })

    if (!res.ok) {
        const errorText = await res.text()
        console.error("Resend API error: ", res.status, errorText)
        throw new Error("Failed to send reset email")
    }
}
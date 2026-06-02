const escapeHtml = (str) =>
  String(str).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  )

export const template = (name, email, subject, message) => {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message)

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Notification</title>
        <style>
            body, table, td, a {
                font-family: Arial, sans-serif;
                font-size: 14px;
                color: #333;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            .header {
                background-color: #007bff;
                padding: 20px 0;
                text-align: center;
                color: #fff;
            }
            .content {
                padding: 20px;
            }
            .footer {
                background-color: #f5f5f5;
                padding: 20px;
                text-align: center;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <table>
            <tr>
                <td class="header">
                    <h1>Email Notification</h1>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <h2>From: ${safeEmail}</h2>
                    <h2>${safeName}</h2>
                    <h3>Subject: ${safeSubject}</h3>
                    <p>
                        ${safeMessage}
                    </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p>Thank you for using our service.</p>
                </td>
            </tr>
        </table>
    </body>
    </html>`
}

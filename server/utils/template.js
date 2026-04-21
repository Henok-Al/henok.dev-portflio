export const template = (name, email, subject, message) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Notification</title>
        <style>
            /* Reset some default styles to ensure consistent rendering */
            body, table, td, a {
                font-family: Arial, sans-serif;
                font-size: 14px;
                color: #333;
            }
        
            /* Make the email container full width */
            table {
                width: 100%;
                border-collapse: collapse;
            }
        
            /* Style the email header */
            .header {
                background-color: #007bff;
                padding: 20px 0;
                text-align: center;
                color: #fff;
            }
        
            /* Style the email content */
            .content {
                padding: 20px;
            }
        
            /* Style the email footer */
            .footer {
                background-color: #f5f5f5;
                padding: 20px;
                text-align: center;
            }
        
            /* Style the email button */
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
                    <h2>From: ${email}</h2>
                    <h2>${name}</h2>
                    <h3>Subject: ${subject}</h3>
                    <p>
                        ${message}
                    </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p>Thank you for using our service.</p>
                    <a href="#" class="btn">Visit Our Website</a>
                </td>
            </tr>
        </table>
    </body>
    </html>`
}

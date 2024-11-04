require('dotenv').config()

const signUp = (verification_code) => {
  const template = `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Starjobs Account</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #000;">
      <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="background-color: #f9f9f9;">
        <tr>
          <td align="center">
            <table width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 100%; background-color: #ffffff; margin: 20px auto;">
              
              <!-- Header Section -->
              <tr>
                <td align="center" style="background-color: #0061bf; padding: 20px;">
                  <img src="https://assets.unlayer.com/projects/147811/1680071619852-starjobs-whole-white-text.png" alt="Starjobs" style="width: 70%; height: auto; border: 0;">
                </td>
              </tr>

              <!-- Content Section -->
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h1 style="font-size: 24px; color: #000; margin: 0; font-family: Arial, sans-serif;">Verify Your Starjobs Account</h1>
                  <p style="font-size: 16px; line-height: 1.5; color: #333; font-family: Arial, sans-serif; margin: 10px 0;">
                    Thanks for signing up! Please use the code below to verify your email address and start exploring our platform.
                  </p>
                  
                  <!-- Verification Code -->
                  <p style="margin: 20px 0;">
                    <a href="#" style="display: inline-block; padding: 15px 30px; background-color: #0061bf; color: #fff; font-size: 20px; text-decoration: none; font-weight: bold; border-radius: 5px; font-family: Arial, sans-serif;">
                      ${verification_code}
                    </a>
                  </p>
                </td>
              </tr>

              <!-- Footer Section -->
              <tr>
                <td align="center" style="background-color: #d9d9d9; padding: 20px; font-size: 14px; color: #555; font-family: Arial, sans-serif;">
                  <p style="margin: 0;">Thanks,<br>Starjobs Team</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  return template
}

module.exports = signUp

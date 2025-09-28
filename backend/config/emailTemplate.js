export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>Welcome Email</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
      text-align: left;
    }

    .button {
      width: 100%;
      background: #4C83EE;
      text-decoration: none;
      display: inline-block;
      padding: 12px 0;
      color: #fff;
      font-size: 15px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    .header {
      background-color: #4C83EE;
      color: #fff;
      padding: 24px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 85% !important;
      }

      .button {
        width: 70% !important;
      }
    }
  </style>
</head>

<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#F6FAFB">
    <tbody>
      <tr>
        <td valign="top" align="center">
          <table class="container" width="600" cellspacing="0" cellpadding="0" border="0">
            <tbody>
              <tr>
                <td class="header">
                  🎉 Welcome to Our Community!
                </td>
              </tr>
              <tr>
                <td class="main-content">
                  <p style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">
                    Hi {{name}},
                  </p>
                  <p style="font-size: 14px; line-height: 150%; margin-bottom: 16px;">
                    We’re excited to have you on board! Your account with <span style="color: #4C83EE;">{{email}}</span> has been created successfully.
                  </p>
                  <p style="font-size: 14px; line-height: 150%; margin-bottom: 24px;">
                    Start exploring your dashboard, discover new features, and make the most out of our platform.
                  </p>
                  <a href="{{loginUrl}}" class="button">Go to Dashboard</a>
                  <p style="font-size: 13px; color: #555; margin-top: 24px;">
                    If you did not sign up for this account, please ignore this email.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;

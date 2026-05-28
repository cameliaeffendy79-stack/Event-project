export function welcomeEmailTemplate(
  name: string
) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f7fb;
          padding: 40px;
        }

        .container {
          max-width: 600px;
          margin: auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .header {
          background: #2563eb;
          color: white;
          padding: 32px;
          text-align: center;
        }

        .content {
          padding: 32px;
          color: #334155;
          line-height: 1.7;
        }

        .button {
          display: inline-block;
          margin-top: 24px;
          padding: 12px 24px;
          background: #2563eb;
          color: white !important;
          text-decoration: none;
          border-radius: 10px;
          font-weight: bold;
        }

        .footer {
          padding: 24px;
          text-align: center;
          font-size: 13px;
          color: #94a3b8;
        }
      </style>
    </head>

    <body>
      <div class="container">

        <div class="header">
          <h1>Welcome to Event Hub 🎉</h1>
        </div>

        <div class="content">
          <h2>Hello ${name} 👋</h2>

          <p>
            Your account has been registered successfully.
          </p>

          <p>
            Explore amazing events, manage your tickets,
            and enjoy the experience with Event Hub.
          </p>

          <a 
            href="http://localhost:3000"
            class="button"
          >
            Explore Events
          </a>
        </div>

        <div class="footer">
          © 2026 Event Hub. All rights reserved.
        </div>

      </div>
    </body>
  </html>
  `;
}
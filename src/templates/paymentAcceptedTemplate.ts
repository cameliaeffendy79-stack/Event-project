export function paymentAcceptedTemplate(
  name: string,
  eventTitle: string
) {
  return `
    <div style="
      font-family: Arial;
      padding: 40px;
      background: #f8fafc;
    ">
      <div style="
        max-width: 600px;
        margin: auto;
        background: white;
        padding: 40px;
        border-radius: 16px;
      ">
        <h1 style="color:#16a34a">
          Payment Accepted ✅
        </h1>

        <p>Hello ${name},</p>

        <p>
          Your payment for
          <b>${eventTitle}</b>
          has been accepted.
        </p>

        <p>
          Thank you for purchasing tickets
          with Event Hub 🎉
        </p>
      </div>
    </div>
  `;
}
export function paymentRejectedTemplate(
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
        <h1 style="color:#dc2626">
          Payment Rejected ❌
        </h1>

        <p>Hello ${name},</p>

        <p>
          Your payment for
          <b>${eventTitle}</b>
          was rejected.
        </p>

        <p>
          Please upload valid payment proof
          and try again.
        </p>
      </div>
    </div>
  `;
}
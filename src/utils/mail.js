import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "BookBazaar",
    //   link: "",
    },
  });

  const emailText = mailGenerator.generatePlaintext(options.mailGenContent);
  const emailHTML = mailGenerator.generate(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const email = {
    from: process.env.MAILTRAP_SMTP_SENDEREMAIL,
    to: options.email,
    subject: `Your BookBazaar Order Confirmation #${order._id}`,
    text: emailText,
    html: emailHTML,
  };

  try {
    await transporter.sendMail(email);
  } catch (error) {
    console.error("Email failed", error);
  }
};

const orderConfirmedMailGenContent = (fullName, order) => {
  return {
    body: {
      name: fullName || "Customer",
      intro: `Thank you for your order! Your order number is <strong>${order._id}</strong>. We’re getting it ready for shipping.`,
      table: {
        data: order.items.map((item) => ({
          Item: item.book.title,
          Quantity: item.quantity,
          Price: `₹${item.priceAtPurchase}`,
        })),
        columns: {
          customWidth: {
            Item: "50%",
            Quantity: "25%",
            Price: "25%",
          },
          customAlignment: {
            Quantity: "center",
            Price: "right",
          },
        },
      },
    //   action: {
    //     instructions: "You can view your order details by clicking the button below:",
    //     button: {
    //       color: "#22BC66", // Optional action button color
    //       text: "View Your Order",
    //     //   link:  // frontend URL with orderId,
    //     },
    //   }, //TODO: frontend needed
      outro: "If you need help, just reply to this email. Thanks for shopping with BookBazaar!",
    },
  };
};

export { sendMail, orderConfirmedMailGenContent };

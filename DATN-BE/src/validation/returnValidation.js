const nodemailer = require("nodemailer");

// Cấu hình email transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Templates email
const emailTemplates = {
  returnRequested: {
    subject: "Yêu cầu hoàn hàng đã được gửi - Đơn hàng #{orderId}",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Yêu cầu hoàn hàng đã được gửi</h2>
        <p>Chào {customerName},</p>
        <p>Chúng tôi đã nhận được yêu cầu hoàn hàng cho đơn hàng <strong>#{orderId}</strong>.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Chi tiết yêu cầu:</h3>
          <p><strong>Lý do hoàn hàng:</strong> {returnReason}</p>
          <p><strong>Mô tả:</strong> {returnDescription}</p>
          <p><strong>Ngày yêu cầu:</strong> {requestDate}</p>
        </div>
        
        <p>Chúng tôi sẽ xem xét yêu cầu của bạn trong vòng 24-48 giờ và thông báo kết quả qua email.</p>
        <p>Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi!</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          Email này được gửi tự động, vui lòng không reply.
        </p>
      </div>
    `,
  },

  returnApproved: {
    subject: "Yêu cầu hoàn hàng đã được chấp nhận - Đơn hàng #{orderId}",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Yêu cầu hoàn hàng đã được chấp nhận</h2>
        <p>Chào {customerName},</p>
        <p>Yêu cầu hoàn hàng cho đơn hàng <strong>#{orderId}</strong> đã được chấp nhận.</p>
        
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #155724;">Thông tin hoàn tiền:</h3>
          <p><strong>Số tiền hoàn:</strong> {refundAmount} VND</p>
          <p><strong>Phương thức hoàn tiền:</strong> {refundMethod}</p>
          <p><strong>Thời gian xử lý:</strong> 3-7 ngày làm việc</p>
        </div>
        
        {adminNote}
        
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          Email này được gửi tự động, vui lòng không reply.
        </p>
      </div>
    `,
  },

  returnRejected: {
    subject: "Yêu cầu hoàn hàng bị từ chối - Đơn hàng #{orderId}",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Yêu cầu hoàn hàng bị từ chối</h2>
        <p>Chào {customerName},</p>
        <p>Rất tiếc, yêu cầu hoàn hàng cho đơn hàng <strong>#{orderId}</strong> đã bị từ chối.</p>
        
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #721c24;">Lý do từ chối:</h3>
          <p>{adminNote}</p>
        </div>
        
        <p>Nếu bạn có thắc mắc hoặc muốn khiếu nại, vui lòng liên hệ với chúng tôi:</p>
        <ul>
          <li>Email: support@yourstore.com</li>
          <li>Hotline: 1900-xxxx</li>
        </ul>
        
        <p>Cảm ơn bạn đã hiểu và thông cảm!</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          Email này được gửi tự động, vui lòng không reply.
        </p>
      </div>
    `,
  },
};

// Mapping lý do hoàn hàng sang tiếng Việt
const returnReasonLabels = {
  defective_product: "Sản phẩm bị lỗi",
  wrong_item: "Giao sai sản phẩm",
  damaged_shipping: "Hư hỏng trong quá trình vận chuyển",
  not_as_described: "Không đúng mô tả",
  quality_issue: "Vấn đề về chất lượng",
  size_issue: "Vấn đề về kích thước",
  changed_mind: "Thay đổi ý kiến",
  other: "Lý do khác",
};

class NotificationService {
  // Gửi email yêu cầu hoàn hàng
  static async sendReturnRequestEmail(order) {
    try {
      const template = emailTemplates.returnRequested;

      const html = template.html
        .replace(/{customerName}/g, order.fullName)
        .replace(/{orderId}/g, order._id)
        .replace(
          /{returnReason}/g,
          returnReasonLabels[order.returnInfo.returnReason]
        )
        .replace(
          /{returnDescription}/g,
          order.returnInfo.returnDescription || "Không có mô tả"
        )
        .replace(
          /{requestDate}/g,
          new Date(order.returnInfo.requestDate).toLocaleString("vi-VN")
        );

      const mailOptions = {
        from: process.env.FROM_EMAIL || "noreply@yourstore.com",
        to: order.email,
        subject: template.subject.replace(/{orderId}/g, order._id),
        html: html,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email yêu cầu hoàn hàng đã gửi cho ${order.email}`);
    } catch (error) {
      console.error("Lỗi gửi email yêu cầu hoàn hàng:", error);
    }
  }

  // Gửi email chấp nhận hoàn hàng
  static async sendReturnApprovedEmail(order) {
    try {
      const template = emailTemplates.returnApproved;

      const adminNoteHtml = order.returnInfo.adminNote
        ? `<p><strong>Ghi chú từ admin:</strong> ${order.returnInfo.adminNote}</p>`
        : "";

      const html = template.html
        .replace(/{customerName}/g, order.fullName)
        .replace(/{orderId}/g, order._id)
        .replace(/{refundAmount}/g, order.totalAmount.toLocaleString("vi-VN"))
        .replace(
          /{refundMethod}/g,
          this.getRefundMethodLabel(order.paymentMethod)
        )
        .replace(/{adminNote}/g, adminNoteHtml);

      const mailOptions = {
        from: process.env.FROM_EMAIL || "noreply@yourstore.com",
        to: order.email,
        subject: template.subject.replace(/{orderId}/g, order._id),
        html: html,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email chấp nhận hoàn hàng đã gửi cho ${order.email}`);
    } catch (error) {
      console.error("Lỗi gửi email chấp nhận hoàn hàng:", error);
    }
  }

  // Gửi email từ chối hoàn hàng
  static async sendReturnRejectedEmail(order) {
    try {
      const template = emailTemplates.returnRejected;

      const html = template.html
        .replace(/{customerName}/g, order.fullName)
        .replace(/{orderId}/g, order._id)
        .replace(
          /{adminNote}/g,
          order.returnInfo.adminNote || "Không có lý do cụ thể"
        );

      const mailOptions = {
        from: process.env.FROM_EMAIL || "noreply@yourstore.com",
        to: order.email,
        subject: template.subject.replace(/{orderId}/g, order._id),
        html: html,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email từ chối hoàn hàng đã gửi cho ${order.email}`);
    } catch (error) {
      console.error("Lỗi gửi email từ chối hoàn hàng:", error);
    }
  }

  // Gửi thông báo cho admin về yêu cầu hoàn hàng mới
  static async sendNewReturnRequestToAdmin(order) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b35;">Yêu cầu hoàn hàng mới</h2>
          <p>Có yêu cầu hoàn hàng mới cần xử lý:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
            <p><strong>Khách hàng:</strong> ${order.fullName} (${
        order.email
      })</p>
            <p><strong>Lý do hoàn hàng:</strong> ${
              returnReasonLabels[order.returnInfo.returnReason]
            }</p>
            <p><strong>Mô tả:</strong> ${
              order.returnInfo.returnDescription || "Không có mô tả"
            }</p>
            <p><strong>Số tiền:</strong> ${order.totalAmount.toLocaleString(
              "vi-VN"
            )} VND</p>
            <p><strong>Ngày yêu cầu:</strong> ${new Date(
              order.returnInfo.requestDate
            ).toLocaleString("vi-VN")}</p>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.ADMIN_URL}/orders/${order._id}" 
               style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Xem chi tiết và xử lý
            </a>
          </p>
        </div>
      `;

      const mailOptions = {
        from: process.env.FROM_EMAIL || "noreply@yourstore.com",
        to: process.env.ADMIN_EMAIL || "admin@yourstore.com",
        subject: `Yêu cầu hoàn hàng mới - Đơn hàng #${order._id}`,
        html: html,
      };

      await transporter.sendMail(mailOptions);
      console.log("Email thông báo admin đã gửi");
    } catch (error) {
      console.error("Lỗi gửi email thông báo admin:", error);
    }
  }

  // Helper: Lấy nhãn phương thức hoàn tiền
  static getRefundMethodLabel(paymentMethod) {
    const labels = {
      cod: "Chuyển khoản ngân hàng",
      vnpay: "Hoàn tiền qua VNPay",
      bank_transfer: "Chuyển khoản ngân hàng",
    };
    return labels[paymentMethod] || "Chuyển khoản ngân hàng";
  }
}

module.exports = NotificationService;

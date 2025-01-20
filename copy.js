// START
import nodemailer from "nodemailer";

//config smtp
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "he186184tranxuanchien@gmail.com",
        pass: "psnl rmpj tsqt koks",
    },
});

export const sendEmail = async (mailInfo) => {
    const { to, subject, text } = mailInfo;

    try {
        const mailOptions = {
            from: "he186184tranxuanchien@gmail.com",
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log("mail sent successfully");
    } catch (err) {
        console.log("mail sent faled: ", err);
        throw err;
    }
};

// END


// START

const otpStore = new Map(); // Bộ nhớ tạm thời lưu OTP
export const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Vui lòng cung cấp email." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // Hết hạn sau 5 phút

    // Lưu OTP vào bộ nhớ tạm
    otpStore.set(email, { otp, expiresAt });

    // Gửi OTP qua email (sử dụng Nodemailer)
    try {
        await sendEmail({
            to: email,
            subject: "Verify your account",
            text: `OTP code: ${otp}`,
        }); // Hàm gửi email từ Nodemailer
        res.status(200).json({ message: "OTP đã được gửi tới email của bạn." });
    } catch (error) {
        res.status(500).json({ message: "Không thể gửi OTP. Vui lòng thử lại." });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Vui lòng cung cấp email và OTP." });
    }

    const storedOtp = otpStore.get(email);

    // Kiểm tra OTP và thời gian hết hạn
    if (!storedOtp || storedOtp.otp !== otp) {
        return res.status(400).json({
            message: "OTP không hợp lệ.",
        });
    }

    if (Date.now() > storedOtp.expiresAt) {
        return res.status(400).json({ message: "OTP đã hết hạn." });
    }

    // Xác thực thành công: Cập nhật trạng thái tài khoản
    await User.update(
        { status: "active" },
        {
            where: { email: email },
        },
    );

    otpStore.delete(email); // Xóa OTP khỏi bộ nhớ
    res.status(200).json({
        message: "Xác thực OTP thành công, tài khoản của bạn đã được kích hoạt!",
    });
};

export const sendNewPassword = (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "Vui lòng cung cấp email." });
    }

    // Generate random password
    const newPassword = cryptoRandomString({ length: 20, type: "alphanumeric" });

    try {
    } catch (error) {}
};

// END
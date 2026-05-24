# DevCheck - Giám sát thiết bị thời gian thực & Báo lỗi tự động

Ứng dụng di động giám sát phần cứng thời gian thực và tự động gửi log báo lỗi về máy chủ Backend, được xây dựng trên nền tảng **React Native** và **Expo**.

---

## ⚡ Hướng dẫn cài đặt & Chạy ứng dụng (1-Click Setup)

Để thuận tiện nhất cho lập trình viên, dự án này đã tích hợp **chương trình tự động hóa hoàn toàn**. Bạn không cần phải chạy nhiều dòng lệnh hay tự gỡ lỗi thủ công.

### Bước 1: Tải mã nguồn về máy
Mở Terminal/Command Prompt và chạy lệnh:
```bash
git clone https://github.com/vietgioi12321/Do_An.git
cd Do_An
```

### Bước 2: Chạy chương trình tự động
* Đảm bảo **Máy ảo Android** đã mở hoặc **Điện thoại Android thật** đã cắm cáp kết nối vào máy tính (đã bật USB Debugging).
* Thực hiện chạy file tự động tương ứng với Hệ điều hành của bạn:

| Hệ điều hành | Cách chạy |
| :--- | :--- |
| **Windows** | Double-click (nhấp đúp chuột) vào tệp **`run-app.bat`** trong thư mục dự án |
| **macOS / Linux** | Mở terminal tại thư mục dự án và chạy: **`bash run-app.sh`** |

> [!TIP]
> Bạn cũng có thể khởi động trình tự động bằng lệnh: `npm run start-easy`

---

## 🛠️ Chương trình tự động sẽ làm gì cho bạn?

Khi bạn kích hoạt file chạy tự động, chương trình sẽ tự động thực hiện các bước sau một cách trơn tru:
1. **Cài đặt thư viện:** Kiểm tra và chạy `npm install` nếu thư mục `node_modules` chưa có hoặc bị thiếu.
2. **Khởi tạo mã ký ứng dụng:** Tự động tạo tệp khóa ký `debug.keystore` (tệp này luôn bị ẩn khi tải từ GitHub về) giúp Android Gradle biên dịch thành công.
3. **Dọn dẹp thiết bị:** Tự động phát hiện điện thoại đang kết nối và gỡ phiên bản cũ nếu có để tránh lỗi xung đột chữ ký (`INSTALL_FAILED_UPDATE_INCOMPATIBLE`).
4. **Biên dịch & Khởi động:** Tự động biên dịch mã nguồn native và khởi chạy ứng dụng trực tiếp lên điện thoại/máy ảo của bạn.

---

## 📋 Yêu cầu môi trường tối thiểu
Để chương trình tự động có thể chạy hoàn hảo, máy tính của bạn cần cài đặt sẵn:
* **Node.js** (LTS 18.x trở lên).
* **Java Development Kit (JDK)** phiên bản 17 hoặc 18 (Để biên dịch mã nguồn Android).
* **Android Studio & Android SDK** (Đã cấu hình biến môi trường `ANDROID_HOME`).

---

## ⚙️ Cấu hình tùy chọn (Cho nhà phát triển)
Nếu bạn muốn thử nghiệm việc gửi log phần cứng và bug về máy chủ của riêng mình, hãy mở tệp [App.tsx](file:///d:/Do_An/RealTime2/Do_An/App.tsx) và thay thế địa chỉ IP demo tại:
* **Hàm `sendErrorToServer` (Dòng 30):** Cập nhật URL server nhận báo lỗi.
* **Hàm `sendHardwareInfoOnLaunch` (Dòng 54):** Cập nhật URL server nhận log phần cứng khi mở ứng dụng.

---
Chúc bạn thiết lập và sử dụng dự án thành công một cách nhanh chóng và dễ dàng nhất! Nếu có câu hỏi hoặc đóng góp ý kiến, xin vui lòng tạo Issue trên Github.

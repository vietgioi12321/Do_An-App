# DevCheck - Management Bug + Error & Device Monitoring

**DevCheck** là một ứng dụng di động xây dựng trên nền tảng **React Native** và **Expo**. Ứng dụng cung cấp khả năng giám sát trạng thái thiết bị theo thời gian thực (bao gồm Pin, CPU, Mạng, Danh sách Ứng dụng, Màn hình) và tích hợp hệ thống báo lỗi tự động qua **Sentry** cũng như gửi log chi tiết về máy chủ trung tâm.

---

## 📋 Mục lục
1. [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
2. [Hướng dẫn cài đặt](#%EF%B8%8F-hướng-dẫn-cài-đặt)
3. [Hướng dẫn chạy dự án](#%EF%B8%8F-hướng-dẫn-chạy-dự-án)
4. [Cấu hình bổ sung](#%EF%B8%8F-cấu-hình-bổ-sung)
5. [Hướng dẫn đẩy dự án lên GitHub](#-hướng-dẫn-đẩy-dự-án-lên-github)

---

## 💻 Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
- **Node.js** (Phiên bản khuyến nghị: LTS từ 18.x trở lên)
- **NPM** (đi kèm khi cài đặt Node.js) hoặc **Yarn**
- **Git** (để quản lý phiên bản và đẩy code lên GitHub)
- Để chạy thử ứng dụng trên điện thoại:
  - Cài đặt ứng dụng **Expo Go** trên điện thoại từ App Store (iOS) hoặc Google Play Store (Android).
  - Hoặc cấu hình **Android Studio Emulator** (Android) / **Xcode Simulator** (macOS - iOS) nếu muốn chạy giả lập.

---

## 🛠️ Hướng dẫn cài đặt

Làm theo các bước sau để thiết lập môi trường chạy dự án trên máy của bạn:

1. **Mở Terminal/Command Prompt** và di chuyển vào thư mục dự án:
   ```bash
   cd d:/Do_An/RealTime/App
   ```

2. **Cài đặt các gói phụ thuộc (dependencies):**
   Chạy lệnh dưới đây để tải về tất cả các thư viện cần thiết đã định nghĩa sẵn trong `package.json`:
   ```bash
   npm install
   ```
   *Lưu ý: Quá trình này có thể mất vài phút tùy thuộc vào tốc độ mạng của bạn.*

---

## 🚀 Hướng dẫn chạy dự án

Dự án này sử dụng Expo CLI để biên dịch và chạy. Có 2 cách chạy phổ biến:

### Cách 1: Chạy bằng công cụ Expo Start (Khuyến nghị & Tiện lợi nhất)
1. Khởi động Expo Server:
   ```bash
   npx expo start
   ```
2. Trên màn hình Terminal sẽ xuất hiện một **mã QR**.
3. **Chạy trên điện thoại thật:**
   - **Android:** Mở ứng dụng **Expo Go**, chọn "Scan QR Code" và quét mã trên màn hình terminal.
   - **iOS:** Mở ứng dụng **Camera** mặc định, quét mã QR và chọn mở bằng ứng dụng **Expo Go**.
4. **Chạy trên trình giả lập:**
   - Nhấn phím `a` trên bàn phím để chạy giả lập Android.
   - Nhấn phím `i` trên bàn phím để chạy giả lập iOS.

### Cách 2: Chạy trực tiếp qua các script định nghĩa sẵn
Bạn cũng có thể khởi chạy ứng dụng trực tiếp bằng các lệnh sau:
- **Chạy trên Android (Giả lập hoặc máy cắm cáp USB debug):**
  ```bash
  npm run android
  ```
- **Chạy trên iOS:**
  ```bash
  npm run ios
  ```

---

## ⚙️ Cấu hình bổ sung

### 1. File `.gitignore`
Chúng tôi đã khởi tạo sẵn file `.gitignore` tiêu chuẩn cho dự án. File này giúp bỏ qua các thư mục nặng hoặc không cần thiết khi đẩy lên GitHub như:
- `node_modules/` (thư mục thư viện cài đặt)
- `.expo/` (bộ nhớ đệm của expo)
- Các file build tạm thời của Android/iOS và các file cấu hình môi trường `.env`.

### 2. Cấu hình Server gửi Logs & Sentry
- **Sentry DSN:** Cấu hình khởi tạo ở dòng 15 của [App.tsx](file:///d:/Do_An/RealTime/App/App.tsx). Bạn có thể thay đổi `dsn` bằng khóa Sentry của riêng bạn để quản lý bug trực quan.
- **Server API Logs:** API Server nhận logs phần cứng và log lỗi được cấu hình ở các hàm `sendErrorToServer` (dòng 30) và `sendHardwareInfoOnLaunch` (dòng 54). Hãy thay đổi địa chỉ IP (`192.168.1.9` hoặc địa chỉ ngrok) phù hợp với mạng LAN nội bộ hoặc máy chủ thực tế của bạn.

---

## 📤 Hướng dẫn đẩy dự án lên GitHub

Dưới đây là quy trình chi tiết từng bước để tạo kho lưu trữ (repository) trên GitHub và đẩy toàn bộ mã nguồn dự án lên:

### Bước 1: Kiểm tra Git đã cài đặt chưa
Mở Terminal và gõ:
```bash
git --version
```
*Nếu hiển thị thông tin phiên bản Git thì bạn có thể chuyển sang Bước 2. Nếu chưa có, hãy tải và cài đặt Git tại [git-scm.com](https://git-scm.com/).*

### Bước 2: Khởi tạo Git cục bộ (Local Git)
Chạy lệnh khởi tạo Git ngay tại thư mục dự án `d:/Do_An/RealTime/App`:
```bash
git init
```

### Bước 3: Thêm toàn bộ các tệp vào khu vực chuẩn bị (Staging Area)
Nhờ có file `.gitignore` mà các tệp tin rác hay `node_modules` sẽ tự động bị bỏ qua, bạn chỉ cần gõ:
```bash
git add .
```

### Bước 4: Tạo phiên bản cam kết đầu tiên (First Commit)
```bash
git commit -m "Initial commit: Khởi tạo dự án giám sát thiết bị và báo lỗi DevCheck"
```

### Bước 5: Tạo một Kho lưu trữ mới (Repository) trên GitHub
1. Truy cập vào trang web [GitHub](https://github.com/) và đăng nhập tài khoản của bạn.
2. Ở góc trên bên phải, nhấn nút **`+`** và chọn **`New repository`**.
3. Điền các thông tin:
   - **Repository name:** ví dụ `DevCheck-App` hoặc `RealTime-App`.
   - **Description:** (Tùy chọn) Mô tả ngắn gọn về dự án.
   - **Public/Private:** Chọn chế độ công khai hoặc riêng tư tùy bạn.
   - ⚠️ **QUAN TRỌNG:** Không tích chọn vào bất kỳ mục nào như *Add a README file*, *Add .gitignore*, hoặc *Choose a license* (vì chúng ta đã tạo cục bộ ở máy rồi, tạo thêm trên GitHub sẽ gây xung đột code).
4. Nhấn nút **`Create repository`**.

### Bước 6: Liên kết kho lưu trữ cục bộ với GitHub và đẩy code lên
Sau khi tạo xong, GitHub sẽ hiển thị các dòng lệnh hướng dẫn. Bạn copy và chạy lần lượt các lệnh sau vào terminal:

1. **Đặt tên nhánh chính là `main`:**
   ```bash
   git branch -M main
   ```

2. **Liên kết kho chứa từ xa (remote URL):**
   *Thay thế URL dưới đây bằng URL kho chứa thực tế vừa tạo trên GitHub của bạn:*
   ```bash
   git remote add origin https://github.com/tai-khoan-github-cua-ban/ten-repository.git
   ```

3. **Đẩy mã nguồn lên GitHub:**
   ```bash
   git push -u origin main
   ```
   *Hệ thống có thể yêu cầu đăng nhập tài khoản GitHub của bạn hoặc sử dụng Token cá nhân (Personal Access Token) để xác thực.*

---

Chúc bạn cài đặt thành công và đẩy dự án lên GitHub thuận lợi! Nếu gặp khó khăn hay lỗi trong quá trình thực hiện, đừng ngần ngại gửi tin nhắn yêu cầu hỗ trợ!

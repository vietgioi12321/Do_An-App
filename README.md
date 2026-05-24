# DevCheck - Management Bug + Error & Device Monitoring

**DevCheck** là một ứng dụng di động giám sát phần cứng thời gian thực và báo lỗi tự động được xây dựng trên nền tảng **React Native** và **Expo**. Ứng dụng cung cấp khả năng giám sát trạng thái thiết bị theo thời gian thực (bao gồm Pin, CPU, Mạng, Danh sách Ứng dụng, Màn hình) và tích hợp hệ thống báo lỗi tự động qua **Sentry** cũng như gửi log chi tiết về máy chủ trung tâm.

> [!IMPORTANT]
> Dự án này sử dụng các thư viện Native (như `react-native-fs` để đọc file hệ thống CPU và `react-native-device-info`). Do đó, **ứng dụng KHÔNG THỂ chạy trên Expo Go**. Bạn bắt buộc phải chạy dưới dạng **Development Build** trên máy ảo hoặc thiết bị thật.

---

## 📋 Mục lục
1. [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
2. [Hướng dẫn cài đặt & Cấu hình](#%EF%B8%8F-hướng-dẫn-cài-đặt--cấu-hình)
3. [Hướng dẫn chạy dự án](#%EF%B8%8F-hướng-dẫn-chạy-dự-án)
4. [Cấu hình Server Logs & Sentry](#%EF%B8%8F-cấu-hình-server-logs--sentry)
5. [Xử lý lỗi thường gặp (Troubleshooting)](#-xử-lý-lỗi-thường-gặp-troubleshooting)

---

## 💻 Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã được cài đặt và cấu hình đầy đủ các công cụ sau:
* **Node.js** (LTS từ phiên bản 18.x trở lên) và **NPM** (đi kèm Node.js).
* **Java Development Kit (JDK)** phiên bản 17 hoặc 18 (Cần thiết để biên dịch ứng dụng Android).
* **Android Studio & Android SDK**:
  * Cấu hình biến môi trường `ANDROID_HOME` trỏ đến thư mục SDK của bạn.
  * Cài đặt ít nhất một máy ảo (Android Emulator) hoặc chuẩn bị điện thoại Android thật đã bật **Gỡ lỗi USB (USB Debugging)**.
* **Git** để quản lý và tải mã nguồn.

---

## 🛠️ Hướng dẫn cài đặt & Cấu hình

Thực hiện lần lượt các bước dưới đây để thiết lập môi trường chạy dự án:

### Bước 1: Tải mã nguồn về máy cục bộ
Mở Terminal/Command Prompt và chạy lệnh clone dự án:
```bash
git clone https://github.com/vietgioi12321/Do_An.git
cd Do_An
```

### Bước 2: Cài đặt các thư viện phụ thuộc (Dependencies)
Chạy lệnh sau để tải và cài đặt tất cả các gói thư viện được định nghĩa sẵn trong `package.json`:
```bash
npm install
```

### Bước 3: Tạo tệp chứng chỉ ký ứng dụng (debug.keystore)
Do các tệp Keystore chứa mã hóa bảo mật thường bị bỏ qua bởi Git (`.gitignore`), bạn cần tự tạo một khóa ký debug nội bộ để Android Gradle có thể biên dịch ứng dụng thành công.

Chạy lệnh dưới đây trong Terminal của bạn (lệnh này hoạt động trên cả Windows và macOS/Linux nếu máy đã cài JDK):
```bash
keytool -genkey -v -keystore android/app/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
```
*Tệp `debug.keystore` sẽ tự động được tạo và đặt vào thư mục `android/app/`.*

---

## 🚀 Hướng dẫn chạy dự án

Do dự án chứa mã nguồn Native, chúng ta sẽ biên dịch trực tiếp ứng dụng gốc (Development Build) thay vì chạy trên ứng dụng Expo Go.

### Bước 1: Khởi động thiết bị thử nghiệm
* Đảm bảo **Máy ảo Android** của bạn đã khởi động và hoạt động ổn định.
* Hoặc cắm **Điện thoại Android thật** đã bật sẵn **USB Debugging** vào máy tính. Kiểm tra thiết bị đã kết nối thành công chưa bằng lệnh: `adb devices`.

### Bước 2: Biên dịch và chạy ứng dụng

* **Chạy trên Android (Giả lập hoặc điện thoại cắm cáp USB):**
  ```bash
  npm run android
  ```
  *(Lệnh này tương đương với: `npx expo run:android`)*

* **Chạy trên iOS (Yêu cầu hệ điều hành macOS và môi trường Xcode):**
  ```bash
  npm run ios
  ```
  *(Lệnh này tương đương với: `npx expo run:ios`)*

Hệ thống sẽ tự động khởi tạo Metro Bundler, tải mã nguồn, biên dịch ứng dụng thành file APK/App gốc và cài đặt trực tiếp vào thiết bị thử nghiệm của bạn.

---

## ⚙️ Cấu hình Server Logs & Sentry

Để hệ thống giám sát phần cứng hoạt động và gửi log về đúng máy chủ của bạn, hãy cập nhật cấu hình trong file [App.tsx](file:///d:/Do_An/RealTime2/Do_An/App.tsx):

### 1. Thay đổi Server nhận API Logs
Các hàm gửi log phần cứng và báo cáo lỗi lên server được định nghĩa tại `sendErrorToServer` (dòng 24) và `sendHardwareInfoOnLaunch` (dòng 51).
Hãy thay thế các IP tĩnh (`192.168.1.9` hoặc địa chỉ ngrok tạm thời) bằng địa chỉ IP LAN hoặc máy chủ Backend thực tế của bạn:
```typescript
// Ví dụ thay đổi IP LAN của máy tính chạy server Backend của bạn
const SERVER_URL = Platform.OS === 'android' ? 'http://<IP_LAN_CUA_BAN>:3000/api/logs' : 'http://localhost:3000/api/logs';
```

### 2. Cấu hình Sentry DSN
Khởi tạo Sentry nằm ở đầu tệp `App.tsx` (dòng 15). Hãy cập nhật khóa DSN từ tài khoản Sentry của bạn để theo dõi báo cáo lỗi trực quan:
```typescript
Sentry.init({
  dsn: 'https://<PUBLIC_KEY>@o0.ingest.sentry.io/<PROJECT_ID>',
  enableNative: true,
});
```

---

## 🔍 Xử lý lỗi thường gặp (Troubleshooting)

### Lỗi 1: `Keystore file not found for signing config 'debug'`
* **Mô tả:** Lỗi xảy ra khi trình biên dịch Gradle không tìm thấy chứng chỉ ký ứng dụng trong thư mục `android/app/`.
* **Cách sửa:** Đảm bảo bạn đã hoàn thành **Bước 3** trong phần cài đặt để sinh tệp `debug.keystore`.

### Lỗi 2: `INSTALL_FAILED_UPDATE_INCOMPATIBLE`
* **Mô tả:** Thiết bị thử nghiệm đã cài đặt sẵn một phiên bản cũ của ứng dụng `com.vietg.bugmonitoring` được ký bằng chữ ký khác, hệ điều hành Android từ chối cài đè.
* **Cách sửa:** Gỡ cài đặt thủ công bản cũ trên điện thoại/máy ảo, hoặc chạy lệnh sau trong Terminal rồi tiến hành chạy lại dự án:
  ```bash
  adb uninstall com.vietg.bugmonitoring
  ```

### Lỗi 3: Lỗi đỏ màn hình `TypeError: Cannot read property ... of null` khi mở bằng Expo Go
* **Mô tả:** Bạn đang quét mã QR bằng ứng dụng Expo Go trên điện thoại thay vì chạy Development Build.
* **Cách sửa:** Tắt Expo Go và sử dụng lệnh `npm run android` để build ứng dụng gốc như hướng dẫn ở trên.

---
Chúc bạn thiết lập và sử dụng dự án thành công! Nếu gặp bất kỳ khó khăn hay lỗi nào khác, đừng ngần ngại tạo Issue hoặc thảo luận trực tiếp!

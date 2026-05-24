const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Tiêu đề trang trí
console.log('==================================================');
console.log('🚀  CHƯƠNG TRÌNH TỰ ĐỘNG CÀI ĐẶT & CHẠY DỰ ÁN DEVCHECK  🚀');
console.log('==================================================\n');

try {
  // 1. Kiểm tra và cài đặt node_modules
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('📦 Không tìm thấy node_modules. Đang tự động cài đặt thư viện (npm install)...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Cài đặt thư viện thành công!\n');
  } else {
    console.log('✅ Thư mục node_modules đã có sẵn.\n');
  }

  // 2. Tự động kiểm tra và sinh file debug.keystore
  const keystorePath = path.join(__dirname, 'android', 'app', 'debug.keystore');
  if (!fs.existsSync(keystorePath)) {
    console.log('🔑 Không tìm thấy tệp chữ ký debug.keystore cho Android.');
    console.log('⚡ Đang tự động sinh debug.keystore bằng keytool...');
    
    // Đảm bảo thư mục android/app tồn tại trước khi ghi
    const androidAppDir = path.join(__dirname, 'android', 'app');
    if (!fs.existsSync(androidAppDir)) {
      fs.mkdirSync(androidAppDir, { recursive: true });
    }

    const keytoolCmd = `keytool -genkey -v -keystore "${keystorePath}" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"`;
    
    execSync(keytoolCmd, { stdio: 'inherit' });
    console.log('✅ Sinh debug.keystore thành công!\n');
  } else {
    console.log('✅ Tệp debug.keystore đã sẵn sàng.\n');
  }

  // 3. Tự động kiểm tra và sửa lỗi xung đột chữ ký (adb uninstall)
  console.log('🔍 Đang kiểm tra thiết bị Android kết nối qua adb...');
  let adbOutput = '';
  try {
    adbOutput = execSync('adb devices', { encoding: 'utf8' });
  } catch (e) {
    console.log('⚠️ Không tìm thấy lệnh adb trong môi trường. Vui lòng đảm bảo đã cài Android SDK/platform-tools.\n');
  }

  if (adbOutput.includes('\tdevice')) {
    console.log('📱 Tìm thấy thiết bị Android đang kết nối!');
    console.log('🧹 Đang gỡ bỏ phiên bản cũ trên thiết bị để tránh xung đột chữ ký...');
    try {
      execSync('adb uninstall com.vietg.bugmonitoring', { stdio: 'ignore' });
      console.log('✅ Đã dọn dẹp phiên bản cũ (nếu có) thành công!\n');
    } catch (err) {
      // Bỏ qua nếu ứng dụng chưa từng được cài trên máy đó
    }
  } else {
    console.log('⚠️ Không tìm thấy thiết bị Android nào đang kết nối. Vui lòng cắm cáp USB hoặc mở máy ảo!\n');
  }

  // 4. Khởi động ứng dụng
  console.log('🚀 Đang chuẩn bị biên dịch và chạy dự án lên thiết bị của bạn...');
  console.log('💡 Gợi ý: Hãy mở khóa màn hình điện thoại/máy ảo của bạn ngay bây giờ.\n');
  
  // Chạy lệnh expo run:android
  const child = spawn('npx', ['expo', 'run:android'], {
    stdio: 'inherit',
    shell: true
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('\n🎉 Chúc mừng! Ứng dụng đã được cài đặt và khởi chạy thành công.');
    } else {
      console.log(`\n❌ Quá trình chạy thất bại với mã lỗi: ${code}`);
    }
  });

} catch (error) {
  console.error('\n❌ Đã xảy ra lỗi trong quá trình tự động thiết lập:', error.message);
  console.log('💡 Vui lòng đảm bảo bạn đã cài đặt Node.js và JDK (Java) trên máy tính.');
}

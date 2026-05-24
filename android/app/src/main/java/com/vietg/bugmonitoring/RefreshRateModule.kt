package com.vietg.bugmonitoring

import android.view.WindowManager
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class RefreshRateModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "RefreshRateModule"
    }

    @ReactMethod
    fun getNativeRefreshRate(promise: Promise) {
        try {
            val windowManager = reactApplicationContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager
            val display = windowManager.defaultDisplay
            val refreshRate = display.refreshRate
            promise.resolve(refreshRate.toInt())
        } catch (e: Exception) {
            promise.reject("ERR_REFRESH_RATE", e.message)
        }
    }
}
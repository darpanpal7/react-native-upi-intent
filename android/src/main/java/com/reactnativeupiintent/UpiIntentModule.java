package com.reactnativeupiintent;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Objects;

import static androidx.core.app.ActivityCompat.startActivityForResult;


@ReactModule(name = UpiIntentModule.NAME)
public class UpiIntentModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private final ReactApplicationContext reactContext;
    public static final String NAME = "UpiIntent";
    private static final int requestCode = 123;
    private Promise prom;

    public UpiIntentModule(ReactApplicationContext reactContext) {
      super(reactContext);
      this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @Override
    public void initialize() {
      super.initialize();
      getReactApplicationContext().addActivityEventListener((ActivityEventListener) this);
    }

    @Override
    public void onCatalystInstanceDestroy() {
      super.onCatalystInstanceDestroy();
      getReactApplicationContext().removeActivityEventListener(this);
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
      final JSONObject responseData = new JSONObject();
      if(requestCode != 123) return;
      this.prom.resolve(resultCode != 0);
    }

    @ReactMethod
    public void multiply(double a, double b, @NonNull Promise promise) {
        promise.resolve(a * b);
    }

    @ReactMethod
    public void getUpiApps(String scheme, Promise promise) {
      try {
        PackageManager pm = this.reactContext.getPackageManager();
        Uri uri = Uri.parse(scheme);
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        List<ResolveInfo> pList = pm.queryIntentActivities(intent, 0);
        WritableArray list = Arguments.createArray();
        for(int i = 0; i < pList.size(); i += 1) {
          ResolveInfo packageInfo = pList.get(i);
          WritableMap appInfo = Arguments.createMap();
          appInfo.putString("packageName", packageInfo.activityInfo.packageName);
          list.pushMap(appInfo);
        }
        promise.resolve(list);
      } catch (Exception ex) {
        promise.reject(ex);
      }
    }

    @ReactMethod
    public void invokeIntent(String deepLink, String packageName, Promise promise) {
      try {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(deepLink));
        intent.setData(Uri.parse(deepLink));
        if (!packageName.equals("null")) {
          intent.setPackage(packageName);
        }
        this.prom = promise;
        startActivityForResult(Objects.requireNonNull(getCurrentActivity()), intent, requestCode, new Bundle());
      } catch (Exception e) {
        Log.d("Exception Occurred", e.toString());
        promise.reject(e.getLocalizedMessage(), e.getMessage());
      }
    }
}

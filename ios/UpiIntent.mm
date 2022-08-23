#import "UpiIntent.h"
#include <objc/runtime.h>
#import <Foundation/Foundation.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNUpiIntentSpec.h"
#endif

@implementation UpiIntent
RCT_EXPORT_MODULE(UpiIntent)

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_REMAP_METHOD(multiply,
                 multiplyWithA:(double)a withB:(double)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
  NSNumber *result = @(a * b);

  resolve(result);
}

RCT_REMAP_METHOD(canOpenUpi,
                 payload:(NSString*)payload
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
  NSURL *appURL = [NSURL URLWithString: payload];
  BOOL status = [[UIApplication sharedApplication] canOpenURL:appURL];
  resolve(status?@true:@false);
}


RCT_REMAP_METHOD(openUpiApp,
                 urlString:(NSString*)payload
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
  NSURL *appURL = [NSURL URLWithString:payload];
  if (appURL && [[UIApplication sharedApplication] canOpenURL:appURL]) {
    dispatch_async(dispatch_get_main_queue(), ^{[[UIApplication sharedApplication] openURL:appURL options:@{} completionHandler:^(BOOL success) {
        if (success) resolve(@true);
        else resolve(@false);
    }];
  });
  } else resolve(@false);
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeUpiIntentSpecJSI>(params);
}
#endif

@end

//
//  MLHttpClient.h
//  MetlifePresentadorIpad
//
//  Created by Ian Barrera on 11/19/15.
//
//

#import <UIKit/UIKit.h>
#import "MLAFNetworking.h"

@interface MLHttpClient : MLAFHTTPSessionManager

+ (id)sharedManager;
+ (void)downloadFile: (NSString *)fileURL filename: (NSString*) filename completion: (void(^)(NSString *url))success failure: (void(^)(NSError *error))failure;

@end


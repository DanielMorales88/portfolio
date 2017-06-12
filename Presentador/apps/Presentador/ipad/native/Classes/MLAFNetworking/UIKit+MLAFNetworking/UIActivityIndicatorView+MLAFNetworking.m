// UIActivityIndicatorView+MLAFNetworking.m
// Copyright (c) 2011–2015 Alamofire Software Foundation (http://alamofire.org/)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

#import "UIActivityIndicatorView+MLAFNetworking.h"
#import <objc/runtime.h>

#if defined(__IPHONE_OS_VERSION_MIN_REQUIRED)

#import "MLAFHTTPRequestOperation.h"

#if __IPHONE_OS_VERSION_MIN_REQUIRED >= 70000
#import "MLAFURLSessionManager.h"
#endif

@interface MLAFActivityIndicatorViewNotificationObserver : NSObject
@property (readonly, nonatomic, weak) UIActivityIndicatorView *activityIndicatorView;
- (instancetype)initWithActivityIndicatorView:(UIActivityIndicatorView *)activityIndicatorView;

#if __IPHONE_OS_VERSION_MIN_REQUIRED >= 70000
- (void)setAnimatingWithStateOfTask:(NSURLSessionTask *)task;
#endif
- (void)setAnimatingWithStateOfOperation:(MLAFURLConnectionOperation *)operation;

@end

@implementation UIActivityIndicatorView (MLAFNetworking)

- (MLAFActivityIndicatorViewNotificationObserver *)MLAF_notificationObserver {
    MLAFActivityIndicatorViewNotificationObserver *notificationObserver = objc_getAssociatedObject(self, @selector(MLAF_notificationObserver));
    if (notificationObserver == nil) {
        notificationObserver = [[MLAFActivityIndicatorViewNotificationObserver alloc] initWithActivityIndicatorView:self];
        objc_setAssociatedObject(self, @selector(MLAF_notificationObserver), notificationObserver, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    return notificationObserver;
}

#if __IPHONE_OS_VERSION_MIN_REQUIRED >= 70000
- (void)setAnimatingWithStateOfTask:(NSURLSessionTask *)task {
    [[self MLAF_notificationObserver] setAnimatingWithStateOfTask:task];
}
#endif

- (void)setAnimatingWithStateOfOperation:(MLAFURLConnectionOperation *)operation {
    [[self MLAF_notificationObserver] setAnimatingWithStateOfOperation:operation];
}

@end

@implementation MLAFActivityIndicatorViewNotificationObserver

- (instancetype)initWithActivityIndicatorView:(UIActivityIndicatorView *)activityIndicatorView
{
    self = [super init];
    if (self) {
        _activityIndicatorView = activityIndicatorView;
    }
    return self;
}

#if __IPHONE_OS_VERSION_MIN_REQUIRED >= 70000
- (void)setAnimatingWithStateOfTask:(NSURLSessionTask *)task {
    NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];

    [notificationCenter removeObserver:self name:MLAFNetworkingTaskDidResumeNotification object:nil];
    [notificationCenter removeObserver:self name:MLAFNetworkingTaskDidSuspendNotification object:nil];
    [notificationCenter removeObserver:self name:MLAFNetworkingTaskDidCompleteNotification object:nil];
    
    if (task) {
        if (task.state != NSURLSessionTaskStateCompleted) {
            
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wreceiver-is-weak"
#pragma clang diagnostic ignored "-Warc-repeated-use-of-weak"
            if (task.state == NSURLSessionTaskStateRunning) {
                [self.activityIndicatorView startAnimating];
            } else {
                [self.activityIndicatorView stopAnimating];
            }
#pragma clang diagnostic pop

            [notificationCenter addObserver:self selector:@selector(MLAF_startAnimating) name:MLAFNetworkingTaskDidResumeNotification object:task];
            [notificationCenter addObserver:self selector:@selector(MLAF_stopAnimating) name:MLAFNetworkingTaskDidCompleteNotification object:task];
            [notificationCenter addObserver:self selector:@selector(MLAF_stopAnimating) name:MLAFNetworkingTaskDidSuspendNotification object:task];
        }
    }
}
#endif

#pragma mark -

- (void)setAnimatingWithStateOfOperation:(MLAFURLConnectionOperation *)operation {
    NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];

    [notificationCenter removeObserver:self name:MLAFNetworkingOperationDidStartNotification object:nil];
    [notificationCenter removeObserver:self name:MLAFNetworkingOperationDidFinishNotification object:nil];

    if (operation) {
        if (![operation isFinished]) {
            
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wreceiver-is-weak"
#pragma clang diagnostic ignored "-Warc-repeated-use-of-weak"
            if ([operation isExecuting]) {
                [self.activityIndicatorView startAnimating];
            } else {
                [self.activityIndicatorView stopAnimating];
            }
#pragma clang diagnostic pop

            [notificationCenter addObserver:self selector:@selector(MLAF_startAnimating) name:MLAFNetworkingOperationDidStartNotification object:operation];
            [notificationCenter addObserver:self selector:@selector(MLAF_stopAnimating) name:MLAFNetworkingOperationDidFinishNotification object:operation];
        }
    }
}

#pragma mark -

- (void)MLAF_startAnimating {
    dispatch_async(dispatch_get_main_queue(), ^{
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wreceiver-is-weak"
        [self.activityIndicatorView startAnimating];
#pragma clang diagnostic pop
    });
}

- (void)MLAF_stopAnimating {
    dispatch_async(dispatch_get_main_queue(), ^{
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wreceiver-is-weak"
        [self.activityIndicatorView stopAnimating];
#pragma clang diagnostic pop
    });
}

#pragma mark -

- (void)dealloc {
    NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];
    
#if __IPHONE_OS_VERSION_MIN_REQUIRED >= 70000
    [notificationCenter removeObserver:self name:MLAFNetworkingTaskDidCompleteNotification object:nil];
    [notificationCenter removeObserver:self name:MLAFNetworkingTaskDidResumeNotification object:nil];
    [notificationCenter removeObserver:self name:MLAFNetworkingTaskDidSuspendNotification object:nil];
#endif
    
    [notificationCenter removeObserver:self name:MLAFNetworkingOperationDidStartNotification object:nil];
    [notificationCenter removeObserver:self name:MLAFNetworkingOperationDidFinishNotification object:nil];
}

@end

#endif

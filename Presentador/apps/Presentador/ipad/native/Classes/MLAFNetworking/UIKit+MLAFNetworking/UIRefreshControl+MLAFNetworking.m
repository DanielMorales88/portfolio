// UIRefreshControl+MLAFNetworking.m
//
// Copyright (c) 2014 MLAFNetworking (http://MLAFnetworking.com)
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

#import "UIRefreshControl+MLAFNetworking.h"
#import <objc/runtime.h>

#if defined(__IPHONE_OS_VERSION_MIN_REQUIRED)

#import "MLAFHTTPRequestOperation.h"

#if __IPHONE_OS_VERSION_MIN_REQUIRED >= 70000
#import "MLAFURLSessionManager.h"
#endif

@interface MLAFRefreshControlNotificationObserver : NSObject
@property (readonly, nonatomic, weak) UIRefreshControl *refreshControl;
- (instancetype)initWithActivityRefreshControl:(UIRefreshControl *)refreshControl;

#if __IPHONE_OS_VERSION_MIN_REQUIRED >= 70000
- (void)setRefreshingWithStateOfTask:(NSURLSessionTask *)task;
#endif
- (void)setRefreshingWithStateOfOperation:(MLAFURLConnectionOperation *)operation;

@end

@implementation UIRefreshControl (MLAFNetworking)

- (MLAFRefreshControlNotificationObserver *)MLAF_notificationObserver {
    MLAFRefreshControlNotificationObserver *notificationObserver = objc_getAssociatedObject(self, @selector(MLAF_notificationObserver));
    if (notificationObserver == nil) {
        notificationObserver = [[MLAFRefreshControlNotificationObserver alloc] initWithActivityRefreshControl:self];
        objc_setAssociatedObject(self, @selector(MLAF_notificationObserver), notificationObserver, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    return notificationObserver;
}

#if __IPHONE_OS_VERSION_MIN_REQUIRED >= 70000
- (void)setRefreshingWithStateOfTask:(NSURLSessionTask *)task {
    [[self MLAF_notificationObserver] setRefreshingWithStateOfTask:task];
}
#endif

- (void)setRefreshingWithStateOfOperation:(MLAFURLConnectionOperation *)operation {
    [[self MLAF_notificationObserver] setRefreshingWithStateOfOperation:operation];
}

@end

@implementation MLAFRefreshControlNotificationObserver

- (instancetype)initWithActivityRefreshControl:(UIRefreshControl *)refreshControl
{
    self = [super init];
    if (self) {
        _refreshControl = refreshControl;
    }
    return self;
}

#if __IPHONE_OS_VERSION_MIN_REQUIRED >= 70000
- (void)setRefreshingWithStateOfTask:(NSURLSessionTask *)task {
    NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];

    [notificationCenter removeObserver:self name:MLAFNetworkingTaskDidResumeNotification object:nil];
    [notificationCenter removeObserver:self name:MLAFNetworkingTaskDidSuspendNotification object:nil];
    [notificationCenter removeObserver:self name:MLAFNetworkingTaskDidCompleteNotification object:nil];

    if (task) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wreceiver-is-weak"
#pragma clang diagnostic ignored "-Warc-repeated-use-of-weak"
        if (task.state == NSURLSessionTaskStateRunning) {
            [self.refreshControl beginRefreshing];

            [notificationCenter addObserver:self selector:@selector(MLAF_beginRefreshing) name:MLAFNetworkingTaskDidResumeNotification object:task];
            [notificationCenter addObserver:self selector:@selector(MLAF_endRefreshing) name:MLAFNetworkingTaskDidCompleteNotification object:task];
            [notificationCenter addObserver:self selector:@selector(MLAF_endRefreshing) name:MLAFNetworkingTaskDidSuspendNotification object:task];
        } else {
            [self.refreshControl endRefreshing];
        }
#pragma clang diagnostic pop
    }
}
#endif

- (void)setRefreshingWithStateOfOperation:(MLAFURLConnectionOperation *)operation {
    NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];

    [notificationCenter removeObserver:self name:MLAFNetworkingOperationDidStartNotification object:nil];
    [notificationCenter removeObserver:self name:MLAFNetworkingOperationDidFinishNotification object:nil];

    if (operation) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wreceiver-is-weak"
#pragma clang diagnostic ignored "-Warc-repeated-use-of-weak"
        if (![operation isFinished]) {
            if ([operation isExecuting]) {
                [self.refreshControl beginRefreshing];
            } else {
                [self.refreshControl endRefreshing];
            }

            [notificationCenter addObserver:self selector:@selector(MLAF_beginRefreshing) name:MLAFNetworkingOperationDidStartNotification object:operation];
            [notificationCenter addObserver:self selector:@selector(MLAF_endRefreshing) name:MLAFNetworkingOperationDidFinishNotification object:operation];
        }
#pragma clang diagnostic pop
    }
}

#pragma mark -

- (void)MLAF_beginRefreshing {
    dispatch_async(dispatch_get_main_queue(), ^{
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wreceiver-is-weak"
        [self.refreshControl beginRefreshing];
#pragma clang diagnostic pop
    });
}

- (void)MLAF_endRefreshing {
    dispatch_async(dispatch_get_main_queue(), ^{
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wreceiver-is-weak"
        [self.refreshControl endRefreshing];
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

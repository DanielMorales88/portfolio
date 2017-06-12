// UIButton+MLAFNetworking.m
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

#import "UIButton+MLAFNetworking.h"

#import <objc/runtime.h>

#if defined(__IPHONE_OS_VERSION_MIN_REQUIRED)

#import "MLAFURLResponseSerialization.h"
#import "MLAFHTTPRequestOperation.h"

#import "UIImageView+MLAFNetworking.h"

@interface UIButton (_MLAFNetworking)
@end

@implementation UIButton (_MLAFNetworking)

+ (NSOperationQueue *)MLAF_sharedImageRequestOperationQueue {
    static NSOperationQueue *_MLAF_sharedImageRequestOperationQueue = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _MLAF_sharedImageRequestOperationQueue = [[NSOperationQueue alloc] init];
        _MLAF_sharedImageRequestOperationQueue.maxConcurrentOperationCount = NSOperationQueueDefaultMaxConcurrentOperationCount;
    });

    return _MLAF_sharedImageRequestOperationQueue;
}

#pragma mark -

static char MLAFImageRequestOperationNormal;
static char MLAFImageRequestOperationHighlighted;
static char MLAFImageRequestOperationSelected;
static char MLAFImageRequestOperationDisabled;

static const char * MLAF_imageRequestOperationKeyForState(UIControlState state) {
    switch (state) {
        case UIControlStateHighlighted:
            return &MLAFImageRequestOperationHighlighted;
        case UIControlStateSelected:
            return &MLAFImageRequestOperationSelected;
        case UIControlStateDisabled:
            return &MLAFImageRequestOperationDisabled;
        case UIControlStateNormal:
        default:
            return &MLAFImageRequestOperationNormal;
    }
}

- (MLAFHTTPRequestOperation *)MLAF_imageRequestOperationForState:(UIControlState)state {
    return (MLAFHTTPRequestOperation *)objc_getAssociatedObject(self, MLAF_imageRequestOperationKeyForState(state));
}

- (void)MLAF_setImageRequestOperation:(MLAFHTTPRequestOperation *)imageRequestOperation
                           forState:(UIControlState)state
{
    objc_setAssociatedObject(self, MLAF_imageRequestOperationKeyForState(state), imageRequestOperation, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

#pragma mark -

static char MLAFBackgroundImageRequestOperationNormal;
static char MLAFBackgroundImageRequestOperationHighlighted;
static char MLAFBackgroundImageRequestOperationSelected;
static char MLAFBackgroundImageRequestOperationDisabled;

static const char * MLAF_backgroundImageRequestOperationKeyForState(UIControlState state) {
    switch (state) {
        case UIControlStateHighlighted:
            return &MLAFBackgroundImageRequestOperationHighlighted;
        case UIControlStateSelected:
            return &MLAFBackgroundImageRequestOperationSelected;
        case UIControlStateDisabled:
            return &MLAFBackgroundImageRequestOperationDisabled;
        case UIControlStateNormal:
        default:
            return &MLAFBackgroundImageRequestOperationNormal;
    }
}

- (MLAFHTTPRequestOperation *)MLAF_backgroundImageRequestOperationForState:(UIControlState)state {
    return (MLAFHTTPRequestOperation *)objc_getAssociatedObject(self, MLAF_backgroundImageRequestOperationKeyForState(state));
}

- (void)MLAF_setBackgroundImageRequestOperation:(MLAFHTTPRequestOperation *)imageRequestOperation
                                     forState:(UIControlState)state
{
    objc_setAssociatedObject(self, MLAF_backgroundImageRequestOperationKeyForState(state), imageRequestOperation, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

@end

#pragma mark -

@implementation UIButton (MLAFNetworking)

+ (id <MLAFImageCache>)sharedImageCache {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wgnu"
    return objc_getAssociatedObject(self, @selector(sharedImageCache)) ?: [UIImageView sharedImageCache];
#pragma clang diagnostic pop
}

+ (void)setSharedImageCache:(__nullable id <MLAFImageCache>)imageCache {
    objc_setAssociatedObject(self, @selector(sharedImageCache), imageCache, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

#pragma mark -

- (id <MLAFURLResponseSerialization>)imageResponseSerializer {
    static id <MLAFURLResponseSerialization> _MLAF_defaultImageResponseSerializer = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _MLAF_defaultImageResponseSerializer = [MLAFImageResponseSerializer serializer];
    });

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wgnu"
    return objc_getAssociatedObject(self, @selector(imageResponseSerializer)) ?: _MLAF_defaultImageResponseSerializer;
#pragma clang diagnostic pop
}

- (void)setImageResponseSerializer:(id <MLAFURLResponseSerialization>)serializer {
    objc_setAssociatedObject(self, @selector(imageResponseSerializer), serializer, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

#pragma mark -

- (void)setImageForState:(UIControlState)state
                 withURL:(NSURL *)url
{
    [self setImageForState:state withURL:url placeholderImage:nil];
}

- (void)setImageForState:(UIControlState)state
                 withURL:(NSURL *)url
        placeholderImage:(UIImage *)placeholderImage
{
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request addValue:@"image/*" forHTTPHeaderField:@"Accept"];

    [self setImageForState:state withURLRequest:request placeholderImage:placeholderImage success:nil failure:nil];
}

- (void)setImageForState:(UIControlState)state
          withURLRequest:(NSURLRequest *)urlRequest
        placeholderImage:(UIImage *)placeholderImage
                 success:(void (^)(NSURLRequest *request, NSHTTPURLResponse * __nullable response, UIImage *image))success
                 failure:(void (^)(NSError *error))failure
{
    [self cancelImageRequestOperationForState:state];

    UIImage *cachedImage = [[[self class] sharedImageCache] cachedImageForRequest:urlRequest];
    if (cachedImage) {
        if (success) {
            success(urlRequest, nil, cachedImage);
        } else {
            [self setImage:cachedImage forState:state];
        }

        [self MLAF_setImageRequestOperation:nil forState:state];
    } else {
        if (placeholderImage) {
            [self setImage:placeholderImage forState:state];
        }

        __weak __typeof(self)weakSelf = self;
        MLAFHTTPRequestOperation *imageRequestOperation = [[MLAFHTTPRequestOperation alloc] initWithRequest:urlRequest];
        imageRequestOperation.responseSerializer = self.imageResponseSerializer;
        [imageRequestOperation setCompletionBlockWithSuccess:^(MLAFHTTPRequestOperation *operation, id responseObject) {
            __strong __typeof(weakSelf)strongSelf = weakSelf;
            if ([[urlRequest URL] isEqual:[operation.request URL]]) {
                if (success) {
                    success(operation.request, operation.response, responseObject);
                } else if (responseObject) {
                    [strongSelf setImage:responseObject forState:state];
                }
            }
            [[[strongSelf class] sharedImageCache] cacheImage:responseObject forRequest:urlRequest];
        } failure:^(MLAFHTTPRequestOperation *operation, NSError *error) {
            if ([[urlRequest URL] isEqual:[operation.request URL]]) {
                if (failure) {
                    failure(error);
                }
            }
        }];

        [self MLAF_setImageRequestOperation:imageRequestOperation forState:state];
        [[[self class] MLAF_sharedImageRequestOperationQueue] addOperation:imageRequestOperation];
    }
}

#pragma mark -

- (void)setBackgroundImageForState:(UIControlState)state
                           withURL:(NSURL *)url
{
    [self setBackgroundImageForState:state withURL:url placeholderImage:nil];
}

- (void)setBackgroundImageForState:(UIControlState)state
                           withURL:(NSURL *)url
                  placeholderImage:(UIImage *)placeholderImage
{
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request addValue:@"image/*" forHTTPHeaderField:@"Accept"];

    [self setBackgroundImageForState:state withURLRequest:request placeholderImage:placeholderImage success:nil failure:nil];
}

- (void)setBackgroundImageForState:(UIControlState)state
                    withURLRequest:(NSURLRequest *)urlRequest
                  placeholderImage:(UIImage *)placeholderImage
                           success:(void (^)(NSURLRequest *request, NSHTTPURLResponse * __nullable response, UIImage *image))success
                           failure:(void (^)(NSError *error))failure
{
    [self cancelBackgroundImageRequestOperationForState:state];

    UIImage *cachedImage = [[[self class] sharedImageCache] cachedImageForRequest:urlRequest];
    if (cachedImage) {
        if (success) {
            success(urlRequest, nil, cachedImage);
        } else {
            [self setBackgroundImage:cachedImage forState:state];
        }

        [self MLAF_setBackgroundImageRequestOperation:nil forState:state];
    } else {
        if (placeholderImage) {
            [self setBackgroundImage:placeholderImage forState:state];
        }

        __weak __typeof(self)weakSelf = self;
        MLAFHTTPRequestOperation *backgroundImageRequestOperation = [[MLAFHTTPRequestOperation alloc] initWithRequest:urlRequest];
        backgroundImageRequestOperation.responseSerializer = self.imageResponseSerializer;
        [backgroundImageRequestOperation setCompletionBlockWithSuccess:^(MLAFHTTPRequestOperation *operation, id responseObject) {
            __strong __typeof(weakSelf)strongSelf = weakSelf;
            if ([[urlRequest URL] isEqual:[operation.request URL]]) {
                if (success) {
                    success(operation.request, operation.response, responseObject);
                } else if (responseObject) {
                    [strongSelf setBackgroundImage:responseObject forState:state];
                }
            }
            [[[strongSelf class] sharedImageCache] cacheImage:responseObject forRequest:urlRequest];
        } failure:^(MLAFHTTPRequestOperation *operation, NSError *error) {
            if ([[urlRequest URL] isEqual:[operation.request URL]]) {
                if (failure) {
                    failure(error);
                }
            }
        }];

        [self MLAF_setBackgroundImageRequestOperation:backgroundImageRequestOperation forState:state];
        [[[self class] MLAF_sharedImageRequestOperationQueue] addOperation:backgroundImageRequestOperation];
    }
}

#pragma mark -

- (void)cancelImageRequestOperationForState:(UIControlState)state {
    [[self MLAF_imageRequestOperationForState:state] cancel];
    [self MLAF_setImageRequestOperation:nil forState:state];
}

- (void)cancelBackgroundImageRequestOperationForState:(UIControlState)state {
    [[self MLAF_backgroundImageRequestOperationForState:state] cancel];
    [self MLAF_setBackgroundImageRequestOperation:nil forState:state];
}

@end

#endif

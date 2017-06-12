// UIImageView+MLAFNetworking.m
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

#import "UIImageView+MLAFNetworking.h"

#import <objc/runtime.h>

#if defined(__IPHONE_OS_VERSION_MIN_REQUIRED)

#import "MLAFHTTPRequestOperation.h"

@interface MLAFImageCache : NSCache <MLAFImageCache>
@end

#pragma mark -

@interface UIImageView (_MLAFNetworking)
@property (readwrite, nonatomic, strong, setter = MLAF_setImageRequestOperation:) MLAFHTTPRequestOperation *MLAF_imageRequestOperation;
@end

@implementation UIImageView (_MLAFNetworking)

+ (NSOperationQueue *)MLAF_sharedImageRequestOperationQueue {
    static NSOperationQueue *_MLAF_sharedImageRequestOperationQueue = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _MLAF_sharedImageRequestOperationQueue = [[NSOperationQueue alloc] init];
        _MLAF_sharedImageRequestOperationQueue.maxConcurrentOperationCount = NSOperationQueueDefaultMaxConcurrentOperationCount;
    });

    return _MLAF_sharedImageRequestOperationQueue;
}

- (MLAFHTTPRequestOperation *)MLAF_imageRequestOperation {
    return (MLAFHTTPRequestOperation *)objc_getAssociatedObject(self, @selector(MLAF_imageRequestOperation));
}

- (void)MLAF_setImageRequestOperation:(MLAFHTTPRequestOperation *)imageRequestOperation {
    objc_setAssociatedObject(self, @selector(MLAF_imageRequestOperation), imageRequestOperation, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

@end

#pragma mark -

@implementation UIImageView (MLAFNetworking)
@dynamic imageResponseSerializer;

+ (id <MLAFImageCache>)sharedImageCache {
    static MLAFImageCache *_MLAF_defaultImageCache = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        _MLAF_defaultImageCache = [[MLAFImageCache alloc] init];

        [[NSNotificationCenter defaultCenter] addObserverForName:UIApplicationDidReceiveMemoryWarningNotification object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification * __unused notification) {
            [_MLAF_defaultImageCache removeAllObjects];
        }];
    });

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wgnu"
    return objc_getAssociatedObject(self, @selector(sharedImageCache)) ?: _MLAF_defaultImageCache;
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

- (void)setImageWithURL:(NSURL *)url {
    [self setImageWithURL:url placeholderImage:nil];
}

- (void)setImageWithURL:(NSURL *)url
       placeholderImage:(UIImage *)placeholderImage
{
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request addValue:@"image/*" forHTTPHeaderField:@"Accept"];

    [self setImageWithURLRequest:request placeholderImage:placeholderImage success:nil failure:nil];
}

- (void)setImageWithURLRequest:(NSURLRequest *)urlRequest
              placeholderImage:(UIImage *)placeholderImage
                       success:(void (^)(NSURLRequest *request, NSHTTPURLResponse * __nullable response, UIImage *image))success
                       failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse * __nullable response, NSError *error))failure
{
    [self cancelImageRequestOperation];

    UIImage *cachedImage = [[[self class] sharedImageCache] cachedImageForRequest:urlRequest];
    if (cachedImage) {
        if (success) {
            success(urlRequest, nil, cachedImage);
        } else {
            self.image = cachedImage;
        }

        self.MLAF_imageRequestOperation = nil;
    } else {
        if (placeholderImage) {
            self.image = placeholderImage;
        }

        __weak __typeof(self)weakSelf = self;
        self.MLAF_imageRequestOperation = [[MLAFHTTPRequestOperation alloc] initWithRequest:urlRequest];
        self.MLAF_imageRequestOperation.responseSerializer = self.imageResponseSerializer;
        [self.MLAF_imageRequestOperation setCompletionBlockWithSuccess:^(MLAFHTTPRequestOperation *operation, id responseObject) {
            __strong __typeof(weakSelf)strongSelf = weakSelf;
            if ([[urlRequest URL] isEqual:[strongSelf.MLAF_imageRequestOperation.request URL]]) {
                if (success) {
                    success(urlRequest, operation.response, responseObject);
                } else if (responseObject) {
                    strongSelf.image = responseObject;
                }

                if (operation == strongSelf.MLAF_imageRequestOperation){
                        strongSelf.MLAF_imageRequestOperation = nil;
                }
            }

            [[[strongSelf class] sharedImageCache] cacheImage:responseObject forRequest:urlRequest];
        } failure:^(MLAFHTTPRequestOperation *operation, NSError *error) {
            __strong __typeof(weakSelf)strongSelf = weakSelf;
            if ([[urlRequest URL] isEqual:[strongSelf.MLAF_imageRequestOperation.request URL]]) {
                if (failure) {
                    failure(urlRequest, operation.response, error);
                }

                if (operation == strongSelf.MLAF_imageRequestOperation){
                        strongSelf.MLAF_imageRequestOperation = nil;
                }
            }
        }];

        [[[self class] MLAF_sharedImageRequestOperationQueue] addOperation:self.MLAF_imageRequestOperation];
    }
}

- (void)cancelImageRequestOperation {
    [self.MLAF_imageRequestOperation cancel];
    self.MLAF_imageRequestOperation = nil;
}

@end

#pragma mark -

static inline NSString * MLAFImageCacheKeyFromURLRequest(NSURLRequest *request) {
    return [[request URL] absoluteString];
}

@implementation MLAFImageCache

- (UIImage *)cachedImageForRequest:(NSURLRequest *)request {
    switch ([request cachePolicy]) {
        case NSURLRequestReloadIgnoringCacheData:
        case NSURLRequestReloadIgnoringLocalAndRemoteCacheData:
            return nil;
        default:
            break;
    }

	return [self objectForKey:MLAFImageCacheKeyFromURLRequest(request)];
}

- (void)cacheImage:(UIImage *)image
        forRequest:(NSURLRequest *)request
{
    if (image && request) {
        [self setObject:image forKey:MLAFImageCacheKeyFromURLRequest(request)];
    }
}

@end

#endif

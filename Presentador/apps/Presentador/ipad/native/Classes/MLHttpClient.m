//
//  MLHttpClient.m
//  MetlifePresentadorIpad
//
//  Created by Ian Barrera on 11/19/15.
//
//

#import "MLHttpClient.h"
#define KMLBaseURL  @""


@interface MLHttpClient()

@end


@implementation MLHttpClient

- (instancetype)initWithBaseURL:(NSURL *)url
{
    self = [super initWithBaseURL:url];
    
    if (self) {
        self.responseSerializer = [MLAFJSONResponseSerializer serializer];
        self.requestSerializer = [MLAFJSONRequestSerializer serializer];
    }
    
    return self;
}



+ (MLHttpClient *)sharedManager
{
    static MLHttpClient *_sharedHTTPClient = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedHTTPClient = [[self alloc] initWithBaseURL:[NSURL URLWithString:@"https://dl.dropboxusercontent.com/u/99336444/content/"]];
    });
    
    return _sharedHTTPClient;
}


+ (void)downloadFile: (NSString *)fileURL filename: (NSString*) filename completion: (void(^)(NSString *url))success failure: (void(^)(NSError *error))failure{
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:fileURL]];
    
    NSURL *documentsDirectoryURL = [[NSFileManager defaultManager] URLForDirectory:NSDocumentDirectory inDomain:NSUserDomainMask appropriateForURL:nil create:NO error:nil];
    
    NSURLSessionDownloadTask *downloadTask = [[MLHttpClient sharedManager] downloadTaskWithRequest:request progress:nil destination:^NSURL * _Nonnull(NSURL * _Nonnull targetPath, NSURLResponse * _Nonnull response) {
        
//        NSURL *metlifeContent = [documentsDirectoryURL URLByAppendingPathComponent:@"MelifeContent"];
        
        NSURL *filePathURL = [documentsDirectoryURL URLByAppendingPathComponent:filename];
        
        return filePathURL;
        
    } completionHandler:^(NSURLResponse * _Nonnull response, NSURL * _Nullable filePath, NSError * _Nullable error) {
        NSLog(@"File path: %@, %@", filePath.relativePath, error.description);
        if (error == nil )
            success(filePath.relativePath);
        else
            failure(error);
    }];

    [downloadTask resume];
    
}

@end

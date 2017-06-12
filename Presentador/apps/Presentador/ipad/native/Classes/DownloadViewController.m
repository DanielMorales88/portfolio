//
//  DownloadViewController.m
//  MetlifePresentadorIpad
//
//  Created by Ian Barrera on 11/19/15.
//
//

#import "DownloadViewController.h"
#import <IBMMobileFirstPlatformFoundationHybrid/IBMMobileFirstPlatformFoundationHybrid.h>
#import "MLHttpClient.h"


@interface DownloadViewController ()
@property (nonatomic, strong) NSArray *urls;
@property (nonatomic, assign) NSUInteger downloadedFiles;
@property (nonatomic, strong) NSMutableArray *downloadedURLs;
@end

@implementation DownloadViewController


-(void)onBeforeShow{
    CDVAppDelegate *cordovaAppDelegate =
    (CDVAppDelegate*)[[UIApplication sharedApplication] delegate];
    
    [UIView beginAnimations:nil context:NULL];
    [UIView setAnimationDuration:0.5];
    [UIView setAnimationTransition:UIViewAnimationTransitionFlipFromRight
                           forView:[cordovaAppDelegate window]
                             cache:YES];
}

-(void)onAfterShow{
    [UIView commitAnimations];
}


- (void)viewDidLoad {
    [super viewDidLoad];


    
//    [[MLHttpClient sharedManager] GET:(nonnull NSString *) parameters:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nonnull responseObject) {
//        
//    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
//        
//    }];
//    
//    
//    [MLHttpClient downloadFile:<#(NSString *)#>]
}



-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:NO];
    
    self.downloadedFiles = 0;
    self.downloadedURLs = nil;
    self.downloadedURLs = [[NSMutableArray alloc] init];
    // Do any additional setup after loading the view.
    
    
    [self addObserver:self forKeyPath:@"downloadedFiles" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
}

-(void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    NSLog(@"From KVO");
    
    if([keyPath isEqualToString:@"downloadedFiles"])
    {
        id oldC = [change objectForKey:NSKeyValueChangeOldKey];
        id newC = [change objectForKey:NSKeyValueChangeNewKey];
        
        NSUInteger newCount = [(NSNumber *)newC integerValue];
        
        NSLog(@"%@ %@", oldC, newC);
        
        if (newCount == self.urls.count){
            NSDictionary *dictionaryURLs = [NSDictionary dictionaryWithObject:self.downloadedURLs forKey:@"urls"];
            [NativePage showWebView:dictionaryURLs];
        }
    }
}




-(void)setDataFromWebView:(NSDictionary*)data{
    
    [self performSelector:@selector(downloadContent:) withObject:data afterDelay:1];
    
}

-(void)downloadContent:(NSDictionary *)data{
    NSString *stringedURLS = (NSString *)[data valueForKey:@"files"];
    
    self.urls = [stringedURLS componentsSeparatedByString:@","];
    
    NSMutableArray<NSString *> *downloadedFiles = [[NSMutableArray alloc] init];
    
    
    for(int i=0; i<self.urls.count; i++) {
        NSString *composedURL = self.urls[i];
        
        
        NSArray *urlArray = [composedURL componentsSeparatedByString:@"#"];
        
        NSString *theURL = urlArray[0];
        
        //Implementation for testing
        NSArray *filenameArray = [theURL componentsSeparatedByString:@"/"];
        
        //Production implementation
        //NSArray *nameArray = [urlArray[0] componentsSeparatedByString:@"$"];
        NSArray *nameSections =[(NSString *)filenameArray.lastObject componentsSeparatedByString: @"."];
        
        NSString *versionedFilename =  [NSString stringWithFormat:@"%@%@.%@",nameSections[0],urlArray[1],nameSections[1]];
        
        NSFileManager *fileManager = [NSFileManager defaultManager];
        NSURL *documentsDirectoryURL = [fileManager URLForDirectory:NSDocumentDirectory inDomain:NSUserDomainMask appropriateForURL:nil create:NO error:nil];
        
        
        BOOL fileExists = [fileManager fileExistsAtPath:[documentsDirectoryURL URLByAppendingPathComponent:versionedFilename].relativePath];
        
        if (!fileExists) {
            
            __weak DownloadViewController *_weakSelf = self;
            [MLHttpClient downloadFile:theURL filename:versionedFilename completion:^(NSString *url) {
                NSLog(@"the downaloaaded url is: %@", url);
                DownloadViewController *_strongSelf = _weakSelf;
                
                if(_strongSelf){
                    NSDictionary *fileURLDict = [NSDictionary dictionaryWithObjects:@[(NSString *)filenameArray.lastObject,versionedFilename] forKeys:@[@"filename",@"url"]];
                    
                    [_strongSelf.downloadedURLs addObject:fileURLDict];
                    [downloadedFiles addObject:versionedFilename];
                    _strongSelf.downloadedFiles++;
                }
                
            } failure:^(NSError *error) {
                
                DownloadViewController *_strongSelf = _weakSelf;
                if(_strongSelf){
                    _strongSelf.downloadedFiles++;
                }
            }];
            
        } else{
            self.downloadedFiles++;
            
        }
        
    }
    
    
    
    [self deleleteDuplicatedFiles:downloadedFiles];
}



-(void)deleleteDuplicatedFiles: (NSArray* )baseArray{
    
    
    NSFileManager *aFileManager = [NSFileManager defaultManager];
    NSURL *documentsDirectoryURL = [aFileManager URLForDirectory:NSDocumentDirectory inDomain:NSUserDomainMask appropriateForURL:nil create:NO error:nil];
//    NSURL *metlifeContent = [documentsDirectoryURL URLByAppendingPathComponent:@"MelifeContent"];
    NSArray *files = [aFileManager contentsOfDirectoryAtPath:documentsDirectoryURL.absoluteString error:nil];
    
    NSMutableArray *filesArray = [[NSMutableArray alloc] init];
    
    [filesArray addObjectsFromArray:baseArray];
    [filesArray addObjectsFromArray:files];
    
    NSOrderedSet *deletedDuplicates = [NSOrderedSet orderedSetWithArray:filesArray];
    
    
    NSLog(@"Duplicates: %@", deletedDuplicates);
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end

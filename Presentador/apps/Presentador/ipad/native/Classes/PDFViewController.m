//
//  PDFViewController.m
//  MetlifePresentadorIpad
//
//  Created by Ian Barrera on 11/17/15.
//
//

#import "PDFViewController.h"
#import <IBMMobileFirstPlatformFoundationHybrid/IBMMobileFirstPlatformFoundationHybrid.h>

@interface PDFViewController ()


@property (nonatomic, strong) UIWebView *webView;
@property (nonatomic,strong)NSNumber *pdfId;
@property (nonatomic,strong)NSString *pdfURL;

@end

@implementation PDFViewController



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

-(void)setDataFromWebView:(NSDictionary*)data{
    self.pdfURL = (NSString *)[data valueForKey:@"pdf"];
    //[[[UIAlertView alloc]initWithTitle:@"Si jala" message:[self.videoId stringValue] delegate:nil cancelButtonTitle:@"Ok" otherButtonTitles:nil]show];
}

-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    
    if(self.webView == nil)
    {
        self.webView = [[UIWebView alloc] initWithFrame:CGRectMake(0.0, 60.0, 1024, 708)];
        [self.view addSubview:self.webView];
        
    }
    
    
     [self openPDFFromURL:self.pdfURL];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    
    UIButton *button = [[UIButton alloc] initWithFrame:CGRectMake(0.0, 0.0, 1024, 60)];
    [button addTarget:self action:@selector(closeWebView) forControlEvents:UIControlEventTouchUpInside];
    [button setTitle:@"Cerrar" forState:UIControlStateNormal];
    [button setTitle:@"Cerrar" forState:UIControlStateHighlighted];
    [button setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [button setBackgroundColor:[UIColor colorWithRed:(23.0/255.0) green:(23.0/255.0) blue:(202.0/255.0) alpha:1.0]];
    [self.view addSubview:button];
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


-(void)closeWebView{
    
    [self.webView removeFromSuperview];
    self.webView = nil;
    [self dismissViewControllerAnimated:YES completion:nil];
     [NativePage showWebView:nil];
}

-(void)openPDF:(NSNumber*)val{
    
    NSString* filePath = [[NSBundle mainBundle] pathForResource:@"sample" ofType:@"pdf"];
    long theID = val!=nil?[val longValue]:0;

    
    switch (theID) {
        case 1:
            filePath=[[NSBundle mainBundle] pathForResource:@"fortalezasmetlife" ofType:@"pdf"];
            break;
        case 2:
            filePath=[[NSBundle mainBundle] pathForResource:@"bench" ofType:@"pdf"];
            break;
        case 3:
            filePath=[[NSBundle mainBundle] pathForResource:@"met99gral" ofType:@"pdf"];
            break;
        default:
            break;
    }

    NSURL *targetURL = [NSURL fileURLWithPath:filePath];
    NSURLRequest *request = [NSURLRequest requestWithURL:targetURL];
    [self.webView loadRequest:request];
    
}

-(void)openPDFFromURL:(NSString*)url{
    
//    NSURL *targetURL = [NSURL URLWithString:url];
    NSFileManager *afileManager = [NSFileManager defaultManager];
    NSArray *dirs=[afileManager URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask];;
    NSURL *documentsDirectoryURL = (NSURL *)dirs.firstObject;
    NSString *targetURL = [documentsDirectoryURL URLByAppendingPathComponent:url].relativePath;
    
    NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:targetURL]];
    [self.webView loadRequest:request];
    
}


@end

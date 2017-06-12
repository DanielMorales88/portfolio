//
//  VideoViewController.m
//  MetlifePresentadorIpad
//
//  Created by Cristopher Adán Bautista Gómez on 09/11/15.
//
//

#import "VideoViewController.h"
#import <AVFoundation/AVFoundation.h>
#import <MediaPlayer/MediaPlayer.h>
#import <AVKit/AVKit.h>
#import <IBMMobileFirstPlatformFoundationHybrid/IBMMobileFirstPlatformFoundationHybrid.h>

@interface VideoViewController () <AVPlayerViewControllerDelegate>{
    BOOL playFirstTime;
}
-(void)itemDidFinishPlaying:(id)selector;
-(void)playMyVideo:(NSNumber*)val;
@property (nonatomic,strong)NSNumber *videoId;
@property (nonatomic,strong)NSString *videoURL;
@property (nonatomic,strong)AVPlayerViewController *playerViewController;
@end

@implementation VideoViewController

-(void)setDataFromWebView:(NSDictionary*)data{
    self.videoURL = (NSString *)[data valueForKey:@"video"];
    //[[[UIAlertView alloc]initWithTitle:@"Si jala" message:[self.videoId stringValue] delegate:nil cancelButtonTitle:@"Ok" otherButtonTitles:nil]show];
}

-(void)playMyVideoFrom:(NSString*)url{
    
    if (playFirstTime) {
        playFirstTime=NO;
        
        NSString *ver = [[UIDevice currentDevice] systemVersion];
        float ver_float = [ver floatValue];
        
        
//
//        NSArray *documentPaths =
//        NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
//        
//        NSString *documentDir = [documentPaths objectAtIndex:0];
//        NSString *databasePath = [documentDir stringByAppendingPathComponent:url];
//        NSURL *theURL = [NSURL fileURLWithPath:databasePath];

        
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [paths objectAtIndex:0];
        NSString *path = [documentsDirectory stringByAppendingPathComponent:url];
        NSURL *movieURL = [NSURL fileURLWithPath:path];
        
        MPMoviePlayerViewController *playercontroller = [[MPMoviePlayerViewController alloc] initWithContentURL:movieURL];
        [self presentMoviePlayerViewControllerAnimated:playercontroller];
        playercontroller.moviePlayer.movieSourceType = MPMovieSourceTypeFile;
        [playercontroller.moviePlayer play];
//        playercontroller = nil;
        
//        if (ver_float < 8.0){
        

//            MPMoviePlayerViewController *movieController = [[MPMoviePlayerViewController alloc] initWithContentURL:theURL];
//            [self presentViewController:movieController animated:YES completion:nil];
//            movieController.moviePlayer.movieSourceType    = MPMovieSourceTypeFile;
//            [movieController.moviePlayer play];
        
//        }
//        else {
//            //filePath may be from the Bundle or from the Saved file Directory, it is just the path for the video
//            AVPlayerItem *playerItm = [[AVPlayerItem alloc]initWithURL:[NSURL URLWithString:targetURL]];
//            AVPlayer *player = [AVPlayer playerWithPlayerItem:playerItm];
//            
//            AVPlayerViewController *playerViewController = [[AVPlayerViewController alloc] init];
//            playerViewController.player = player;
//            //[playerViewController.player play];//Used to Play On start
//            
//            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(itemDidFinishPlaying:) name:AVPlayerItemDidPlayToEndTimeNotification object:playerItm];
//            
//            ///[self presentViewController:playerViewController animated:YES completion:nil];
//            [self presentViewController:playerViewController animated:YES completion:nil];
//            [playerViewController.player play];
//            
//        }
        
    }else{
        [NativePage showWebView:nil];
        playFirstTime=YES;
    }
}


-(void)playMyVideo:(NSNumber*)val{
    
    if (playFirstTime) {
        playFirstTime=NO;
        
        NSString* filePath=[[NSBundle mainBundle] pathForResource:@"BigBuck" ofType:@"mp4"];
        long videoId = val!=nil?[val longValue]:0;
        switch (videoId) {
            case 1:
            case 14:
            case 16:
                filePath=[[NSBundle mainBundle] pathForResource:@"fallecimiento" ofType:@"mp4"];
                break;
            case 2:
                filePath=[[NSBundle mainBundle] pathForResource:@"fallecimientotemprano" ofType:@"mp4"];
                break;
            case 3:
                filePath=[[NSBundle mainBundle] pathForResource:@"constanciadeprotec" ofType:@"mp4"];
                break;
            case 4:
                filePath=[[NSBundle mainBundle] pathForResource:@"enfermedadterminal" ofType:@"mp4"];
                break;
            case 5:
                filePath=[[NSBundle mainBundle] pathForResource:@"invalidez" ofType:@"mp4"];
                break;
            case 6:
            case 11:
            case 13:
            case 18:
                filePath=[[NSBundle mainBundle] pathForResource:@"gastosfunerarios" ofType:@"mp4"];
                break;
            case 7:
                filePath=[[NSBundle mainBundle] pathForResource:@"invalideztotal" ofType:@"mp4"];
                break;
            case 8:
                filePath=[[NSBundle mainBundle] pathForResource:@"tripleindeminizacion" ofType:@"mp4"];
                break;
            case 12:
                filePath=[[NSBundle mainBundle] pathForResource:@"accidentespersonales" ofType:@"mp4"];
                break;
            case 15:
                filePath=[[NSBundle mainBundle] pathForResource:@"garantiaescolar" ofType:@"mp4"];
                break;
            case 9:
            case 17:
                filePath=[[NSBundle mainBundle] pathForResource:@"cancer" ofType:@"mp4"];
                break;
                
                
                
                break;
        }
        
        
        NSString *ver = [[UIDevice currentDevice] systemVersion];
        float ver_float = [ver floatValue];
        
        if (ver_float < 8.0){
            NSURL *movieURL = [NSURL fileURLWithPath:filePath];
            MPMoviePlayerViewController *movieController = [[MPMoviePlayerViewController alloc] initWithContentURL:movieURL];
            [self presentViewController:movieController animated:YES completion:nil];
            [movieController.moviePlayer play];
            
        }
        else {
            NSURL *videoURL = [NSURL fileURLWithPath:filePath];
            //filePath may be from the Bundle or from the Saved file Directory, it is just the path for the video
            AVPlayerItem *playerItm = [[AVPlayerItem alloc]initWithURL:videoURL];
            AVPlayer *player = [AVPlayer playerWithPlayerItem:playerItm];
            
            AVPlayerViewController *playerViewController = [[AVPlayerViewController alloc] init];
            playerViewController.player = player;
            //[playerViewController.player play];//Used to Play On start
            
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(itemDidFinishPlaying:) name:AVPlayerItemDidPlayToEndTimeNotification object:playerItm];
            
            ///[self presentViewController:playerViewController animated:YES completion:nil];
            [self presentViewController:playerViewController animated:YES completion:nil];
            
        }
        
    }else{
        [NativePage showWebView:nil];
        playFirstTime=YES;
    }
}
/*
 -(IBAction)returnClicked:(id)sender{
 NSString *phone = [phoneNumber text];
 NSDictionary *returnedData = [NSDictionary dictionaryWithObject:phone
 forKey:@"phoneNumber"];
 
 // Animate transition with a flip effect
 
 
 CDVAppDelegate *cordovaAppDelegate =
 (CDVAppDelegate*)[[UIApplication sharedApplication] delegate];
 
 [UIView beginAnimations:nil context:NULL];
 [UIView setAnimationDuration:0.5];
 [UIView setAnimationTransition:UIViewAnimationTransitionFlipFromRight
 forView:[cordovaAppDelegate window]
 cache:YES];
 
 [UIView commitAnimations];
 
 // Return to WebView
 [NativePage showWebView:returnedData];
 }*/


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

#pragma mark - View lifecycle

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    self.view.backgroundColor = [UIColor clearColor];
    playFirstTime=YES;
}

-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    [self playMyVideoFrom:self.videoURL];
}

-(void)itemDidFinishPlaying:(id)selector{
    // Return to WebView
    [NativePage showWebView:nil];
    playFirstTime=YES;
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

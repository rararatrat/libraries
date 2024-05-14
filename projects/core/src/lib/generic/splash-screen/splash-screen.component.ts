import { Component, Input, OnInit } from '@angular/core';
import { SplashScreenStateService } from './splash-screen-state.service';

@Component({
  selector: 'eag-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {
  @Input() loadingText : any = "Loading";
  @Input() image       ?: any = null;

  // The screen starts with the maximum opacity
  public opacityChange = 1;
  public splashTransition : any;
  // First access the splash is visible
  public showSplash = true;

  readonly ANIMATION_DURATION = 2;

  constructor(private splashScreenStateService: SplashScreenStateService) {

    this.image = (this.image == null)? "assets/img/eg_rd_black.png" : this.image;

  }

  ngOnInit(): void {
    // Somewhere the stop method has been invoked

    this.splashScreenStateService.subscribe((res:any) => {

      this.hideSplashAnimation();
    });
  }

  private hideSplashAnimation() {
    // Setting the transition
    this.splashTransition = `opacity ${this.ANIMATION_DURATION}s`;
    this.opacityChange = 0;
    setTimeout(() => {
      // After the transition is ended the showSplash will be hided
      this.showSplash = !this.showSplash;
    }, 1000);
  }

}

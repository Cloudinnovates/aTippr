//Angular
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';
//Translate
import { TranslateService } from 'ng2-translate';
//Material2
import { MdSnackBar } from '@angular/material';
//Services
import { MatchesService } from '../services/matches.service';
import { TippsService } from '../services/tipps.service';
//Models
import { MatchesModel, MatchesModelTipper } from '../models/matches';
import { TippsModel } from '../models/tipps';

@Component({
  selector: 'Tipper',
  templateUrl: './tipper.component.html',
  styleUrls: ['./tipper.component.css'],
  providers: [MdSnackBar]
})
export class TipperComponent implements OnInit{

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private matchesService: MatchesService,
    private tippsService: TippsService,
    private snackBar: MdSnackBar,
    private translate: TranslateService
  ){}

  private matchesmodelview: MatchesModelTipper[];
  private category: string;
  private categoryname: string;
  private tippsmodelview: TippsModel[];
  private preloadingDone: boolean = false;
  private nomatches: boolean = false;
  private timerSubscription: any = null;
  private now: number = new Date().getTime();

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.category = params['category'];
      this.categoryname = params['categoryname'];
    });
    this.getAllMatches(this.category);
    let timer = Observable.timer(1000, 1000);
    this.timerSubscription = timer.subscribe((t:any) => {
      this.now = new Date().getTime();
    });
  }

  getAllMatches(category: string): void {
    this.matchesService.getAllwithTeams(category).subscribe(matches => {
      this.matchesmodelview = matches;
      if(this.matchesmodelview.length <= 0){
        this.nomatches = true;
      } else {
        this.nomatches = false;
      }
      this.matchesmodelview.forEach(match => {
        match.matchstart = new Date(match.matchstart).toLocaleString();
        if(this.now >= match.deadline) {
          match.background = 'LightGrey ';
        } else {
          match.background = 'Transparent';
        }
      })
      this.getAllTipps(category);
    });
  }

  getAllTipps(category: string): void {
    this.tippsService.getAllOwnUser(category).subscribe(tipps => {
      this.tippsmodelview = tipps;
      this.mergeCollections();
      this.preloadingDone = true;
    });
  }

  mergeCollections() {
    this.matchesmodelview.forEach((match) => {
      let tippmerge = this.tippsmodelview.find(tipp => tipp.match == match['$key']);
      if(tippmerge){
        match.tippkey = tippmerge['$key'];
        match.tipp1 = tippmerge.tipp1;
        match.tipp2 = tippmerge.tipp2;
      }
    })
  }

  submitTipps(): void {
    let tippscreate = [];
    let tippsupdate = [];
    this.matchesmodelview.forEach(match => {
      if(match.hasOwnProperty('tippkey')) {
        if(match.hasOwnProperty('tipp1') && match.hasOwnProperty('tipp2')) {
          tippsupdate.push(new TippsModel( match.tippkey, this.category, match['$key'], match.tipp1, match.tipp2));
        }
      } else {
        if(match.hasOwnProperty('tipp1') && match.hasOwnProperty('tipp2')) {
          tippscreate.push(new TippsModel( '', this.category, match['$key'], match.tipp1, match.tipp2));
        }
      }
    })

    //Change existing
    this.tippsService.change(tippsupdate);
    //Create new
    this.tippsService.create(tippscreate);

    this.translate.get('Tipps wurden geändert', 'Close').subscribe( translation => {
      this.snackBar.open(translation, 'Close', { duration: 2000 });
    })
  }

  ngOnDestroy() {
    if (this.timerSubscription != null) {
        this.timerSubscription.unsubscribe();
    }
  }

}
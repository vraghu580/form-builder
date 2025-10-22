import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-engine-main',
  standalone: false,
  templateUrl: './data-engine-main.html',
  styleUrl: './data-engine-main.scss'
})
export class DataEngineMain {
  
  constructor(private router: Router){}

  backToHome(): void{
      this.router.navigate(['/home']);
  }

}

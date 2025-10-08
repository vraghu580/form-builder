import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
   forms = [  

    {
      title: 'Single Page Form',
      iconClasses: 'bi-file-earmark-text',
      iconBg: 'bg-blue-500 text-white',
      badgeText: 'Simple',
      badgeBg: 'bg-green-100 text-green-700',
      description: 'Traditional form with all fields on one page',
      keyFeatures: ['Quick setup', 'Simple validation', 'Mobile responsive'],
      bestFor: 'Contact forms, feedback, simple data entry',
      setupTime: '5-15 minutes',
      route: 'single-form'
    },
    {
      title: 'Multi-Step Form',
      iconClasses: 'bi-stack',
      iconBg: 'bg-green-500 text-white',
      badgeText: 'Medium',
      badgeBg: 'bg-yellow-100 text-yellow-700',
      description: 'Break complex forms into manageable steps',
      keyFeatures: ['Progress tracking', 'Step validation', 'Save & resume'],
      bestFor: 'Registration, surveys, complex applications',
      setupTime: '15-30 minutes',
      route: 'multi-form'
    }  
  ];

constructor ( private router: Router) {}


navigateToForm(route: any){
  this.router.navigate([route])
}

}

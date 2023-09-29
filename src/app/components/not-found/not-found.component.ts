import { Component } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  isDarkMode: boolean = false;

  constructor(
    private servicoTema: ThemeService
  ){}
  ngOnInit(){
    this.servicoTema.currentTheme.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }
}

import { Component } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-politica',
  templateUrl: './politica.component.html',
  styleUrls: ['./politica.component.css']
})
export class PoliticaComponent {
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
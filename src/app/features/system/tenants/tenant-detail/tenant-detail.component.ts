import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from '@angular/material/button';
import { CustomizerSettingsService } from '../../../../shared/services/customizer-settings.service';

@Component({
  selector: 'app-tenant-detail.component',
    imports: [RouterOutlet, RouterLink, MatCardModule, RouterLinkActive, MatButtonModule],
  templateUrl: './tenant-detail.component.html',
  styleUrl: './tenant-detail.component.scss',
})
export class TenantDetailComponent {
  themeService: CustomizerSettingsService = inject(CustomizerSettingsService);
}

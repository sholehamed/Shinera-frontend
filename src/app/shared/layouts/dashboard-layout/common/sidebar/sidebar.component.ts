import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ToggleService } from '../header/toggle.service';
import { MenuCategoryDto, SidebarMenuService, SidebarRole } from './sidebar-menu.service';
import { TenantContextService } from '../../../../services/tenant-context.service';
import { CustomizerSettingsService } from '../../../../services/customizer-settings.service';
import { FileService } from '../../../../components/avatar-upload/upload.service';
import { NgScrollbarModule } from 'ngx-scrollbar';


@Component({
    selector: 'app-sidebar',
    imports: [
        CommonModule,
        NgClass,
        RouterLink,
        RouterLinkActive,
        MatExpansionModule,
        MatFormFieldModule,
        MatSelectModule,
        NgScrollbarModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    standalone: true
})
export class SidebarComponent implements OnInit {
    protected readonly _tenantContext=inject(TenantContextService)
    private readonly _fileService=inject(FileService)
    private readonly toggleService = inject(ToggleService);
    readonly themeService = inject(CustomizerSettingsService);
    private readonly menuService = inject(SidebarMenuService);

    readonly isSidebarToggled = this.toggleService.isSidebarToggled;
    readonly isToggled = this.themeService.isNavbarToggled;
    readonly panelOpenState = signal(false);

    // تبدیل به signal
    readonly roles = signal<SidebarRole[]>([]);
    readonly selectedRole = signal<SidebarRole | null>(null);
    readonly menuSections = signal<MenuCategoryDto[]>([]);
    readonly isMenuLoading = signal(false);
    _logoSrc:null|string='shinera-dark-logo.png'
    ngOnInit(): void {
        this.loadRoles();
        // this._fileService.preview(this._tenantContext.current!.logo!).subscribe(d=>{
        //    this.setPreview(d)
            
        // })
    }
 private setPreview(blob: Blob): void {
    const objectUrl = URL.createObjectURL(blob);
    this._logoSrc = objectUrl;
  }
    onRoleChange(role: SidebarRole): void {
        this.selectedRole.set(role);
        this.loadMenu(role.id);
    }

    private loadMenu(roleId: string): void {
        this.isMenuLoading.set(true);

        this.menuService.getMenuByRole(roleId).subscribe({
            next: menuSections => {
                this.menuSections.set(menuSections);
                this.isMenuLoading.set(false);
            },
            error: error => {
                console.error('Failed to load sidebar menu', error);
                this.menuSections.set([]);
                this.isMenuLoading.set(false);
            }
        });
    }

    private loadRoles(): void {
        
        this.menuService.getRoles().subscribe({
            next: roles => {
                this.roles.set(roles);

                if (roles.length > 0) {
                    this.selectedRole.set(roles[0]);
                    this.loadMenu(roles[0].id);
                }
            },
            error: error => {
                console.error('Failed to load sidebar roles', error);
            }
        });
    }

    toggle(): void {
        this.toggleService.toggle();
    }
}

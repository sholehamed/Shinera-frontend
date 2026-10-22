import { AfterViewInit, Component, inject, Input, signal } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute,ActivatedRouteSnapshot,Router } from '@angular/router';
import { ResourcesService } from '../../resources.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UiResourcesService } from '../ui-resources.service';
import {
  PageHeaderComponent,

}from '../../../../../shared/components/grid-components'
import { CustomInputComponent, CustomSelectComponent, CustomTextEreaComponent, CustomToggleComponent,NoAutofillDirective } from '../../../../../shared/components/form-components';
import { CustomizerSettingsService } from '../../../../../shared/services/customizer-settings.service';
@Component({
  selector: 'app-ui-resource-form.component',
    imports: [NoAutofillDirective, ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, CustomInputComponent, CustomToggleComponent, CustomInputComponent, CustomTextEreaComponent, CustomSelectComponent, PageHeaderComponent],
  templateUrl: './ui-resource-form.component.html',
  styleUrl: './ui-resource-form.component.scss',
})
export class UiResourceFormComponent implements AfterViewInit {
  @Input() uiResourceId?:string;
    @Input() resourceId?:string;

  resources=signal<any|null>([])
  uiResourceType:{id:number,name:string}[]=[{id:0,name:'Menu'},{id:1,name:'Page'},{id:2,name:'Action'},{id:3,name:'Field'},{id:4,name:'Component'}]
  ngAfterViewInit(): void {
    const t= this.getRouteTemplate()
    alert(t)
    this.searchModule()
  }
  getRouteTemplate(): string {
  let snapshot: ActivatedRouteSnapshot | null = this.route.snapshot.root;
  const parts: string[] = [];

  while (snapshot) {
    if (snapshot.routeConfig?.path) {
      parts.push(snapshot.routeConfig.path);
    }

    snapshot = snapshot.firstChild ?? null;
  }

  return '/' + parts.join('/');
}
  searchModule(text?:string){
this.moduleService.getLookup().subscribe({
      next:x=>{this.resources.set(x)}
    })
  }
themeService:CustomizerSettingsService=inject(CustomizerSettingsService)
_loc:Location=inject(Location)
service:UiResourcesService=inject(UiResourcesService)
moduleService:ResourcesService=inject(ResourcesService)
route: ActivatedRoute = inject(ActivatedRoute);
_route: Router = inject(Router);
update:boolean=false;
back(){
  
             this._loc.back()
  }
ngOnInit() {
   if (this.resourceId) {
    this.userForm.patchValue({
      resourceId: this.resourceId
    });
  }

  if (this.uiResourceId) {
    this.update=true
    this.load();
  }
}
 
load(){
  this.service.getById(this.uiResourceId!).subscribe({
     next: (item:any) => {
      
      this.userForm.patchValue(item);
    },
  })
}
userForm = new FormGroup({
  resourceId: new FormControl('', {nonNullable: true,validators: [Validators.required],}),
  key: new FormControl('', {nonNullable: true,validators: [Validators.required],}),
    title: new FormControl('', {nonNullable: true,validators: [Validators.required],}),
    name: new FormControl('', {nonNullable: true,validators: [Validators.required],}),
    description: new FormControl('', {nonNullable: false,validators: [],}),
    type: new FormControl('', {nonNullable: false,validators: [],}),
    scope: new FormControl('', {nonNullable: false,validators: [],}),
    isActive: new FormControl(true, {nonNullable: true,validators: [Validators.required],},),
    isDeprecated: new FormControl(false, {nonNullable: true,validators: [Validators.required],},),
  },
);
 
  Submit(){
    if(!this.update){
      this.service.create(this.userForm).subscribe({
        next:value=>{
          this.back()
        },
        error(err) {
          alert(err)
        },
      })
    }
    else{
      this.service.update(this.uiResourceId!,this.userForm).subscribe({
        next:value=>{
          this.back()
        },
        error(err) {
          alert(err)
        },
      })
    }
  }
}



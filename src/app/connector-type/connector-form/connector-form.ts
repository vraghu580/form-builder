import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { connectionTypeService } from '../../services/connection-type-service';

// export interface MetadataSchema {
//   connection_string: string;
//   username: string;
//   password: string;
//   port: number;
// }

// export interface ConnectorFormModel {
//   category: string;
//   name: string;
//   connector_type: string;
//   metadata_schema: MetadataSchema;
//   image?: string; // optional
// }

@Component({
  selector: 'app-connector-form',
  standalone: false,
  templateUrl: './connector-form.html',
  styleUrls: ['./connector-form.scss']
})
export class ConnectorForm {
  connectionForm: FormGroup;

  constructor(private fb: FormBuilder, private connectionTypeService: connectionTypeService) {
    this.connectionForm = this.fb.group({
      name: ['', Validators.required],
      displayName: ['', Validators.required],
      category: ['', Validators.required],
      connector_type: ['', Validators.required],
      metadataSchema: this.fb.array([])
    });
  }

  // Getter for metadataSchema form array
  get metadataSchema(): FormArray {
    return this.connectionForm.get('metadataSchema') as FormArray;
  }

  // Add metadata field
  addMetadataField() {
    const field = this.fb.group({
      key: ['', Validators.required],
      label: ['', Validators.required],
      required: [false],
      type: ['', Validators.required]
    });
    this.metadataSchema.push(field);
  }

  // Remove metadata field
  removeMetadataField(index: number) {
    this.metadataSchema.removeAt(index);
  }


  // Submit Form
  onSubmit() {
    if (this.connectionForm.valid) {
      console.log('Final Request Body:', this.connectionForm.value);
      this.connectionTypeService.createConnectionType(this.connectionForm.value).subscribe((res) => {
        console.log('Response', res);
      })
    } else {
      alert('Please fill all required fields')
    }
  }
}
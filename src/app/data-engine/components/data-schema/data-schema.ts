import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-schema',
  standalone: false,
  templateUrl: './data-schema.html',
  styleUrls: ['./data-schema.scss']
})
export class DataSchema implements OnInit {
  loading = true;
  schemaList: any[] = [];
  errorMsg = '';
  selectedColumns: any[] = [];
  selectedTable: any = null;
  searchQuery: string = '';
  hoveredRow: number | null = null;
  checkedColumns: Set<string> = new Set();

  constructor(private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log(' DataSchema initialized');
    const savedSchema = localStorage.getItem('schemaData');
    if (savedSchema) {
      const parsed = JSON.parse(savedSchema);
      this.handleSchemaData(parsed);
    } else {
      this.loading = false;
      this.errorMsg = 'No schema data found.';
    }
  }

  handleSchemaData(data: any) {
    if (data?.result && Array.isArray(data.result)) {
      this.schemaList = data.result;
      this.selectedTable = this.schemaList[0];
      this.loading = false;
      this.cdr.detectChanges();
    } else {
      this.errorMsg = 'Invalid schema data format.';
      this.loading = false;
    }
  }

  get filteredColumns() {
    if (!this.searchQuery) return this.selectedTable?.columns || [];
    return this.selectedTable?.columns.filter((col: any) =>
      col.columnName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }


  onTableSelect(event: any) {
    const selectedName = event.target.value;
    this.selectedTable = this.schemaList.find(t => t.tableName === selectedName);
    this.checkedColumns.clear();
  }

  toggleCheckbox(columnName: string) {
    if (this.checkedColumns.has(columnName)) {
      this.checkedColumns.delete(columnName);
    } else {
      this.checkedColumns.add(columnName);
    }
  }


  setHover(index: number | null) {
    this.hoveredRow = index;
  }

  onImportToFormBuilder() {
    const selectedColumnsData = this.selectedTable.columns.filter((col: any) =>
      this.checkedColumns.has(col.columnName)
    );

    console.log('📤 Sending selected columns to Form Builder:', selectedColumnsData);

    if (selectedColumnsData.length === 0) {
      alert('Please select at least one column to import.');
      return;
    }

    
    localStorage.setItem('importedColumns', JSON.stringify(selectedColumnsData));

    alert(`Importing ${this.checkedColumns.size} column(s) to Form Builder...`);

    
    this.router.navigate(['/data-engine/form-builder'], {
      state: { importedColumns: selectedColumnsData }
    });
  }
}

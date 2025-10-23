import { Component, OnInit, computed, signal } from '@angular/core';
import { connectionTypeService } from '../../../services/connection-type-service';

type SourceType = 'database' | 'cloud' | 'api' | 'file';

interface Connection {
  name: string;
  vendor?: string;
  kind?: SourceType;
  refreshable?: boolean;
  icon: string;
  bgClass?: string;
  iconClass?: string;
}

interface CatalogGroup {
  label: string;
  kind: SourceType | 'all';
  count: number;
}

@Component({
  selector: 'app-connect-manage-source',
  standalone: false,
  templateUrl: './connect-manage-source.html',
  styleUrl: './connect-manage-source.scss'
})
export class ConnectManageSource implements OnInit {

  constructor(private connectionService: connectionTypeService) {}

  query = signal('');
  selectedKind = signal<CatalogGroup['kind']>('all');
  catalog = signal<Connection[]>([]);
  connections = signal<Connection[]>([]);

  groups = signal<CatalogGroup[]>([
    { label: 'All Sources', kind: 'all', count: 0 },
    { label: 'Databases', kind: 'database', count: 0 },
    { label: 'Cloud Services', kind: 'cloud', count: 0 },
    { label: 'APIs', kind: 'api', count: 0 },
    { label: 'Files', kind: 'file', count: 0 },
  ]);

  ngOnInit(): void {
    this.loadConnections();
  }

  loadConnections(): void {
    this.connectionService.getAll().subscribe({
      next: (res: any) => {
        console.log('✅ API Response:', res);
        const mappedData: Connection[] = res.map((item: any) => ({
          name: item.displayName || item.name || 'Untitled',
          vendor: item.connector_type || item.category || 'Unknown',
          kind: this.getKindFromCategory(item.category),
          refreshable: true,
          icon: this.getIcon(item.category),
          bgClass: this.getBgClass(item.category),
          iconClass: 'text-white text-xl'
        }));

        this.catalog.set(mappedData);
        this.connections.set(mappedData);
        this.updateGroupCounts(mappedData);
      },
      error: (err) => {
        console.error(' Failed to fetch connectors:', err);
      }
    });
  }

  private getKindFromCategory(category: string): SourceType {
    switch ((category || '').toLowerCase()) {
      case 'database': return 'database';
      case 'cloud': return 'cloud';
      case 'api': return 'api';
      case 'file': return 'file';
      default: return 'database';
    }
  }

  private getIcon(category: string): string {
    switch ((category || '').toLowerCase()) {
      case 'database': return 'bi bi-database';
      case 'cloud': return 'bi bi-cloud';
      case 'api': return 'bi bi-globe2';
      case 'file': return 'bi bi-file-earmark';
      default: return 'bi bi-database';
    }
  }

  private getBgClass(category: string): string {
    switch ((category || '').toLowerCase()) {
      case 'database': return 'bg-blue-500';
      case 'cloud': return 'bg-green-500';
      case 'api': return 'bg-purple-500';
      case 'file': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  }

  private updateGroupCounts(data: Connection[]): void {
    const allCount = data.length;
    const dataBaseCount = data.filter(d => d.kind === 'database').length;
    const cloudCount = data.filter(d => d.kind === 'cloud').length;
    const apiCount = data.filter(d => d.kind === 'api').length;
    const fileCount = data.filter(d => d.kind === 'file').length;

    this.groups.set([
      { label: 'All Sources', kind: 'all', count: allCount },
      { label: 'Databases', kind: 'database', count: dataBaseCount },
      { label: 'Cloud Services', kind: 'cloud', count: cloudCount },
      { label: 'APIs', kind: 'api', count: apiCount },
      { label: 'Files', kind: 'file', count: fileCount },
    ]);
  }

  selectKind(kind: CatalogGroup['kind']): void {
    this.selectedKind.set(kind);
  }

  filteredConnections = computed(() => {
    const filter = this.query().toLowerCase();
    const kind = this.selectedKind();
    return this.catalog().filter(c => {
      const matchesKind = kind === 'all' ? true : c.kind === kind;
      const matchesText = !filter || c.name.toLowerCase().includes(filter);
      return matchesKind && matchesText;
    });
  });

  searchFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.query.set(filterValue);
  }

  
}

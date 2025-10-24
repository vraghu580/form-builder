import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { connectionTypeService } from '../../../services/connection-type-service';
import { Router } from '@angular/router';

type SourceType = 'database' | 'cloud' | 'api' | 'file';

interface Connection {
  name: string;
  source?: string;
  kind?: SourceType;
  refreshable?: boolean;
  icon: string;
  bgClass?: string;
  iconClass?: string;
}

interface SourceList {
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

  constructor(private connectionService: connectionTypeService, private cdr: ChangeDetectorRef, private router: Router) { }


  searchsource: string = '';
  selectedKind: SourceList['kind'] = 'all';
  connectiondata: Connection[] = [];
  connections: Connection[] = [];

  groups: SourceList[] = [
    { label: 'All Sources', kind: 'all', count: 0 },
    { label: 'Databases', kind: 'database', count: 0 },
    { label: 'Cloud Services', kind: 'cloud', count: 0 },
    { label: 'APIs', kind: 'api', count: 0 },
    { label: 'Files', kind: 'file', count: 0 },
  ];

  ngOnInit(): void {
    this.loadConnections();
  }


loadConnections(): void {
  this.connectionService.getAll().subscribe({
    next: (res: any[]) => {
       console.log('API Response:', res);
      const data: Connection[] = res.map(item => ({
        name: item.displayName || item.name || 'Untitled',
        source: item.connector_type || item.category || 'Unknown',
        kind: this.getKindFromCategory(item.category),
        icon: this.iconName(item.category),
        bgClass: this.iconBgClass(item.category),
        iconClass: 'text-white text-xl'
      }));
      this.connectiondata = data;
      this.connections = data;
      this.updateGroupCounts(data);
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Failed to fetch connectors:', err)
  });
}

  

  getKindFromCategory(category: string = ''): SourceType {
    const kindMap: Record<string, SourceType> = {
      database: 'database',
      cloud: 'cloud',
      api: 'api',
      file: 'file'
    };

    return kindMap[category.toLowerCase()] || 'database';
  }

  iconName(category: string = ''): string {
    const iconMap: Record<string, string> = {
      database: 'bi bi-database',
      cloud: 'bi bi-cloud',
      api: 'bi bi-globe2',
      file: 'bi bi-file-earmark'
    };

    return iconMap[category.toLowerCase()] || 'bi bi-database';
  }

  iconBgClass(category: string = ''): string {
    const bgColorMap: Record<string, string> = {
      database: 'bg-blue-500',
      cloud: 'bg-green-500',
      api: 'bg-purple-500',
      file: 'bg-orange-500'
    };

    return bgColorMap[category.toLowerCase()] || 'bg-gray-400';
  }

  updateGroupCounts(data: Connection[]): void {
    const countByKind = {
      database: 0,
      cloud: 0,
      api: 0,
      file: 0,
    };

    data.forEach(item => {
      if (item.kind && countByKind.hasOwnProperty(item.kind)) {
        countByKind[item.kind]++;
      }
    });

    this.groups = [
      { label: 'All Sources', kind: 'all', count: data.length },
      { label: 'Databases', kind: 'database', count: countByKind.database },
      { label: 'Cloud Services', kind: 'cloud', count: countByKind.cloud },
      { label: 'APIs', kind: 'api', count: countByKind.api },
      { label: 'Files', kind: 'file', count: countByKind.file },
    ];
  }


  selectKind(kind: SourceList['kind']): void {
    this.selectedKind = kind;
    this.filterConnections();
  }

  searchFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchsource = filterValue;
    this.filterConnections();
  }


  filterConnections(): void {
    const filter = this.searchsource.toLowerCase();
    const kind = this.selectedKind;

    this.connections = this.connectiondata.filter(c => {
      const matchesKind = kind === 'all' ? true : c.kind === kind;
      const matchesText = !filter || c.name.toLowerCase().includes(filter);
      return matchesKind && matchesText;
    });
  }

  goToConnection(card: any) {
    // Navigate with route parameter
    this.router.navigate(['/connect', card.name]);
  }
}

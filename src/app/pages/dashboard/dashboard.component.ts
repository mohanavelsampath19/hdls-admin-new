import { Component, OnInit } from '@angular/core';
import { BookingsService } from 'src/app/services/bookings/bookings.service';
import { environment } from "../../../environments/environment";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


export interface MonthlyTask {
  name: string;
  start: Date;
  end: Date;
  color?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  items = ['Angular', 'React', 'Vue', 'Svelte', 'Next.js'];
  selectedItems: string[] = [];
  ngOnInit(): void {
    
  }
  toggleSelect(item: string, event: MouseEvent) {
    if (event.ctrlKey || event.metaKey) {
      // Toggle selection
      const index = this.selectedItems.indexOf(item);
      if (index === -1) this.selectedItems.push(item);
      else this.selectedItems.splice(index, 1);
    } else {
      // Single select
      this.selectedItems = [item];
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    // When dropped, move only if single selection
    if (this.selectedItems.length === 1) {
      moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    } else {
      console.log('Group move logic would go here');
      console.log(this.selectedItems);
      console.log(event);
    }
  }

  dragMoved(event: any, item: string) {
    if (this.selectedItems.length > 1) {
      // Here you could manually move all selected elements visually
      // using CSS transform or dynamic positioning.
      // (Complex — not built into CDK)
    }
  }
}

import { Component, input, OnInit, output, signal } from '@angular/core';
import { Group } from '../../../../core/models/bookmark.model';
import { DatePipe } from '@angular/common';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { TooltipDirective } from '../../../../shared/directives/tooltip.directive';

@Component({
  selector: 'app-group-card',
  imports: [DatePipe, TruncatePipe, TooltipDirective],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.scss',
})
export class GroupCardComponent implements OnInit {
  group = input.required<Group>();
  totalBookmarks = input<number>(0);
  finishedBookmarks = input<number>(0);

  openGroup = output<string | number>();
  editGroup = output<Group>();
  deleteGroup = output<Group>();

  isDefaultGroup = signal<boolean>(false);

  ngOnInit(): void {
    if (this.group().title.trim().toLowerCase() === 'general') {
      this.isDefaultGroup.set(true);
    }
  }

  onCardClick() {
    const id = this.group().id;
    if (id !== undefined) {
      this.openGroup.emit(id);
    }
  }

  onEditClick(event: MouseEvent) {
    event.stopPropagation();
    this.editGroup.emit(this.group());
  }

  onDeleteClick(event: MouseEvent) {
    event.stopPropagation();
    this.deleteGroup.emit(this.group());
  }
}

import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Group } from '../../../../core/models/bookmark.model';

@Component({
  selector: 'app-group-form',
  imports: [ReactiveFormsModule],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.scss'
})
export class GroupFormComponent {
  private fb = inject(FormBuilder);

  group = input<Group | null>(null);

  save = output<Partial<Group>>();
  cancel = output<void>();

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]]
  });

  constructor() {
    effect(() => {
      const current = this.group();
      if (current) {
        this.form.patchValue({
          title: current.title ?? '',
          description: current.description ?? ''
        });
      } else {
        this.form.reset({
          title: '',
          description: ''
        });
      }
    });
  }

  get titleControl() {
    return this.form.controls.title;
  }

  get descriptionControl() {
    return this.form.controls.description;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.save.emit({
      title: raw.title.trim(),
      description: raw.description.trim()
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}
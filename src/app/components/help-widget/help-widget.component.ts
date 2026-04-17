/**
 * ======================================
 * PROG2005 Assignment 3
 * Help Widget Component - Contextual Help (Standalone)
 * Author: daitongxiao
 * ======================================
 *
 * Reusable help widget that provides contextual assistance
 * on every tab page. Displays help content in a slide-over panel
 * with keyboard support and smooth animations.
 *
 * Usage:
 * <app-help-widget [content]="helpContent"></app-help-widget>
 */

import { Component, Input, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

/** Interface for help content sections */
export interface HelpSection {
  heading: string;
  text: string;
  icon?: string;
}

export interface HelpContent {
  title: string;
  sections: HelpSection[];
}

@Component({
  selector: 'app-help-widget',
  templateUrl: './help-widget.component.html',
  styleUrls: ['./help-widget.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HelpWidgetComponent {
  /** Help content passed from parent page */
  @Input() content: HelpContent = { title: 'Help', sections: [] };

  /** Whether the help panel is open */
  isOpen = signal<boolean>(false);

  /** Currently expanded section index (-1 = none) */
  expandedSection = signal<number>(-1);

  /**
   * Toggle help panel visibility
   */
  toggleHelp(): void {
    this.isOpen.update(v => !v);
    if (!this.isOpen()) {
      this.expandedSection.set(-1);
    }
  }

  /**
   * Close the help panel
   */
  closeHelp(): void {
    this.isOpen.set(false);
    this.expandedSection.set(-1);
  }

  /**
   * Toggle a help section's expanded state
   */
  toggleSection(index: number): void {
    this.expandedSection.update(current => current === index ? -1 : index);
  }

  /**
   * Close panel on Escape key press
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.closeHelp();
    }
  }
}

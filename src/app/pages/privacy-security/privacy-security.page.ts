/**
 * ======================================
 * PROG2005 Assignment 3
 * Privacy & Security Page (Tab 4)
 * Author: daitongxiao
 * ======================================
 */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HelpWidgetComponent } from '../../components/help-widget/help-widget.component';

@Component({
  selector: 'app-privacy-security',
  templateUrl: './privacy-security.page.html',
  styleUrls: ['./privacy-security.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HelpWidgetComponent
  ],
})
export class PrivacySecurityPage {
  /** Currently expanded section index (-1 = none) */
  expandedIndex = signal<number>(-1);

  /** Help content */
  helpContent = {
    title: 'Privacy & Security Help',
    sections: [
      {
        heading: 'About This Page',
        text: 'This page provides a comprehensive analysis of privacy and security considerations for the inventory management application.'
      }
    ]
  };

  /** Privacy analysis sections */
  sections = [
    {
      title: 'Data Collection & Storage',
      icon: 'database-outline',
      content: 'This application collects and processes inventory management data including item names, categories, quantities, prices, and supplier information. All data is stored on a remote server (prog2005.it.scu.edu.au) using RESTful API endpoints. The application does not store sensitive personal information such as credit card details, social security numbers, or health records. However, supplier names and business data are considered commercially sensitive and require appropriate protection measures.'
    },
    {
      title: 'API Security & Data Transmission',
      icon: 'lock-closed-outline',
      content: 'The application communicates with the backend API via HTTPS, ensuring encrypted data transmission between the client and server. All CRUD operations (GET, POST, PUT, DELETE) are performed over secure channels. The API enforces access controls, including the restriction that "Laptop" items cannot be deleted, ensuring data integrity. Rate limiting and input validation are implemented server-side to prevent injection attacks and unauthorized access.'
    },
    {
      title: 'User Data Protection',
      icon: 'shield-outline',
      content: 'The application does not require user authentication or login, minimizing personal data exposure. No cookies or local storage are used to persist user data between sessions. The application operates in a stateless manner, fetching data from the API on each session. This approach reduces the attack surface for data breaches, as no personal data is cached on the device. However, users should be aware that their interactions with the API are logged server-side.'
    },
    {
      title: 'Encryption & Secure Practices',
      icon: 'key-outline',
      content: 'Data in transit is protected by TLS/HTTPS encryption. The Ionic framework provides built-in security features including Content Security Policy (CSP) headers, which prevent Cross-Site Scripting (XSS) attacks. Input validation is implemented both client-side (ReactiveForms Validators) and server-side to prevent SQL injection and other injection attacks. The application follows the principle of least privilege, only requesting necessary API endpoints.'
    },
    {
      title: 'Cross-Platform Security Considerations',
      icon: 'phone-portrait-outline',
      content: 'As a cross-platform Ionic application, security considerations span web, iOS, and Android environments. On mobile devices, the application runs within a WebView container (Capacitor), which provides an additional security sandbox. The application does not request device permissions (camera, location, contacts), minimizing privacy risks. CORS policies are enforced by the API server to prevent unauthorized cross-origin requests.'
    },
    {
      title: 'GenAI Transparency & Ethical Use',
      icon: 'logo-electron',
      content: 'Generative AI tools may have been used during development for code assistance, debugging, and documentation. All GenAI usage is disclosed in accordance with Southern Cross University\'s Level 2 GenAI guidelines. AI-generated code has been reviewed, tested, and modified by the development team to ensure accuracy, security, and compliance with assignment requirements. The team maintains full responsibility for the final code quality and security posture.'
    },
    {
      title: 'Recommendations for Enhanced Security',
      icon: 'bulb-outline',
      content: '1. Implement user authentication (OAuth 2.0 / JWT) for API access control. 2. Add role-based access control (RBAC) to restrict operations by user type. 3. Implement data backup and disaster recovery procedures. 4. Add audit logging for all CRUD operations. 5. Conduct regular security penetration testing. 6. Implement CSP headers and Subresource Integrity (SRI) for all external resources. 7. Consider end-to-end encryption for commercially sensitive data.'
    }
  ];

  /**
   * Toggle section expansion
   */
  toggleSection(index: number): void {
    this.expandedIndex.update(current => current === index ? -1 : index);
  }
}

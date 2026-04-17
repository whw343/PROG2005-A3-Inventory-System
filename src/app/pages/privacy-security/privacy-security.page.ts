/**
 * ======================================
 * PROG2005 Assignment 3
 * Privacy & Security Page (Tab 4)
 * Author: daitongxiao
 * ======================================
 *
 * Comprehensive privacy and security analysis for the
 * Inventory Management System, covering data protection,
 * API security, encryption, and GenAI transparency.
 */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HelpWidgetComponent } from '../../components/help-widget/help-widget.component';

/** Interface for a security analysis section */
interface SecuritySection {
  title: string;
  icon: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  summary: string;
  content: string;
  recommendations?: string[];
}

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
        heading: '📖 About This Page',
        text: 'This page provides a comprehensive privacy and security analysis for the PROG2005 Inventory Management System. Each section covers a specific security domain with severity ratings and actionable recommendations.',
        icon: 'information-circle-outline'
      },
      {
        heading: '🎯 Severity Levels',
        text: '🔴 High: Critical security concern requiring immediate attention. 🟡 Medium: Important but not immediately critical. 🟢 Low: Best practice recommendation. 🔵 Info: Informational note for awareness.',
        icon: 'flag-outline'
      },
      {
        heading: '📱 How to Navigate',
        text: 'Tap any section to expand its detailed analysis. Each section includes a summary, detailed content, and specific recommendations where applicable. Tap again to collapse.',
        icon: 'navigate-outline'
      }
    ]
  };

  /** Privacy & Security analysis sections */
  sections: SecuritySection[] = [
    {
      title: 'Data Collection & Storage',
      icon: 'database-outline',
      severity: 'high',
      summary: 'Inventory data is stored on a remote SCU server. No personal user data is collected.',
      content: `This application collects and processes inventory management data including item names, categories, quantities, prices, and supplier information. All data is stored on a remote server (prog2005.it.scu.edu.au) using RESTful API endpoints.

The application does NOT collect or store:
• Personal identification information (names, emails, phone numbers)
• Financial data (credit card details, banking information)
• Health or biometric data
• Location or device tracking information

Supplier names and business data are considered commercially sensitive and require appropriate protection measures. The application follows data minimisation principles by only collecting data necessary for inventory management operations.`,
      recommendations: [
        'Implement data retention policies with automatic cleanup',
        'Add data export functionality for backup purposes',
        'Consider encrypting commercially sensitive fields at rest'
      ]
    },
    {
      title: 'API Security & Data Transmission',
      icon: 'lock-closed-outline',
      severity: 'high',
      summary: 'HTTPS encryption for all API calls. Server-side rate limiting and access controls enforced.',
      content: `The application communicates with the backend API via HTTPS, ensuring encrypted data transmission between the client and server. All CRUD operations (GET, POST, PUT, DELETE) are performed over secure channels.

API Security Measures:
• TLS/HTTPS encryption for all data in transit
• Server-side input validation prevents injection attacks
• Rate limiting to prevent abuse and DDoS attacks
• CORS policy restricts cross-origin access
• The API enforces access controls, including the restriction that "Laptop" items cannot be deleted

The DELETE restriction on Laptop items demonstrates data integrity controls — ensuring at least one baseline record remains in the database at all times.`,
      recommendations: [
        'Implement OAuth 2.0 or JWT-based authentication',
        'Add API request signing for tamper prevention',
        'Implement request throttling per client IP'
      ]
    },
    {
      title: 'User Data Protection',
      icon: 'shield-checkmark-outline',
      severity: 'medium',
      summary: 'No user authentication required. Stateless operation minimises data exposure.',
      content: `The application does not require user authentication or login, minimising personal data exposure. No cookies or local storage are used to persist user data between sessions.

Privacy Protection Features:
• No user accounts or login credentials stored
• No cookies tracking user behaviour
• No local storage caching of sensitive data
• Stateless API interactions — data fetched fresh each session
• No third-party analytics or tracking scripts

This approach significantly reduces the attack surface for data breaches, as no personal data is cached on the device. However, users should be aware that their API interactions may be logged server-side for debugging and monitoring purposes.`,
      recommendations: [
        'Add optional user authentication for production deployments',
        'Implement session timeout for idle connections',
        'Add privacy policy page accessible from the app'
      ]
    },
    {
      title: 'Encryption & Secure Practices',
      icon: 'key-outline',
      severity: 'medium',
      summary: 'Client-side validation with ReactiveForms. Server-side CSP headers prevent XSS attacks.',
      content: `Data in transit is protected by TLS/HTTPS encryption. The Ionic framework provides built-in security features:

Client-Side Security:
• ReactiveForms Validators prevent invalid data submission
• Input sanitisation on all form fields (minLength, maxLength, min values)
• Content Security Policy (CSP) headers prevent Cross-Site Scripting (XSS)
• No use of innerHTML or direct DOM manipulation

Server-Side Security:
• Input validation on all API endpoints
• SQL injection prevention through parameterised queries
• Principle of least privilege — only necessary API endpoints accessed
• Error messages sanitised to prevent information leakage`,
      recommendations: [
        'Implement Subresource Integrity (SRI) for external resources',
        'Add Content-Security-Policy-Report-Only headers for monitoring',
        'Consider certificate pinning for production API'
      ]
    },
    {
      title: 'Cross-Platform Security (Ionic/Capacitor)',
      icon: 'phone-portrait-outline',
      severity: 'low',
      summary: 'WebView sandbox provides additional security layer. No device permissions requested.',
      content: `As a cross-platform Ionic application, security considerations span web, iOS, and Android environments:

Mobile Security:
• Application runs within a Capacitor WebView container — providing an additional security sandbox
• No device permissions requested (camera, location, contacts, storage)
• No background data collection or processing
• Application respects platform-specific security policies

Web Security:
• Standard browser security model applies
• Same-origin policy enforced
• CORS restrictions prevent unauthorised cross-origin requests

The absence of device permission requests significantly minimises privacy risks compared to native applications.`,
      recommendations: [
        'Test WebView security on both iOS and Android',
        'Implement certificate transparency monitoring',
        'Add platform-specific security configurations in capacitor.config.ts'
      ]
    },
    {
      title: 'GenAI Transparency & Ethical Use',
      icon: 'logo-electron',
      severity: 'info',
      summary: 'GenAI usage disclosed per SCU Level 2 guidelines. All AI code reviewed by team.',
      content: `Generative AI tools were used during development for:
• Code structure suggestions and debugging assistance
• Documentation drafting and proofreading
• Test case generation and edge case identification

SCU Level 2 GenAI Guidelines Compliance:
• All GenAI usage is openly disclosed in this document
• AI-generated code has been reviewed, tested, and modified by the development team
• The team maintains full responsibility for final code quality and security
• No AI tool was used to generate the final submission without human review

Ethical Considerations:
• AI tools were used as assistive technology, not replacement for learning
• All team members understand the codebase and can explain any component
• Security-sensitive code (API keys, authentication) was written manually`,
      recommendations: [
        'Document specific GenAI tools and versions used',
        'Maintain a log of AI-assisted vs manually written code sections',
        'Include GenAI disclosure statement in README.md'
      ]
    },
    {
      title: 'Security Recommendations Summary',
      icon: 'bulb-outline',
      severity: 'info',
      summary: 'Priority-ranked security improvements for future development cycles.',
      content: `Priority-ranked security improvements for future development:

HIGH PRIORITY:
1. Implement user authentication (OAuth 2.0 / JWT) for API access control
2. Add role-based access control (RBAC) to restrict operations by user type
3. Implement audit logging for all CRUD operations with timestamps

MEDIUM PRIORITY:
4. Add data backup and disaster recovery procedures
5. Implement Content Security Policy with report-only mode
6. Add rate limiting on client-side to complement server-side limits
7. Consider end-to-end encryption for commercially sensitive data

LOW PRIORITY:
8. Conduct regular security penetration testing
9. Implement Subresource Integrity (SRI) for all external resources
10. Add certificate pinning for production API endpoints
11. Implement automated security scanning in CI/CD pipeline

ONGOING:
12. Regular dependency updates to patch known vulnerabilities
13. Security awareness training for all team members
14. Periodic review of privacy policy compliance`
    }
  ];

  /**
   * Get severity color for badge
   */
  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      case 'info': return 'primary';
      default: return 'medium';
    }
  }

  /**
   * Get severity label
   */
  getSeverityLabel(severity: string): string {
    switch (severity) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      case 'info': return 'Info';
      default: return severity;
    }
  }

  /**
   * Toggle section expansion
   */
  toggleSection(index: number): void {
    this.expandedIndex.update(current => current === index ? -1 : index);
  }
}

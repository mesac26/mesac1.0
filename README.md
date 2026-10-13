# MESAC Website

**Mechanical Engineering Students' Association (MESAC)**  
School of Engineering, Cochin University of Science and Technology (CUSAT)

## 1. Project Overview

The MESAC Website project aims to build a professional, responsive website for the Mechanical Engineering Students' Association at CUSAT.

The website provides information about MESAC, its events, student achievements, placements, faculty, academic programs, training activities, and academic resources. It also includes an alumni registration interface.

This project follows the requirements outlined in the **MESAC Website: Requirements and Tech Stack Proposal (October 2026)**.

The current development stage focuses on the public-facing frontend, responsive layouts, reusable UI components, mock data, and frontend interactions. Backend services and database integration remain separate implementation tasks.

## 2. Project Objectives

- Develop a professional website for MESAC.
- Provide an accessible, mobile-first experience.
- Organize information about events, teams, achievements, placements, and academic activities.
- Provide a searchable academic archive interface.
- Include an academic training section and GPA/CGPA calculator.
- Introduce an online alumni registration interface.
- Maintain consistent branding and reusable components.
- Prepare the frontend for future database and backend integration.

## 3. Technology Stack

The project uses the existing frontend architecture.

- **Frontend framework:** React
- **Programming language:** TypeScript
- **Build tool:** Vite
- **Styling:** Existing project CSS and styling utilities
- **UI:** Reusable components and responsive layouts
- **Data:** Structured TypeScript models and mock data
- **Version control:** Git and GitHub

The existing architecture has been retained rather than migrating frameworks during the current frontend development phase.

## 4. Implemented Website Sections

### 4.1 Home

- Homepage hero section and association introduction.
- MESAC branding and navigation.
- Highlights and statistics.
- Featured events and team previews.
- Calls to action linking to relevant website sections.
- Responsive layout for desktop and mobile screens.

### 4.2 Events

- Dedicated Events page.
- Upcoming and past event categories.
- Event search and tag filtering.
- Event cards with available event information.
- Event detail modal.
- Optional registration links and gallery links where available.
- Date-based classification of upcoming and past events.

### 4.3 Gallery

- Gallery album interface.
- Album browsing and category filtering.
- Search functionality.
- Image lightbox with navigation.
- Keyboard controls for image viewing.
- Image download where a valid image URL is available.
- Responsive gallery layout.

### 4.4 Team

- Current committee presentation.
- Academic-year team archive.
- Search and academic-year selection.
- Committee member cards.
- Separation between the current committee and previous committees.

### 4.5 Achievements

- Achievement cards and detail views.
- Category and year filtering.
- Search across available achievement information.
- Structured achievement data.
- Responsive layout.

### 4.6 Placements

- Placement information interface.
- Student and company information presentation.
- Structured placement data and reusable UI components.

### 4.7 Mechanical Department

- Department information section.
- Head of Division information.
- Faculty directory.
- Academic programs.
- Departmental laboratories.
- Structured faculty, program, and laboratory data.

### 4.8 Academy

- Academy training section.
- Six skill-track categories.
- Track search and level filtering.
- Training-track detail views.
- Frontend enrollment form.
- GPA/CGPA calculator with credit-weighted calculation support.
- Multi-semester calculation interface.

The enrollment form is currently a frontend prototype. Actual submission storage and administrator email notifications require backend integration.

### 4.9 Academic Archive

The Archive replaces the old Downloads concept and is intended to help students find academic resources.

Implemented frontend features include:

- Archive browsing interface.
- Department, program, semester, subject, scheme, and document-type filters where available.
- Search by title, subject, code, and tags.
- Document cards and metadata presentation.
- Document preview and download controls where valid links are available.
- Frontend report-a-problem interaction.
- Empty and unavailable states.

The final archive requires integration with the shared MESAC Google Drive, a searchable database index, verified document links, and backend file-management functionality. These services are not considered complete merely because the frontend interface exists.

### 4.10 About MESAC

- Association history and introduction.
- Objectives and activities.
- Links to related MESAC sections.
- Page metadata.

### 4.11 Contact

- Contact information interface.
- Location and map link.
- Contact form with frontend validation.

Actual message storage, spam protection, and administrator email notifications require backend integration.

### 4.12 Privacy Notice

- Dedicated privacy information page.
- Explanation of the prototype's forms and data-handling behavior.
- Information about relevant browser-side behavior and external links.

The notice must be reviewed and updated when production backend services are introduced.

### 4.13 Alumni Registration

- New `/alumni` route.
- Registration form displayed directly on the MESAC website.
- Full name, graduation year, department, email, and phone fields.
- Optional organization and location fields.
- Frontend validation and inline error messages.
- Registration success state on the same page.
- Temporary alumni username generation.
- Copy button for the generated username.
- Registration reset option.
- Alumni navigation link for desktop and mobile.

The generated username is temporary and is not guaranteed to be globally unique. Persistent registration and guaranteed unique usernames require backend implementation.

## 5. Shared UI and Frontend Improvements

- Reusable page layouts and components.
- Shared TypeScript data models.
- Organized mock-data modules.
- Responsive navigation.
- Consistent MESAC visual styling.
- Loading, empty, and unavailable states where implemented.
- Accessible form labels and validation feedback.
- Keyboard support for dialogs and lightboxes.
- Reduced-motion support where implemented.
- Page titles and metadata across implemented routes.

## 6. Data and Content Approach

During frontend development, structured mock data is used to demonstrate the expected presentation and interactions.

Mock data allows the pages and components to be developed before the backend is available.

Existing MESAC information sourced from the previous official website should be preserved when valid. Unverified information, placeholder records, and unavailable document links must be reviewed before production launch.

The final system is intended to retrieve public content from a database rather than depend on hardcoded content.

## 7. Current Development Status

| Feature                                      | Current status                     |
| -------------------------------------------- | ---------------------------------- |
| Home page                                    | Frontend implemented               |
| Events                                       | Frontend implemented               |
| Gallery                                      | Frontend implemented               |
| Team and academic-year archive               | Frontend implemented               |
| Achievements                                 | Frontend implemented               |
| Placements                                   | Frontend implemented               |
| Mechanical Department                        | Frontend implemented               |
| Academy and GPA/CGPA calculator              | Frontend implemented               |
| Academic Archive                             | Frontend interface implemented     |
| About MESAC                                  | Frontend implemented               |
| Contact                                      | Frontend form and page implemented |
| Privacy Notice                               | Frontend implemented               |
| Alumni registration                          | Frontend prototype implemented     |
| Database integration                         | Pending                            |
| Admin authentication                         | Pending                            |
| Admin dashboard and content management       | Pending                            |
| Persistent form submissions                  | Pending                            |
| Email notifications                          | Pending                            |
| Google Drive archive integration             | Pending                            |
| Guaranteed unique alumni usernames           | Pending                            |
| Activity logs and backups                    | Pending                            |
| Production deployment and final verification | Pending                            |

_Status describes the reported implementation stage; individual routes, content, assets, and interactions must still be tested before release._

## 8. Requirements Remaining for the Final System

The requirements document identifies several systems that are outside the current frontend implementation:

- Database-backed content management.
- Private administrator dashboard.
- Approved-administrator authentication.
- Create, edit, and delete operations for website content.
- Persistent enrollment, contact, and alumni registration records.
- Administrator email notifications.
- Google Drive file indexing and management.
- Reliable academic-document previews and downloads.
- Archive health checks and problem reports.
- Activity logs.
- Scheduled backups and data export.
- Production spam protection.
- Production analytics and deployment configuration.
- Final accessibility, mobile performance, and SEO checks.

These are required for the complete system but should not be described as finished backend features.

## 9. Design and Responsiveness

The frontend follows the existing MESAC visual identity, including its current color palette and Garet typography.

Development priorities include:

- Mobile-first layouts.
- Readable typography and consistent spacing.
- Responsive cards, forms, and navigation.
- Appropriate image sizing and aspect ratios.
- Accessible controls and keyboard interactions.
- Restrained animation and reduced-motion support.

The final production pass should also verify the real MESAC logo, image assets, and any remaining layout or scrolling issues across all routes.

## 10. Running the Project Locally

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run the linter:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Use the scripts defined in `package.json` if the project uses different command names.

## 11. Future Development

The next stages are to:

1. Complete the remaining frontend asset and layout corrections.
2. Verify event images, document links, and source-backed content.
3. Connect the public pages to the approved backend and database architecture.
4. Implement administrator authentication and content management.
5. Integrate the academic archive with Google Drive and its searchable index.
6. Connect forms to persistent storage and notification services.
7. Implement backups, export, and activity logging.
8. Perform final accessibility, security, SEO, mobile, and production testing.

## 12. Conclusion

The current MESAC website development establishes the public-facing frontend and its principal sections, including the academic archive interface and alumni registration prototype.

The work prepares the website for the next stage of development while retaining the existing frontend architecture. Backend integration, persistent data management, and production readiness remain separate tasks required to satisfy the complete requirements document.


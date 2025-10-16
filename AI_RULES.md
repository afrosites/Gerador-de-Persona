# AI Rules for Afro Sites Application

This document outlines the technical stack and specific library usage guidelines for the Afro Sites application. Adhering to these rules ensures consistency, maintainability, and efficient development.

## Tech Stack Overview

The Afro Sites application is built using a modern web development stack, focusing on performance, user experience, and AI integration.

*   **Frontend Framework**: React with TypeScript for building dynamic and interactive user interfaces.
*   **Build Tool**: Vite for a fast development experience and optimized production builds.
*   **Styling**: Tailwind CSS for utility-first CSS, enabling rapid and consistent styling across the application.
*   **AI Integration**: Google Gemini API, accessed via the `@google/genai` library, for generating strategic content.
*   **Document Generation (PDF)**: `jspdf` and `html2canvas` for creating downloadable PDF reports directly from the web content.
*   **Document Generation (DOCX)**: `docx` and `FileSaver.js` for generating and saving Microsoft Word (.docx) documents.
*   **File Parsing**: `pdf.js` for extracting text from PDF files and `mammoth.js` for extracting text from DOCX files.
*   **Icons**: `lucide-react` for a consistent and scalable icon set.
*   **UI Components**: `shadcn/ui` for pre-built, accessible, and customizable UI components.

## Library Usage Rules

To maintain a clean and efficient codebase, please follow these guidelines for library usage:

*   **React & TypeScript**: Always use React for component-based UI development and TypeScript for type safety.
*   **Styling with Tailwind CSS**: All styling should be done using Tailwind CSS utility classes. Avoid writing custom CSS unless absolutely necessary for complex, unique scenarios.
*   **AI Services**: Interact with the Google Gemini API exclusively through the `@google/genai` library, as demonstrated in `services/geminiService.ts`.
*   **PDF Generation**: For generating PDF reports, use `jspdf` in conjunction with `html2canvas` to convert HTML content into PDF format.
*   **DOCX Generation**: For generating Microsoft Word (.docx) documents, use the `docx` library. Ensure `FileSaver.js` is used for saving the generated blob.
*   **File Content Parsing**: When importing user files, use `pdf.js` for PDF documents and `mammoth.js` for DOCX documents to extract their text content.
*   **Icons**: Utilize icons from the `lucide-react` library. If a required icon is not available, consider using a generic icon or discussing alternatives.
*   **UI Components**: Leverage `shadcn/ui` components whenever possible for common UI elements (buttons, inputs, cards, etc.). Create new components only if `shadcn/ui` does not offer a suitable option or if significant customization is required beyond what `shadcn/ui` allows.
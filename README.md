# Form Builder

 A small React + Vite form builder. It provides an editor UI for creating form fields and a live preview.

 **Tech stack:** React, TypeScript, Vite, TailwindCSS, custom UI components.

 Quick summary:

- Purpose: Interactive form-builder UI for composing, editing and previewing form fields.
- Contains: field editor, preview, import/export panel, app-level state/context.

 Getting started

- Install dependencies:

   `npm install`

- Run development server:

   `npm run dev`

- Build for production:

   `npm run build`

- Preview production build locally:

   `npm run preview`

 Project structure (key files)

- Source: [src](src)
  - Form builder: [src/components/formBuilder](src/components/formBuilder)
    - [src/components/formBuilder/FieldEditor.tsx](src/components/formBuilder/FieldEditor.tsx) — field editor UI
    - [src/components/formBuilder/FormPreview.tsx](src/components/formBuilder/FormPreview.tsx) — live preview
    - [src/components/formBuilder/ImportExportPanel.tsx](src/components/formBuilder/ImportExportPanel.tsx) — import/export JSON
  - Shared UI: [src/ui](src/ui)
  - State / context: [src/lib/store](src/lib/store)
  - Entry: [src/main.tsx](src/main.tsx) and [src/App.tsx](src/App.tsx)

 Development notes

- The app uses React Context in `src/lib/store` to manage builder state across the editor and preview.
- UI primitives live in `src/ui` for consistent styling and can be reused across components.
- To add a new field type: extend the editor UI in `FieldEditor.tsx`, update the serialisation/export logic, and add render logic in `FormPreview.tsx`.

 Exported form JSON examples

 Below is an example payload the builder can export/import. These are intentionally simple and can be extended with validation, conditional logic, and layout metadata.

 ```json
 {
  "fields": [
    {
      "id": "field_1768322210099_fo040vmct",
      "type": "text",
      "label": "New Text Field",
      "required": true
    },
    {
      "id": "field_1768322210624_york9n2la",
      "type": "number",
      "label": "New Number Field",
      "required": false
    },
    {
      "id": "field_1768322211088_58vvuhjoz",
      "type": "group",
      "label": "New Group",
      "required": false,
      "children": [
        {
          "id": "field_1768322213137_63qqzygn5",
          "type": "text",
          "label": "New Text Field",
          "required": false
        }
      ]
    }
  ]
}
 ```

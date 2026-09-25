# METAPHYSICA

# UI Component Specification

**Document:** `08-ui-component-spec.md`
**Version:** 1.0
**Status:** Specification
**Design Foundation:** Google Material 3
**Implementation Target:** React + TypeScript + MUI

---

# 1. Purpose

This document defines the UI component architecture and behavior of Metaphysica.

It translates the principles defined in:

`07-design-system.md`

into concrete reusable UI components.

This document defines:

* component responsibilities
* component hierarchy
* anatomy
* variants
* states
* interactions
* responsive behavior
* accessibility requirements
* usage rules
* composition rules
* Metaphysica-specific components
* system-specific visualization components

This document does not define:

* page layouts in full
* business logic
* calculation algorithms
* database implementation
* API implementation
* routing architecture

Those concerns belong to the appropriate specifications.

---

# 2. Component Architecture

Metaphysica uses three major component levels.

```text
Material Components
        ↓
Metaphysica Shared Components
        ↓
System-Specific Components
```

Expanded:

```text
UI Component System
│
├── Material / MUI Components
│
├── Shared Metaphysica Components
│   ├── Application Shell
│   ├── Navigation
│   ├── Birth Data
│   ├── Generation
│   ├── Library
│   ├── Profile
│   └── Feedback
│
└── System-Specific Components
    ├── Astrology
    ├── Human Design
    ├── Numerology
    ├── BaZi
    ├── Zi Wei Dou Shu
    └── Tzolkin
```

---

# 3. Component Principles

Every reusable component must satisfy the following principles.

## 3.1 Single Responsibility

A component should have one clear UI responsibility.

Bad:

```text
MetaphysicaPageComponent
├── navigation
├── profile management
├── chart calculation
├── form
├── visualization
└── API calls
```

Preferred:

```text
Page
├── Navigation
├── Feature Component
├── Form Component
└── Visualization Component
```

---

## 3.2 Reusability

A component should be reusable when the same interaction or visual pattern appears in multiple locations.

---

## 3.3 Composition

Prefer composing smaller components rather than creating giant components.

```text
BirthProfileCard
├── ProfileAvatar
├── ProfileIdentity
├── BirthMetadata
└── CardActions
```

---

## 3.4 Design-System Compliance

Components must consume the design system defined in `07-design-system.md`.

They must not introduce arbitrary:

* colors
* spacing
* typography
* shape
* elevation
* interaction patterns

---

# 4. Component Classification

Components are classified into four levels.

```text
Level 0
HTML / Semantic primitives

Level 1
Material / MUI primitives

Level 2
Metaphysica shared components

Level 3
System-specific components
```

---

# 5. Level 0: Semantic Primitives

These include standard semantic elements such as:

```text
main
section
article
header
footer
nav
button
form
label
input
fieldset
legend
```

Semantic HTML should be preferred whenever applicable.

---

# 6. Level 1: Material / MUI Components

The default UI foundation is MUI.

Common components include:

```text
Button
IconButton
TextField
Select
Autocomplete
Checkbox
Radio
Switch
Slider
Card
Dialog
Drawer
Menu
MenuItem
Tabs
Tab
Chip
Tooltip
Snackbar
Alert
Progress
Divider
List
ListItem
Avatar
Badge
Accordion
```

MUI components should be themed through the centralized Metaphysica theme.

---

# 7. Component Creation Rule

Before creating a custom component:

```text
Does MUI already provide the required interaction?
        │
       Yes
        ↓
Use / compose MUI component
        │
       No
        ↓
Create Metaphysica component
```

Do not recreate standard Material interactions unnecessarily.

---

# 8. Application Shell Components

The application shell provides the global interface structure.

Core components:

```text
AppShell
├── AppBar
├── PrimaryNavigation
├── PageContainer
├── MainContent
├── GlobalFeedback
└── ModalLayer
```

---

# 9. App Shell

### Purpose

Provides the persistent structural container for the application.

### Responsibilities

* global theme
* navigation placement
* global content container
* responsive shell behavior
* global feedback layer

### Does not handle

* system calculations
* birth profile logic
* page-specific business logic

---

# 10. App Bar

### Purpose

Provides top-level application identity and contextual controls.

### Anatomy

```text
AppBar
├── Brand
├── Page Context
├── Flexible Space
└── Profile Action
```

### Behavior

Desktop and mobile layouts may differ.

The App Bar must remain visually consistent with Material 3 principles.

---

# 11. Primary Navigation

Primary navigation provides access to major application areas.

Conceptually:

```text
Home
Library
Generate
```

Additional navigation items may be introduced later.

### Rules

* active destination must be visually identifiable
* labels must be clear
* navigation must remain usable on mobile
* navigation state must not depend on page-specific content

---

# 12. Page Container

### Purpose

Controls page-level:

* width
* margins
* responsive padding
* content alignment

### Rules

Pages should not independently recreate global content width rules.

---

# 13. Button

Buttons are based on Material 3 interaction principles.

### Variants

```text
Primary
Secondary
Tertiary
Text
Destructive
```

### Anatomy

```text
Button
├── Optional Icon
├── Label
└── Optional Loading Indicator
```

### States

```text
Default
Hover
Focus
Pressed
Disabled
Loading
```

---

# 14. Button Rules

Primary buttons should represent the main action.

Examples:

```text
Create Profile
Save Profile
Generate Chart
```

Avoid multiple primary buttons competing within one local context.

---

# 15. Icon Button

### Purpose

Compact actions represented primarily by icons.

Examples:

```text
Edit
Delete
Close
More
Back
```

### Requirements

Every icon-only button must have an accessible name.

---

# 16. Floating Action Button

FAB may be used for a high-priority creation action.

Example:

```text
+ Create Birth Profile
```

It should not be used simply because Material provides the component.

---

# 17. Card

Cards group related content.

### Common uses

* Birth Profile
* Library content
* System selection
* summary information
* settings groups

### Anatomy

```text
Card
├── Header
├── Content
├── Supporting Content
└── Actions
```

Not every card requires all sections.

---

# 18. Card Usage Rules

Do not place every UI element inside a card.

Use a card when content needs clear grouping or separation.

Avoid:

```text
Card
  Card
    Card
      Card
```

without structural necessity.

---

# 19. Chip

Chips represent compact:

* categories
* filters
* states
* metadata
* selections

Examples:

```text
Myself
Unknown Time
Astrology
Natal
```

Chips should not replace normal text when the information is not interactive or categorical.

---

# 20. Dialog

Dialogs are used for focused tasks.

Examples:

```text
Create Birth Profile
Edit Birth Profile
Delete Confirmation
Requirement Warning
Focused Configuration
```

### Anatomy

```text
Dialog
├── Title
├── Supporting Text
├── Content
└── Actions
```

---

# 21. Dialog Rules

Dialogs should:

* have clear titles
* preserve user context
* provide explicit actions
* support keyboard navigation
* trap focus appropriately
* close safely

Critical operations should not be dismissed accidentally when doing so could cause data loss.

---

# 22. Bottom Sheet

Bottom sheets may be used on mobile for:

* contextual actions
* filters
* compact configuration
* secondary navigation

They should not replace every dialog.

---

# 23. Menu

Menus provide contextual actions.

Example:

```text
Profile Menu
├── Birth Data
├── Settings
└── Logout
```

Menu items must have concise labels.

---

# 24. Text Field

Text fields are the primary textual input component.

### Anatomy

```text
Text Field
├── Label
├── Input
├── Supporting Text
└── Error Message
```

### States

```text
Default
Focused
Filled
Error
Disabled
Read-only
```

---

# 25. Text Field Rules

Labels must not rely solely on placeholder text.

Supporting text should explain requirements when necessary.

Errors should appear close to the affected field.

---

# 26. Select

Select is used when users choose from a defined set of options.

Examples:

```text
Relationship
Chart Type
Theme
```

For large or searchable datasets, use Autocomplete instead.

---

# 27. Autocomplete

Autocomplete is preferred for searchable entities.

Example:

```text
Birth Place
```

The user should be able to:

```text
Type
→ Search
→ Select
```

The component should clearly distinguish typed text from a selected entity.

---

# 28. Checkbox

Checkboxes represent independent selections.

Example:

```text
☐ Bayu
☐ Person A
☐ Person B
```

Multiple Birth Profiles may therefore be selected when the system supports multiple inputs.

---

# 29. Radio

Radio controls are used when exactly one option should be selected.

Example:

```text
Who is this for?

○ Myself
○ Someone Else
```

---

# 30. Switch

Switches represent persistent binary settings.

Examples:

```text
Dark Mode
Notifications
```

Do not use switches for actions that should be represented by buttons.

---

# 31. Date Picker

Date Picker is used for birth date entry.

Requirements:

* clear date format
* accessible input
* validation
* mobile usability
* keyboard support where applicable

---

# 32. Progress Indicator

Progress indicators communicate processing.

Variants:

```text
Linear
Circular
```

Use:

```text
Linear
→ multi-step processes

Circular
→ localized loading
```

---

# 33. Alert

Alerts communicate important contextual information.

Examples:

```text
Birth time required
Generation failed
System unavailable
```

Alerts should remain visible when the information is important enough that transient feedback is insufficient.

---

# 34. Snackbar

Snackbar communicates lightweight transient feedback.

Examples:

```text
Profile saved.
Settings updated.
```

Do not use snackbar as the only notification for critical errors.

---

# 35. Tooltip

Tooltips explain unfamiliar controls.

They should not be used to hide essential information.

---

# 36. Tabs

Tabs organize closely related content.

Possible uses:

```text
Chart
Interpretation
Details
```

Tabs should not be used to hide unrelated application features.

---

# 37. Accordion

Accordion is useful for progressive disclosure.

Examples:

```text
Interpretation Details
Technical Information
Additional Notes
```

Use it when content can be meaningfully collapsed.

---

# 38. Divider

Dividers provide visual separation.

Use sparingly.

Spacing should normally establish hierarchy before dividers are introduced.

---

# 39. Birth Profile Card

This is a core Metaphysica component.

### Purpose

Represents a saved Birth Profile.

### Anatomy

```text
BirthProfileCard
├── Selection Control
├── Profile Identity
│   └── Name
├── Birth Information
│   ├── Date
│   ├── Time
│   └── Place
├── Relationship
└── Actions
```

---

# 40. Birth Profile Card States

```text
Default
Selected
Hover
Focused
Disabled
```

Selected state must be clearly distinguishable.

---

# 41. Birth Profile Card Actions

Available actions may include:

```text
Select
Edit
Delete
```

Actions should not compete visually with the primary profile information.

---

# 42. Birth Profile Time Display

Known time:

```text
25 Sep 2005 · 14:30
```

Unknown time:

```text
25 Sep 2005 · Birth time unknown
```

Never display unknown time as:

```text
00:00
```

unless midnight was actually entered.

---

# 43. Birth Profile Manager

### Purpose

Manages saved profiles.

### Structure

```text
BirthProfileManager
├── Header
├── Create Action
├── Profile List
├── Selection State
└── Manager Actions
```

Example:

```text
Birth Data                     + Create New

☐ Bayu
  25 Sep 2005 · 14:30
  Kuningan, Indonesia
  Myself

☐ Person A
  12 Mar 2002 · Birth time unknown
  Jakarta, Indonesia
  Someone Else

[Use Selected]
```

---

# 44. Create Birth Profile Wizard

### Purpose

Creates a reusable Birth Profile.

### Steps

```text
Step 1
Birth Date

Step 2
Birth Place

Step 3
Name & Relationship
```

---

# 45. Wizard Header

The wizard header should communicate:

```text
Create Birth Profile
Step X of 3
```

The current step must be visually identifiable.

---

# 46. Birth Date Step

### Components

```text
Date Picker
Birth Time Input
Unknown Time Option
```

### Required behavior

The user must be able to explicitly select:

```text
I don't know my birth time
```

This creates an UNKNOWN state rather than a fake time value.

---

# 47. Birth Place Step

### Components

```text
Autocomplete
Selected Location
Location Metadata
```

The selected location should conceptually contain:

```text
Place Name
Country
Latitude
Longitude
Timezone
```

The user-facing interface does not need to display all technical metadata.

---

# 48. Name & Relationship Step

### Components

```text
Profile Name
Relationship Selection
```

Initial relationship options:

```text
Myself
Someone Else
```

The design must allow future relationship categories.

---

# 49. Wizard Actions

Standard actions:

```text
Back
Continue
Save
Cancel
```

Primary action changes according to step.

Example:

```text
Step 1 → Continue
Step 2 → Continue
Step 3 → Save
```

---

# 50. System Selector

The System Selector allows the user to choose exactly one top-level metaphysical system for a generation operation.

Systems:

```text
Astrology
Human Design
Numerology
BaZi
Zi Wei Dou Shu
Tzolkin
```

---

# 51. System Selector Anatomy

```text
SystemSelector
├── System Header
├── System Options
│   ├── System Icon / Visual
│   ├── System Name
│   └── Description
└── Selection State
```

---

# 52. System Selector Rule

Astrology chart types must not be presented as top-level systems.

Correct:

```text
Astrology
  ↓
Chart Type
```

Incorrect:

```text
Astrology
Natal
Draconic
Solar Return
Human Design
...
```

as one flat system list.

---

# 53. Astrology Chart Selector

The Astrology Chart Selector is displayed after Astrology is selected.

Options may include:

```text
Natal
Draconic
Solar Return
Lunar Return
Progressed
```

Future chart types must be able to appear without changing the selector architecture.

---

# 54. Generation Configuration

System-specific settings are represented by a shared configuration container.

```text
GenerationConfiguration
├── Context
├── System-specific fields
├── Validation
└── Actions
```

The internal fields differ by system.

---

# 55. Generation Status

Generation status communicates processing.

Possible states:

```text
Idle
Validating
Preparing
Calculating
Rendering
Success
Error
```

The user-facing wording may be simplified.

---

# 56. Generation Loading

Loading should explain that the selected system is being processed.

Example:

```text
Generating your Astrology chart...
```

Avoid unnecessarily technical messages such as:

```text
Executing CalculationService.generate()
```

---

# 57. Requirement Warning

Requirement Warning handles missing information.

Example:

```text
Birth time required

Human Design requires a known birth time.

[Edit Birth Data]
[Choose Another Profile]
[Cancel]
```

This component must support system-specific requirements.

---

# 58. Result Header

The Result Header provides context for generated results.

### Anatomy

```text
ResultHeader
├── System
├── Chart Type / Configuration
├── Birth Profile
├── Generation Metadata
└── Actions
```

---

# 59. Result Container

Result Container provides the shared layout around system-specific results.

```text
ResultContainer
├── ResultHeader
├── Visualization
├── Interpretation
└── Supporting Information
```

The actual visualization is injected by the system module.

---

# 60. Interpretation Section

Interpretation content should use standard typography and content hierarchy.

Possible structure:

```text
Interpretation
├── Summary
├── Major Findings
├── Detailed Interpretation
└── Additional Information
```

---

# 61. Library Content Card

### Purpose

Represents educational content.

### Anatomy

```text
LibraryContentCard
├── Category
├── Title
├── Description
├── Metadata
└── Action
```

---

# 62. Library Category Selector

Categories:

```text
Astrology
Human Design
Numerology
BaZi
Zi Wei Dou Shu
Tzolkin
```

Category navigation must remain independent from Birth Data.

---

# 63. Library Article Layout

The article layout should prioritize reading.

```text
Article
├── Category
├── Title
├── Introduction
├── Content Sections
├── Supporting Visuals
└── References / Related Content
```

---

# 64. Profile Menu

Profile Menu provides account-related actions.

Initial structure:

```text
Profile
├── Birth Data
├── Settings
└── Logout
```

The menu should not become a dumping ground for unrelated actions.

---

# 65. Empty State

Shared Empty State component.

### Anatomy

```text
EmptyState
├── Optional Illustration
├── Title
├── Description
└── Primary Action
```

Example:

```text
Birth Data

No birth data yet.

Create a birth profile to use it
for your metaphysical charts.

[Create New]
```

---

# 66. Error State

Shared Error State component.

### Anatomy

```text
ErrorState
├── Error Indicator
├── Title
├── Explanation
└── Recovery Actions
```

Possible actions:

```text
Retry
Edit Data
Go Back
```

---

# 67. Confirmation Dialog

Used for destructive actions.

Example:

```text
Delete Birth Profile?

This profile will no longer be available
for future chart generation.

[Cancel] [Delete]
```

The destructive action must be visually identifiable.

---

# 68. System Visualization Architecture

System visualizations are separate from standard UI components.

```text
System Module
      ↓
Calculated Result
      ↓
Result Mapper / View Model
      ↓
Visualization Component
```

Visualization components must not perform calculation logic.

---

# 69. Astrology Visualization Components

Possible components:

```text
AstrologyChartWheel
PlanetTable
AspectTable
HouseTable
ChartLegend
```

The exact set may expand as the Astrology module develops.

---

# 70. Human Design Visualization

Primary visualization:

```text
HumanDesignBodygraph
```

Supporting components may include:

```text
TypeSummary
AuthoritySummary
ProfileSummary
CenterSummary
ChannelList
GateList
```

---

# 71. Numerology Visualization

Possible components:

```text
NumerologyMatrix
LifePathSummary
CoreNumberList
NumberInterpretation
```

---

# 72. BaZi Visualization

Primary visualization:

```text
BaZiPillars
```

Supporting components may include:

```text
PillarDetail
ElementDistribution
TenGodSummary
LuckCycleSection
```

---

# 73. Zi Wei Dou Shu Visualization

Primary visualization:

```text
ZiWeiPalacesGrid
```

Supporting components may include:

```text
PalaceDetail
StarList
MajorCycleSection
```

---

# 74. Tzolkin Visualization

Possible components:

```text
TzolkinOracle
DaySignDisplay
CalendarCycle
InterpretationPanel
```

---

# 75. System Visualization Rule

System-specific visualizations may use custom visual structures.

However, surrounding controls must still follow the global design system.

```text
Material 3 UI
       +
Custom System Visualization
```

---

# 76. Component State Model

Every interactive component should explicitly consider:

```text
Default
Hover
Focus
Pressed
Selected
Disabled
Loading
Error
Empty
```

Not every component requires every state.

The states relevant to each component must be documented during implementation.

---

# 77. Responsive Component Behavior

Every major shared component must define responsive behavior.

Example:

```text
Desktop
BirthProfileCard
→ horizontal information layout

Mobile
BirthProfileCard
→ stacked information layout
```

Responsive changes must preserve the same information hierarchy.

---

# 78. Mobile Component Rules

Mobile layouts should prioritize:

1. Primary information
2. Primary action
3. Essential metadata
4. Secondary actions

Secondary information may move into:

* menus
* expandable sections
* bottom sheets
* secondary views

---

# 79. Accessibility Requirements

Every reusable component must support appropriate accessibility semantics.

Requirements include:

* accessible name
* keyboard access
* focus visibility
* correct semantic roles
* form labels
* error association
* meaningful status messages
* sufficient contrast

---

# 80. Icon Accessibility

Icon-only actions must have accessible labels.

Example:

```text
Edit Profile
Delete Profile
Close Dialog
Open Profile Menu
```

Icons must never be the only semantic definition of a critical action.

---

# 81. Form Accessibility

Every input must have:

```text
Label
Input
Supporting Text where needed
Error association where needed
```

Required fields must be communicated clearly.

---

# 82. Loading Accessibility

Loading states should communicate status to assistive technologies where appropriate.

The user should not be required to visually monitor an animation to know that processing is occurring.

---

# 83. Component Composition

Components should compose vertically and horizontally without breaking their internal spacing.

Example:

```text
GenerationPage
│
├── PageHeader
├── BirthProfileSelector
├── SystemSelector
├── GenerationConfiguration
└── GenerateButton
```

---

# 84. Shared Component Boundary

A component should become shared when:

* used by multiple features
* has stable responsibility
* has consistent visual behavior
* benefits from centralized maintenance

Do not prematurely convert every small element into a shared component.

---

# 85. Feature Component Boundary

Feature-specific components belong inside their feature.

Example:

```text
features/
└── birth-data/
    ├── BirthProfileManager
    ├── BirthProfileCard
    └── BirthProfileWizard
```

---

# 86. System Component Boundary

System-specific components belong inside the corresponding system module.

Example:

```text
systems/
└── astrology/
    └── visualization/
        └── AstrologyChartWheel
```

They should not be placed in a generic `components/` directory.

---

# 87. Component Naming

Use descriptive names.

Preferred:

```text
BirthProfileCard
SystemSelector
GenerationStatus
AstrologyChartSelector
HumanDesignBodygraph
```

Avoid:

```text
Card1
Box
Thing
Widget
CustomComponent
```

---

# 88. Component API Principle

Reusable components should expose only the inputs and actions they actually need.

Avoid passing entire application state objects into simple components.

Bad:

```text
BirthProfileCard
→ receives entire application state
```

Preferred:

```text
BirthProfileCard
→ receives profile data
→ receives selection state
→ emits/selects actions
```

---

# 89. Business Logic Boundary

UI components must not own complex domain calculations.

Bad:

```text
AstrologyChartWheel
→ calculates planetary positions
```

Preferred:

```text
Calculation Engine
→ calculates planetary positions

Result Mapper
→ prepares visualization data

AstrologyChartWheel
→ renders visualization
```

---

# 90. Data Flow

The general UI data flow is:

```text
Domain / Application
        ↓
View Model / UI Data
        ↓
Component
        ↓
User Interaction
        ↓
Event / Action
        ↓
Application Layer
```

---

# 91. Component and Calculation Separation

The separation must remain strict.

```text
UI
│
├── displays data
├── collects input
└── triggers actions
        ↓
Application
│
├── coordinates workflow
└── validates requirements
        ↓
Domain
│
└── performs system logic
```

---

# 92. MUI Usage Principle

MUI is the implementation foundation for standard Material components.

MUI should be customized through:

* centralized theme
* component variants
* controlled overrides
* reusable wrappers where appropriate

Avoid creating a second component library on top of MUI without a clear reason.

---

# 93. Custom Component Rule

Create a custom component when one or more of the following is true:

1. The interaction is unique to Metaphysica.
2. The component combines multiple Material components into a reusable product pattern.
3. The component represents a metaphysical visualization.
4. The component requires behavior not provided by MUI.
5. Repetition exists across multiple features.

---

# 94. Component Documentation Standard

Every major custom component should document:

```text
Component
Purpose
Anatomy
Props / Inputs
Events
Variants
States
Responsive behavior
Accessibility
Usage rules
Dependencies
```

---

# 95. Component Definition of Done

A reusable component is complete when:

* [ ] purpose is defined
* [ ] anatomy is defined
* [ ] API is defined
* [ ] variants are defined
* [ ] states are defined
* [ ] responsive behavior is defined
* [ ] accessibility behavior is defined
* [ ] design tokens are used
* [ ] business logic is separated
* [ ] component naming is consistent
* [ ] reuse boundary is clear
* [ ] MUI is used where appropriate
* [ ] custom styling is justified

---

# 96. Component Architecture Summary

The complete component architecture is:

```text
                        METAPHYSICA UI
                              │
                ┌─────────────┴─────────────┐
                ↓                           ↓
         Material / MUI              Metaphysica
         Components                  Components
                │                           │
                │                 ┌─────────┴─────────┐
                │                 ↓                   ↓
                │              Shared             System
                │           Components          Components
                │                 │                   │
                └─────────────────┴───────────────────┘
                                  ↓
                                Pages
```

---

# 97. Final Component Model

The final component model follows:

```text
Google Material 3
        ↓
MUI
        ↓
Metaphysica Theme
        ↓
Material Primitives
        ↓
Shared Metaphysica Components
        ↓
System-Specific Components
        ↓
Feature Composition
        ↓
Pages
```

The system must preserve this hierarchy throughout implementation.

---

# 98. Final Principle

Metaphysica should not reinvent standard interface interactions unnecessarily.

Use Material 3 and MUI for established UI patterns.

Build custom components where Metaphysica genuinely requires custom behavior or visualization.

The guiding rule is:

> **Standard interaction, Material foundation. Unique domain, Metaphysica component.**

This allows the product to remain visually coherent while supporting six different metaphysical systems and future expansion.

---

**Next Document:** `09-technical-architecture.md`

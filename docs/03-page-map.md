# Metaphysica

## Page & Surface Map

**Document:** 03-page-map.md
**Version:** 1.0
**Status:** Product Structure Definition

---

# 1. Purpose

This document defines the structural map of the Metaphysica interface.

It identifies:

* primary pages;
* system pages;
* modal surfaces;
* dropdowns;
* overlays;
* nested experiences;
* navigation relationships;
* route responsibilities;
* page boundaries.

This document does not define:

* component implementation;
* folder architecture;
* database schema;
* calculation algorithms;
* detailed visual styling.

Those concerns belong to separate specifications.

---

# 2. Application Structure

Metaphysica should be understood as a small number of primary application areas with layered surfaces.

The conceptual structure is:

```text
METAPHYSICA
│
├── HOME
│
├── LIBRARY
│   ├── System Overview
│   └── Educational Content
│
├── PROFILE
│   ├── Profile Dropdown
│   ├── Birth Data Modal
│   │   ├── Empty State
│   │   ├── Birth Data Collection
│   │   └── Saved Birth Profiles
│   │
│   └── Settings
│
└── GENERATION EXPERIENCE
    │
    ├── Birth Data Selection
    ├── System Selection
    │
    ├── ASTROLOGY
    │   ├── Chart Type Selection
    │   ├── Chart Settings
    │   └── Generated Astrology Experience
    │
    ├── HUMAN DESIGN
    │   └── Generated Human Design Experience
    │
    ├── NUMEROLOGY
    │   └── Generated Numerology Experience
    │
    ├── BAZI
    │   └── Generated BaZi Experience
    │
    ├── ZI WEI DOU SHU
    │   └── Generated Zi Wei Dou Shu Experience
    │
    └── TZOLKIN
        └── Generated Tzolkin Experience
```

---

# 3. Surface Classification

Metaphysica uses four primary types of interface surfaces.

## 3.1 Page

A full navigation-level application surface.

Examples:

```text
Home
Library
Settings
Generated Astrology
Generated Human Design
```

---

## 3.2 Modal

A focused interaction layer displayed above the current page.

Examples:

```text
Birth Data
Create Birth Profile
Edit Birth Profile
System Configuration
```

---

## 3.3 Dropdown / Popover

A compact contextual surface attached to a trigger.

Examples:

```text
Profile Dropdown
Chart Type Selector
User Menu
```

---

## 3.4 Overlay

A temporary application state that covers or interrupts the current experience.

Examples:

```text
Loading
Confirmation
Error
Generation Progress
```

---

# 4. Primary Navigation

The primary navigation should remain intentionally simple.

Initial navigation:

```text
HOME
LIBRARY
PROFILE
```

Profile is represented by a user/profile control rather than necessarily being a standalone page.

The primary navigation should not expose every internal system or feature.

---

# 5. Page Inventory

The initial page inventory is:

| ID                | Surface     | Purpose                             |
| ----------------- | ----------- | ----------------------------------- |
| `home`            | Page        | Introduction and entry point        |
| `library`         | Page        | Educational system exploration      |
| `library-system`  | Page        | Education for one system            |
| `library-content` | Page        | Individual educational content      |
| `settings`        | Page        | Application/account settings        |
| `generation`      | Page/Flow   | Chart generation experience         |
| `astrology`       | System Page | Generated Astrology experience      |
| `human-design`    | System Page | Generated Human Design experience   |
| `numerology`      | System Page | Generated Numerology experience     |
| `bazi`            | System Page | Generated BaZi experience           |
| `zi-wei-dou-shu`  | System Page | Generated Zi Wei Dou Shu experience |
| `tzolkin`         | System Page | Generated Tzolkin experience        |

Not every generation step needs to become a permanent route.

---

# 6. Home Page

## ID

```text
home
```

## Purpose

The Home page is the primary introduction to Metaphysica.

## Responsibilities

The page communicates:

* what Metaphysica is;
* the metaphysical nature of the product;
* the available experience;
* the primary Start action.

## Primary Actions

```text
START
LIBRARY
PROFILE
```

## Home Should Not Contain

The Home page should not become:

* a birth profile dashboard;
* a chart history dashboard;
* a giant system directory;
* a settings page;
* the user's data-management page.

The Home page remains the conceptual front door.

---

# 7. Home → Start

The Start action begins the generation flow.

```text
HOME
  ↓
START
  ↓
GENERATION
```

If the user has no birth profiles:

```text
START
  ↓
Birth Data Modal
  ↓
Create Birth Profile
```

If birth profiles already exist:

```text
START
  ↓
Birth Data Selection
```

---

# 8. Library Page

## ID

```text
library
```

## Purpose

The Library is the educational area of Metaphysica.

It allows users to explore metaphysical systems without necessarily generating a chart.

## Main Content

```text
Library

Astrology
Human Design
Numerology
BaZi
Zi Wei Dou Shu
Tzolkin
```

## Primary Action

Select a system.

```text
Library
  ↓
System
```

---

# 9. Library System Page

## ID

```text
library-system
```

## Purpose

Displays educational information belonging to one metaphysical system.

Example:

```text
Library
  ↓
Astrology
```

The page may contain:

```text
System Introduction
Fundamentals
Terminology
Concepts
Articles
Guides
```

The exact structure may differ by system.

---

# 10. Library Content Page

## ID

```text
library-content
```

## Purpose

Displays one educational resource.

Example:

```text
Library
  ↓
Astrology
  ↓
What is a Natal Chart?
```

The content page should focus on education and should not automatically trigger chart generation.

A contextual CTA may optionally direct the user toward the generation experience.

---

# 11. Profile Surface

The profile control is a global interface element.

Clicking it opens:

```text
PROFILE DROPDOWN
```

Conceptually:

```text
┌─────────────────────────┐
│ User                    │
│                         │
│ Birth Data              │
│ Settings                │
│ Logout                  │
└─────────────────────────┘
```

This is a dropdown/popover, not necessarily a standalone page.

---

# 12. Profile → Birth Data

Selecting:

```text
Birth Data
```

opens the Birth Data modal.

Flow:

```text
PROFILE
  ↓
PROFILE DROPDOWN
  ↓
BIRTH DATA
  ↓
BIRTH DATA MODAL
```

The user remains on the current underlying page.

---

# 13. Birth Data Modal

## Surface Type

```text
Modal
```

## Purpose

Provides access to the user's reusable birth profiles.

This is intentionally a modal-based experience.

It should not initially become a full page.

---

# 14. Birth Data Modal: Empty State

If the user has no profiles:

```text
┌──────────────────────────────────┐
│ Birth Data                    X  │
│                                  │
│        No birth data yet.        │
│                                  │
│ Create a birth profile to use    │
│ it for your metaphysical charts. │
│                                  │
│       [ + Create New ]           │
│                                  │
└──────────────────────────────────┘
```

---

# 15. Birth Data Modal: Collection State

If saved profiles exist:

```text
┌──────────────────────────────────┐
│ Birth Data                    X  │
│                                  │
│                         + Create  │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ Bayu                         │ │
│ │ 25 Sep 2005 · 14:30          │ │
│ │ Kuningan, Indonesia          │ │
│ │ Myself                       │ │
│ └──────────────────────────────┘ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ Person A                     │ │
│ │ 12 Mar 2002 · Unknown        │ │
│ │ Jakarta, Indonesia           │ │
│ │ Someone Else                 │ │
│ └──────────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
```

The visual design may change, but the surface remains a modal.

---

# 16. Create Birth Profile Surface

Selecting:

```text
Create New
```

opens the birth profile creation wizard.

This can either:

1. replace the current Birth Data modal content; or
2. open a nested modal state.

The preferred conceptual model is:

```text
Birth Data Modal
      ↓
Create Profile Mode
```

rather than stacking many independent modal layers.

---

# 17. Birth Profile Wizard

The wizard contains three steps.

```text
CREATE PROFILE

Step 1
Birth Date

Step 2
Birth Place

Step 3
Name & Identity
```

The wizard remains within the modal experience.

---

# 18. Birth Profile Step 1

Surface:

```text
Birth Data Modal
  ↓
Create Profile
  ↓
Step 1
```

Fields:

```text
Date of Birth
Time of Birth
Unknown Birth Time
```

Actions:

```text
Cancel
Next
```

---

# 19. Birth Profile Step 2

Surface:

```text
Create Profile
  ↓
Step 2
```

Primary field:

```text
Birth Place
```

The location selector may open an internal search/popover for selecting the birth location.

Actions:

```text
Back
Next
Cancel
```

---

# 20. Birth Profile Step 3

Surface:

```text
Create Profile
  ↓
Step 3
```

Fields:

```text
Profile Name
Who is this for?
```

Actions:

```text
Back
Save
Cancel
```

---

# 21. Birth Profile Save State

After Save:

```text
Step 3
  ↓
Saving
  ↓
Saved
  ↓
Birth Data Collection
```

The newly created profile appears in the Birth Data collection.

---

# 22. Birth Profile Edit Surface

Editing an existing profile reuses the same wizard structure.

```text
Birth Data
  ↓
Select Profile
  ↓
Edit
  ↓
Birth Profile Wizard
```

The fields are pre-populated.

The user can move between all three steps.

---

# 23. Birth Profile Delete Confirmation

Deleting a profile opens a confirmation overlay.

```text
Birth Data Modal
      ↓
Delete
      ↓
Confirmation
```

Example:

```text
Delete Birth Profile?

Are you sure you want to delete
this birth profile?

[Cancel] [Delete]
```

---

# 24. Generation Experience

The generation experience is the main functional journey.

Conceptually:

```text
HOME
  ↓
START
  ↓
BIRTH DATA
  ↓
SELECT PROFILE
  ↓
SELECT SYSTEM
  ↓
SYSTEM CONFIGURATION
  ↓
GENERATE
  ↓
RESULT
```

---

# 25. Generation Page / Flow

The generation experience does not necessarily require every step to have a separate route.

The conceptual states are:

```text
generation.birth-data
generation.system-selection
generation.configuration
generation.loading
generation.success
generation.error
```

These can be implemented as route states, page states, or nested views depending on the final technical architecture.

The important requirement is that they behave as one coherent generation flow.

---

# 26. Generation: Birth Data Selection

Surface:

```text
generation.birth-data
```

Purpose:

Allow the user to choose saved birth profiles.

Example:

```text
Choose Birth Data

☐ Bayu
☐ Person A
☐ Person B

[Continue]
```

---

# 27. Generation: System Selection

Surface:

```text
generation.system-selection
```

Available systems:

```text
Astrology
Human Design
Numerology
BaZi
Zi Wei Dou Shu
Tzolkin
```

Only one top-level system can be selected.

---

# 28. Generation: System Configuration

After selecting a system, the generation experience enters system-specific configuration.

General model:

```text
System Selection
      ↓
System Configuration
```

Astrology:

```text
Astrology
  ↓
Chart Type
  ↓
Chart Settings
```

Other systems:

```text
Human Design
  ↓
Human Design Settings
```

```text
Numerology
  ↓
Numerology Settings
```

etc.

---

# 29. Astrology System Page

## ID

```text
astrology
```

This is a generated-system experience, not the educational Astrology Library page.

Important distinction:

```text
/library/astrology
```

means:

> Learn about Astrology.

Whereas:

```text
/astrology
```

means:

> Explore a generated Astrology experience.

The exact final route syntax may be determined by the technical architecture.

---

# 30. Astrology Chart Selection

Astrology has an additional internal surface:

```text
Astrology
  ↓
Chart Type
```

Initial chart types:

```text
Natal Chart
Draconic Chart
Solar Return
Lunar Return
Progressed Chart
```

The chart selector should be capable of displaying future chart modules.

---

# 31. Astrology Chart Result

After selecting and generating a chart:

```text
Astrology
  ↓
Selected Chart
  ↓
Generated Chart Result
```

Example:

```text
ASTROLOGY

Natal Chart

[Chart Visualization]

Chart Information
Planets
Houses
Aspects
Interpretation
Settings
```

The exact content belongs to the Astrology-specific specification.

---

# 32. Astrology Additional Chart Navigation

Once inside Astrology, the user may have access to other available chart types.

Example:

```text
ASTROLOGY

Natal
Draconic
Solar Return
Lunar Return
Progressed
```

Selecting another chart type should reuse the Astrology system context.

It should not behave as though the user has left Astrology and entered an unrelated system.

---

# 33. Human Design System Page

## ID

```text
human-design
```

Purpose:

Display the generated Human Design experience.

Conceptually:

```text
Human Design
  ↓
Chart
  ↓
System Data
  ↓
Interpretation
```

The page may have its own specialized navigation and visualization.

---

# 34. Numerology System Page

## ID

```text
numerology
```

Purpose:

Display the generated Numerology experience.

The structure is defined by Numerology-specific requirements.

---

# 35. BaZi System Page

## ID

```text
bazi
```

Purpose:

Display the generated BaZi experience.

The structure is defined by BaZi-specific requirements.

---

# 36. Zi Wei Dou Shu System Page

## ID

```text
zi-wei-dou-shu
```

Purpose:

Display the generated Zi Wei Dou Shu experience.

The structure is defined by Zi Wei Dou Shu-specific requirements.

---

# 37. Tzolkin System Page

## ID

```text
tzolkin
```

Purpose:

Display the generated Tzolkin experience.

The structure is defined by Tzolkin-specific requirements.

---

# 38. Settings Page

## ID

```text
settings
```

Settings are accessed through:

```text
Profile
  ↓
Settings
```

The settings page is separate from Birth Data.

Birth Data should not be mixed into general application settings.

Potential settings categories may include:

```text
Account
Appearance
Preferences
Privacy
Application
```

The exact settings list is not finalized by this document.

---

# 39. Loading Surface

Generation loading is an overlay/state rather than a separate destination page.

Conceptually:

```text
Current Generation Context
        ↓
Loading Overlay
```

Example:

```text
┌──────────────────────────────────┐
│                                  │
│          Calculating...          │
│                                  │
│      Preparing your chart        │
│                                  │
└──────────────────────────────────┘
```

The loading state should prevent conflicting actions while calculation is occurring.

---

# 40. Error Surface

Generation errors are displayed within the relevant generation context.

Example:

```text
Generation
  ↓
Error
```

The user should receive:

* what failed;
* why it failed if known;
* what action can resolve it.

Possible actions:

```text
Edit Birth Data
Change Configuration
Try Again
Go Back
```

---

# 41. Confirmation Surfaces

Confirmation overlays are used for destructive or consequential actions.

Initial examples:

```text
Delete Birth Profile
Discard Unsaved Changes
```

They should remain lightweight and contextual.

---

# 42. Route Concept

The initial route map may conceptually be:

```text
/
├── home
│
├── library
│   ├── :system
│   └── :system/:content
│
├── settings
│
├── generation
│   ├── birth-data
│   ├── system
│   └── ...
│
├── astrology
│   └── ...
│
├── human-design
│   └── ...
│
├── numerology
│   └── ...
│
├── bazi
│   └── ...
│
├── zi-wei-dou-shu
│   └── ...
│
└── tzolkin
    └── ...
```

This is a conceptual route map.

The final technical routing structure must be defined separately.

---

# 43. Modal Map

The initial modal inventory is:

```text
MODALS
│
├── Birth Data
│   ├── Empty
│   ├── Collection
│   ├── Create Profile
│   │   ├── Step 1
│   │   ├── Step 2
│   │   └── Step 3
│   ├── Edit Profile
│   └── Delete Confirmation
│
└── Future Modals
```

---

# 44. Dropdown Map

Initial dropdown/popover surfaces:

```text
DROPDOWNS
│
├── Profile Dropdown
│   ├── Birth Data
│   ├── Settings
│   └── Logout
│
├── Location Selector
│
└── Future Contextual Selectors
```

Astrology chart selection may be represented as a dropdown, segmented navigation, cards, tabs, or another suitable UI pattern depending on the final design.

The product requirement is the ability to select a chart type, not a specific UI primitive.

---

# 45. Surface Relationship

The application should follow this hierarchy:

```text
PAGE
 │
 ├── NAVIGATION
 │
 ├── CONTENT
 │
 ├── DROPDOWN / POPOVER
 │
 ├── MODAL
 │      │
 │      └── FORM / WIZARD
 │
 └── OVERLAY
```

A modal should not become a substitute for every page.

A page should not be created merely because a modal contains multiple steps.

---

# 46. Important Separation

The following must remain distinct:

```text
Library Astrology
```

and:

```text
Generated Astrology
```

They represent different user intentions.

### Library Astrology

```text
I want to learn about Astrology.
```

### Generated Astrology

```text
I want to explore my generated Astrology result.
```

The same principle applies to all six systems.

---

# 47. Birth Data Is Not a Page

Birth Data is currently defined as:

```text
Profile
  ↓
Birth Data Modal
```

It should not automatically become:

```text
/birth-data
```

unless future product requirements demonstrate that the modal experience is no longer sufficient.

The current product direction intentionally keeps Birth Data lightweight and contextual.

---

# 48. Generation Is Not the Same as Library

The two flows are independent.

```text
LIBRARY
  ↓
Learn
```

versus:

```text
GENERATION
  ↓
Calculate
  ↓
Explore Result
```

A user may move from Library to Generation through a contextual CTA, but the two areas should remain conceptually separate.

---

# 49. Full Surface Map

The complete initial surface architecture is:

```text
METAPHYSICA
│
├── HOME
│
├── LIBRARY
│   │
│   ├── Astrology
│   │   └── Educational Content
│   │
│   ├── Human Design
│   │   └── Educational Content
│   │
│   ├── Numerology
│   │   └── Educational Content
│   │
│   ├── BaZi
│   │   └── Educational Content
│   │
│   ├── Zi Wei Dou Shu
│   │   └── Educational Content
│   │
│   └── Tzolkin
│       └── Educational Content
│
├── PROFILE
│   │
│   └── DROPDOWN
│       │
│       ├── BIRTH DATA
│       │   │
│       │   └── MODAL
│       │       ├── Empty
│       │       ├── Profiles
│       │       ├── Create
│       │       │   ├── Step 1
│       │       │   ├── Step 2
│       │       │   └── Step 3
│       │       ├── Edit
│       │       └── Delete Confirmation
│       │
│       ├── SETTINGS
│       └── LOGOUT
│
└── GENERATION
    │
    ├── Birth Data Selection
    │
    ├── System Selection
    │
    ├── ASTROLOGY
    │   ├── Chart Type
    │   ├── Chart Settings
    │   └── Generated Result
    │
    ├── HUMAN DESIGN
    │   └── Generated Result
    │
    ├── NUMEROLOGY
    │   └── Generated Result
    │
    ├── BAZI
    │   └── Generated Result
    │
    ├── ZI WEI DOU SHU
    │   └── Generated Result
    │
    └── TZOLKIN
        └── Generated Result
```

---

# 50. Navigation Principles

## Principle 1

Keep primary navigation small.

## Principle 2

Do not turn every feature into a page.

## Principle 3

Use modals for contextual data management.

## Principle 4

Birth Data remains a modal-based experience.

## Principle 5

Library and generated systems are separate experiences.

## Principle 6

Astrology chart types belong inside Astrology.

## Principle 7

System-specific experiences may have different internal structures.

## Principle 8

Do not force all six systems into identical page layouts.

## Principle 9

Future system expansion must not require redesigning global navigation.

## Principle 10

Future Astrology chart expansion must not require redesigning the Astrology container.

---

# 51. Final Structural Model

The simplest representation of the application is:

```text
                         METAPHYSICA
                              │
              ┌───────────────┼───────────────┐
              │               │               │
            HOME           LIBRARY          PROFILE
              │               │               │
              │               │         Profile Dropdown
              │               │               │
              │               │       ┌───────┴───────┐
              │               │       │               │
              │               │   Birth Data       Settings
              │               │       │
              │               │     Modal
              │               │
              │               │
              └───────────────┴───────────────┐
                                              │
                                       GENERATION
                                              │
                                      Select Birth Data
                                              │
                                      Select System
                                              │
                         ┌────────────────────┼────────────────────┐
                         │                    │                    │
                     Astrology          Human Design          Other Systems
                         │
                    Chart Type
                         │
                  Chart Settings
                         │
                      Result
```

The architecture should preserve this distinction:

```text
GLOBAL
│
├── Home
├── Library
├── Profile
│
└── Generation Framework
      │
      └── Systems
```

The system-specific experiences then live inside the generation framework without taking over the global product structure.

---

# 52. Final Rule

The page map defines **where an experience lives**.

It does not dictate exactly how that experience must look.

Visual design, component composition, responsive behavior, typography, spacing, animation, and interaction styling must be defined in the Design System and UI Component specifications.

The purpose of this document is to prevent structural confusion between:

```text
PAGE
MODAL
DROPDOWN
OVERLAY
SYSTEM
CHART TYPE
LIBRARY CONTENT
```

Every future feature should be classified into one of these categories before implementation.

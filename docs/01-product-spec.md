# Metaphysica

## Product Specification

**Document:** 01-product-spec.md
**Version:** 1.0
**Status:** Product Definition

---

# 1. Product Overview

## 1.1 Product Name

**Metaphysica**

## 1.2 Product Type

Metaphysica is a web-based metaphysical exploration platform that brings multiple metaphysical systems into one unified experience.

The platform allows users to:

* explore educational material about different metaphysical systems;
* create and store birth profiles;
* store their own birth data as well as data belonging to other people;
* select one or more saved birth profiles;
* choose a metaphysical system;
* generate a chart or system-specific result;
* explore the generated result inside the corresponding system experience.

The platform separates **birth data**, **metaphysical systems**, and **generated results** so that the same birth profile can be reused across multiple systems.

---

# 2. Product Vision

Metaphysica aims to create a unified environment for exploring different metaphysical systems without forcing each system to become a separate application.

The core idea is:

> **Different systems, one platform.**

The user should be able to move between systems while maintaining a consistent experience, while each system remains free to have its own calculation logic, terminology, visualization, and additional features.

---

# 3. Core Product Concept

Metaphysica is built around three major concepts:

```text
USER
  │
  ├── Birth Data
  │      │
  │      └── Reusable across systems
  │
  ├── Library
  │      │
  │      └── Educational knowledge
  │
  └── Chart Generation
         │
         └── Metaphysical System
                │
                └── System-specific chart/result
```

These concepts must remain separated.

## 3.1 Birth Data

Birth data represents a person and their birth information.

A user may create multiple birth profiles.

Examples:

* themselves;
* partner;
* family member;
* friend;
* another person.

Birth data is stored independently from any particular metaphysical system.

A saved birth profile must be reusable for different systems.

---

## 3.2 Library

The Library is the educational section of Metaphysica.

It is **not** the user's birth-data storage.

The Library contains information and educational material about the available metaphysical systems.

The initial systems are:

1. Astrology
2. Human Design
3. Numerology
4. BaZi
5. Zi Wei Dou Shu
6. Tzolkin

Each system may contain its own educational structure and content.

---

## 3.3 Chart Generation

Chart generation transforms saved birth data into a result according to a selected metaphysical system.

The user selects:

1. birth profile(s);
2. one metaphysical system;
3. system-specific options if applicable.

The system validates whether the selected birth data satisfies the requirements of the selected system before generation.

---

# 4. Product Principles

## 4.1 Birth Data Is System-Agnostic

Birth data must not belong exclusively to Astrology, Human Design, BaZi, or another system.

Example:

```text
Bayu
25 September 2005
Kuningan, Indonesia
14:30
```

This profile may later be used for:

```text
Astrology
Human Design
BaZi
Zi Wei Dou Shu
Numerology
Tzolkin
```

depending on the requirements of each system.

---

## 4.2 Unknown Birth Time Is Valid Data

A user may not know their exact birth time.

Unknown birth time must be represented explicitly.

Unknown birth time must **never** automatically become `00:00`.

Conceptually:

```text
birthTime = unknown
```

rather than:

```text
birthTime = 00:00
```

Each metaphysical system determines whether an unknown birth time can be used.

For example, Human Design requires a known birth time and therefore should prevent generation when the required birth time is unavailable.

Other systems may permit generation without a known birth time depending on their implemented calculation method.

---

## 4.3 System Requirements Are System-Specific

The platform must not assume that every metaphysical system requires the same information.

Each system defines its own requirements.

Examples of possible requirements include:

* birth date;
* birth time;
* birth place;
* geographic coordinates;
* timezone;
* target date;
* target year;
* other system-specific parameters.

The generation flow must validate these requirements before calculation.

---

## 4.4 One Generation Uses One Top-Level System

A generation request may select multiple birth profiles, but it must select **exactly one top-level metaphysical system**.

Valid:

```text
Bayu + Person A
        ↓
Astrology
```

Invalid:

```text
Bayu
 ↓
Astrology + Human Design + BaZi
```

If a user wants multiple systems, they generate them as separate operations.

---

# 5. Top-Level Metaphysical Systems

Metaphysica initially supports six top-level systems.

## 5.1 Astrology

Astrology is an extensible system containing multiple chart types.

Initial chart types may include:

* Natal Chart
* Draconic Chart
* Solar Return
* Lunar Return
* Progressed Chart

Additional Astrology chart types may be added in the future.

Astrology chart types are **not separate top-level systems**.

The hierarchy is:

```text
Astrology
│
├── Natal Chart
├── Draconic Chart
├── Solar Return
├── Lunar Return
├── Progressed Chart
└── Future Chart Types
```

The architecture must allow new Astrology chart types to be added without redesigning the core Metaphysica platform.

---

## 5.2 Human Design

Human Design is a top-level metaphysical system.

The initial implementation focuses on its primary chart/result experience.

Human Design requires a known birth time for generation.

---

## 5.3 Numerology

Numerology is a top-level metaphysical system.

Its calculation requirements and result structure are defined independently from other systems.

---

## 5.4 BaZi

BaZi is a top-level metaphysical system.

Its calculation requirements and result structure are defined independently from other systems.

---

## 5.5 Zi Wei Dou Shu

Zi Wei Dou Shu is a top-level metaphysical system.

Its calculation requirements and result structure are defined independently from other systems.

---

## 5.6 Tzolkin

Tzolkin is a top-level metaphysical system.

Its calculation requirements and result structure are defined independently from other systems.

---

# 6. Main Product Areas

Metaphysica consists of the following major areas:

```text
Home
Library
Profile
Birth Data
Chart Generation
Generated System Experience
```

---

# 7. Home

## 7.1 Purpose

Home is the primary introduction to Metaphysica.

It should feel like an entry point into the world of metaphysical systems rather than a conventional application dashboard.

## 7.2 Home Responsibilities

Home should:

* introduce Metaphysica;
* establish the visual identity;
* communicate the concept of multiple metaphysical systems;
* provide a clear entry point into the experience;
* allow users to start creating or exploring their experience.

## 7.3 Home Should Not Become

Home should not become a large dashboard containing:

* birth profile lists;
* every generated chart;
* extensive system settings;
* educational article lists;
* complex account management.

The primary role of Home is introduction and entry.

---

# 8. Library

## 8.1 Purpose

Library is the educational knowledge area of Metaphysica.

It allows users to learn about the available metaphysical systems before or after generating a result.

## 8.2 Initial Library Categories

```text
Library
│
├── Astrology
├── Human Design
├── Numerology
├── BaZi
├── Zi Wei Dou Shu
└── Tzolkin
```

## 8.3 Educational Content

Each system may eventually contain:

* Introduction
* Fundamentals
* Terminology
* Components
* Methodology
* Interpretation concepts
* Educational articles
* Guides
* References

The content structure may differ between systems.

The Library must therefore support system-specific educational structures rather than forcing every system into an identical article template.

---

# 9. Profile

## 9.1 Purpose

The Profile area provides access to personal account-related functionality.

Clicking the profile control opens a dropdown or popover.

Initial options:

```text
Profile
├── Birth Data
├── Settings
└── Logout
```

Additional profile functions may be added later.

---

# 10. Birth Data

## 10.1 Purpose

Birth Data is the user's personal collection of reusable birth profiles.

It is accessed through:

```text
Profile
  ↓
Birth Data
```

Birth Data should not become a standalone top-level navigation item unless explicitly required later.

---

# 11. Birth Data Modal

Birth Data is managed through a modal-based experience.

When the user has no saved birth profiles, the modal displays an empty state.

Example conceptual state:

```text
Birth Data

No birth data yet.

Create a birth profile to use it
for your metaphysical charts.

[ + Create New ]
```

The modal should not immediately redirect the user to a separate full page.

---

# 12. Create Birth Profile

Creating a birth profile uses a multi-step modal wizard.

Initial structure:

```text
Step 1
Birth Date

        ↓

Step 2
Birth Place

        ↓

Step 3
Name & Identity

        ↓

Save
```

---

## 12.1 Step 1: Birth Date

The user enters:

* Date of birth
* Time of birth

Birth time is optional at the profile level.

The user must be able to explicitly indicate that they do not know their birth time.

Conceptually:

```text
Date of Birth *
[ DD / MM / YYYY ]

Time of Birth
[ HH : MM ]

[ ] I don't know my birth time
```

---

## 12.2 Step 2: Birth Place

The user enters or searches for the place of birth.

The system should be able to associate the selected place with relevant geographic information required by future calculations.

Potential data includes:

* place name;
* country;
* latitude;
* longitude;
* timezone.

The user experience should prioritize selecting a meaningful location rather than manually entering technical geographic values.

---

## 12.3 Step 3: Name & Identity

The user gives the saved profile a name.

Example:

```text
Profile Name
Bayu

Who is this for?

[ Myself ]
[ Someone Else ]
```

The exact relationship categories may expand later.

Possible examples:

* Myself
* Family
* Partner
* Friend
* Other

This information helps users distinguish multiple saved birth profiles.

---

# 13. Saved Birth Data

After saving, the profile is stored under the user's Birth Data.

The Birth Data modal changes from an empty state into a collection of saved profiles.

Example:

```text
Birth Data

                         [ + Create New ]

Bayu
25 Sep 2005 · 14:30
Kuningan, Indonesia
Myself

Person A
12 Mar 2002 · Unknown
Jakarta, Indonesia
Someone Else

Person B
08 Jun 1998 · 09:15
Bandung, Indonesia
Someone Else
```

The user should be able to:

* create new profiles;
* select profiles;
* edit profiles;
* delete profiles;
* use selected profiles for chart generation.

---

# 14. Birth Profile Selection

The user may select one or multiple saved birth profiles.

Example:

```text
☑ Bayu
☑ Person A
☐ Person B
```

The number of selectable profiles depends on the requirements of the selected system and future comparison features.

The platform should not assume that every system supports multiple profiles in every operation.

System-specific validation determines whether the selected combination is valid.

---

# 15. Chart Generation Flow

The standard generation flow is:

```text
Birth Data
    ↓
Select Profile(s)
    ↓
Select Metaphysical System
    ↓
System Validation
    ↓
System-specific Options
    ↓
Generate
    ↓
Loading / Calculation
    ↓
Generated Result
```

---

# 16. System Selection

After selecting birth data, the user chooses one top-level system.

Available systems:

```text
Astrology
Human Design
Numerology
BaZi
Zi Wei Dou Shu
Tzolkin
```

Only one top-level system can be selected per generation operation.

---

# 17. Astrology Generation

Astrology has an additional selection layer.

The flow is:

```text
Select Birth Data
        ↓
Astrology
        ↓
Select Astrology Chart Type
        ↓
Chart-specific Settings
        ↓
Generate
```

Initial Astrology chart types:

```text
Natal Chart
Draconic Chart
Solar Return
Lunar Return
Progressed Chart
```

The list must be extensible.

Future chart types must be addable without rewriting the main Astrology page or the global generation architecture.

---

# 18. Astrology Chart Modules

Each Astrology chart type should behave as an independent chart module.

Conceptually:

```text
Astrology
│
├── Natal
│
├── Draconic
│
├── Solar Return
│
├── Lunar Return
│
├── Progressed
│
└── Future Modules
```

Each chart module may define:

* its own requirements;
* its own input settings;
* its own calculation process;
* its own result structure;
* its own visualization;
* its own interpretation sections.

The platform should provide a common framework while allowing individual chart types to remain specialized.

---

# 19. Generated System Experience

After generation, the user enters the experience corresponding to the selected system.

For example:

```text
Generate
   ↓
Astrology
   ↓
Natal Chart
   ↓
Astrology Experience
```

The generated system page should provide access to system-specific functionality.

For Astrology, this may include:

* chart visualization;
* chart information;
* planets;
* houses;
* aspects;
* interpretations;
* chart settings;
* switching between supported chart types;
* future Astrology tools.

Other systems may have entirely different result structures.

The platform must not force all systems into the exact same visualization.

---

# 20. System-Specific Extensibility

The core platform must be extensible.

Adding a new system should not require rebuilding:

* Home;
* Profile;
* Birth Data;
* authentication;
* global navigation;
* core data storage;
* general generation flow.

Adding a new Astrology chart should similarly not require rebuilding the Astrology system itself.

The intended architecture is:

```text
Core Platform
│
├── User
├── Birth Data
├── Library
├── Generation Framework
│
└── Systems
    │
    ├── Astrology
    │    └── Chart Modules
    │
    ├── Human Design
    ├── Numerology
    ├── BaZi
    ├── Zi Wei Dou Shu
    └── Tzolkin
```

---

# 21. Separation of Concerns

The following concepts must remain separate:

## User

The authenticated account.

## Birth Profile

Information describing a person and their birth.

## Metaphysical System

A top-level system such as Astrology or Human Design.

## Chart Type

A system-specific mode such as Natal Chart or Solar Return.

## Calculation

The logic that transforms valid inputs into a result.

## Generated Result

The output produced by a calculation.

## Library Content

Educational information about a system.

These concepts should not be merged into a single generic object or workflow.

---

# 22. Core User Journey

The primary experience can be summarized as:

```text
                     HOME
                       │
                    START
                       │
                       ↓
              CREATE BIRTH DATA
                       │
             ┌─────────┴─────────┐
             │                   │
          Existing             New
          Profile              Profile
             │                   │
             └─────────┬─────────┘
                       ↓
                 SELECT DATA
                       │
                       ↓
              SELECT SYSTEM
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
    Astrology      Human Design    Other Systems
        │
        ↓
   SELECT CHART
        │
        ↓
     SETTINGS
        │
        ↓
     GENERATE
        │
        ↓
    RESULT PAGE
```

The user can also enter the educational experience independently:

```text
HOME
  ↓
LIBRARY
  ↓
SELECT SYSTEM
  ↓
LEARN
```

And manage saved profiles independently:

```text
PROFILE
  ↓
BIRTH DATA
  ↓
MANAGE PROFILES
```

---

# 23. Product Boundaries

## In Scope

* Metaphysical system education
* User profile
* Birth profile management
* Multiple birth profiles
* Optional/unknown birth time
* Birth place information
* System selection
* System requirement validation
* Chart generation framework
* Astrology chart extensibility
* System-specific result experiences

## Initially Out of Scope

The following are not required in the initial product definition unless separately specified:

* Social networking
* Public user profiles
* Community feeds
* Messaging
* Marketplace
* Paid consultations
* Human astrologer booking
* Public chart sharing
* Social following system
* Community comments

These may be considered as future product capabilities but should not influence the initial architecture unnecessarily.

---

# 24. Initial System Registry

The initial top-level registry is:

```text
ASTROLOGY
HUMAN DESIGN
NUMEROLOGY
BAZI
ZI WEI DOU SHU
TZOLKIN
```

Astrology contains an extensible chart registry:

```text
ASTROLOGY
├── NATAL
├── DRACONIC
├── SOLAR RETURN
├── LUNAR RETURN
├── PROGRESSED
└── FUTURE
```

The architecture must treat the Astrology chart registry as dynamic/extensible rather than assuming this initial list will never change.

---

# 25. Success Criteria

The product architecture and user experience should make the following possible:

1. A user can enter the platform and immediately understand what Metaphysica is.
2. A user can create a birth profile through a simple modal wizard.
3. A user can save multiple people under Birth Data.
4. A user can explicitly store an unknown birth time.
5. A user can reuse one birth profile across multiple systems.
6. A system can reject insufficient birth data with a clear explanation.
7. A user can learn about a system through Library without generating a chart.
8. A user can select exactly one top-level system for a generation operation.
9. Astrology can provide multiple chart types.
10. New Astrology chart types can be added without restructuring the core platform.
11. New top-level metaphysical systems can be added without restructuring the user's Birth Data system.
12. Each metaphysical system can maintain its own calculation and result experience.
13. The interface remains consistent while allowing system-specific functionality.

---

# 26. Fundamental Product Model

The fundamental model of Metaphysica is:

```text
                    METAPHYSICA
                         │
        ┌────────────────┼────────────────┐
        │                │                │
       HOME           LIBRARY          PROFILE
        │                │                │
     Discover         Learn          Birth Data
                                         │
                                         ↓
                                Birth Profiles
                                         │
                                         ↓
                                Select Profile(s)
                                         │
                                         ↓
                                Select System
                                         │
                  ┌──────────────────────┼──────────────────────┐
                  │                      │                      │
              Astrology            Human Design          Other Systems
                  │
                  ↓
             Chart Type
                  │
        ┌─────────┼─────────┐
        ↓         ↓         ↓
      Natal    Draconic   Returns
        │
        ↓
      Generate
        │
        ↓
      Result
```

The central principle is:

> **Birth data is the reusable foundation. Metaphysical systems are independent interpreters of that data. Library is the educational layer. Generated results belong to their respective systems.**

---

# 27. Future-Proofing Principle

The initial product should be designed for expansion without prematurely implementing every possible feature.

The architecture should be able to accommodate:

```text
New Birth Data fields
        +
New System
        +
New Astrology Chart Type
        +
New Calculation Requirements
        +
New Result Visualization
        +
New Educational Content
```

without requiring a rewrite of the entire application.

At the same time, future-proofing must not become an excuse to build unnecessary abstractions before they are needed.

The implementation should remain simple at the core and extensible at the system boundaries.

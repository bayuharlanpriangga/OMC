# Metaphysica System Architecture Specification

**Document:** `06-system-architecture.md`
**Version:** 1.0
**Status:** Draft Specification
**Scope:** Application System Architecture
**Previous Document:** `05-data-model.md`
**Next Document:** `07-design-system.md`

---

# 1. Purpose

Dokumen ini mendefinisikan arsitektur tingkat sistem Metaphysica.

Dokumen ini menjawab:

* Bagaimana feature Metaphysica dikelompokkan?
* Apa batas setiap domain?
* Bagaimana domain saling berkomunikasi?
* Bagaimana Birth Data berhubungan dengan generation?
* Bagaimana metaphysical systems dibuat extensible?
* Bagaimana Astrology memiliki chart modules tanpa menjadi top-level systems?
* Di mana calculation engine berada?
* Bagaimana Library dipisahkan dari generation?
* Bagaimana sistem dapat berkembang tanpa membuat core application semakin sulit dipelihara?

Dokumen ini belum menentukan framework, database, ORM, deployment, atau library implementasi.

Keputusan tersebut ditentukan pada `09-technical-architecture.md`.

---

# 2. Architecture Principles

## 2.1 Domain First

Arsitektur Metaphysica harus mengikuti domain produk terlebih dahulu, bukan mengikuti library atau framework.

Conceptual structure:

```text
Product Domain
      ↓
Application Domain
      ↓
Feature Module
      ↓
Implementation
```

Bukan:

```text
Library
      ↓
Folder
      ↓
Feature
      ↓
Product
```

---

# 3. High-Level Architecture

Metaphysica dibagi menjadi beberapa domain utama:

```text
METAPHYSICA
│
├── Application Shell
│
├── Identity
│
├── Profile
│
│   └── Birth Data
│
├── Generation
│
│   ├── System Registry
│   ├── Requirement Validation
│   ├── Configuration
│   └── Result
│
├── Metaphysical Systems
│   │
│   ├── Astrology
│   │   ├── Chart Registry
│   │   ├── Natal
│   │   ├── Draconic
│   │   ├── Solar Return
│   │   ├── Lunar Return
│   │   └── Progressed
│   │
│   ├── Human Design
│   ├── Numerology
│   ├── BaZi
│   ├── Zi Wei Dou Shu
│   └── Tzolkin
│
├── Calculation
│
├── Library
│
└── Settings
```

---

# 4. Architectural Layers

Metaphysica menggunakan empat conceptual layers:

```text
┌─────────────────────────────────────┐
│ Presentation                         │
│ Pages / UI / Interaction             │
├─────────────────────────────────────┤
│ Application                          │
│ Flows / Use Cases / Orchestration    │
├─────────────────────────────────────┤
│ Domain                               │
│ Rules / Systems / Calculations       │
├─────────────────────────────────────┤
│ Infrastructure                       │
│ Persistence / External Services       │
└─────────────────────────────────────┘
```

---

# 5. Presentation Layer

Presentation Layer bertanggung jawab terhadap:

* rendering UI
* user interaction
* navigation
* forms
* loading states
* error states
* visual representation

Presentation Layer **tidak boleh menjadi tempat utama calculation logic**.

Contoh yang salah:

```text
ChartPage
├── render UI
├── calculate planets
├── calculate houses
├── calculate aspects
└── interpret result
```

Contoh yang benar:

```text
ChartPage
      ↓
Generation Application Flow
      ↓
Astrology Module
      ↓
Calculation Engine
      ↓
Result
      ↓
ChartPage
```

---

# 6. Application Layer

Application Layer mengatur use case.

Contoh:

```text
Create Birth Profile
Edit Birth Profile
Delete Birth Profile
Select Birth Profile
Generate Chart
Validate Generation
Load Generation Result
Browse Library
```

Application Layer menentukan:

> "Apa yang harus terjadi ketika user melakukan sesuatu?"

Bukan:

> "Bagaimana planet dihitung?"

Calculation tetap berada di domain/system layer.

---

# 7. Domain Layer

Domain Layer berisi aturan inti Metaphysica.

Contohnya:

```text
Birth Profile Rules
Generation Rules
System Requirements
Astrology Rules
Human Design Rules
BaZi Rules
etc.
```

Domain Layer tidak boleh bergantung pada UI.

Contoh:

```text
Human Design
requires known birth time
```

merupakan domain rule.

UI hanya menampilkan konsekuensinya.

---

# 8. Infrastructure Layer

Infrastructure menangani kebutuhan teknis eksternal.

Contoh:

```text
Database
Authentication Provider
External Location API
Calculation Libraries
File Storage
External Services
```

Domain tidak boleh mengetahui detail provider secara langsung.

Contoh:

```text
Domain
  ↓
Birth Place Service Contract
  ↓
Infrastructure Implementation
  ↓
Location Provider
```

Bukan:

```text
Domain
  ↓
Google Maps API
```

---

# 9. Core Application Domains

Metaphysica memiliki domain berikut:

```text
Application
│
├── Identity
├── Profile
├── Birth Data
├── Generation
├── Systems
├── Calculation
├── Library
└── Settings
```

Masing-masing memiliki responsibility yang jelas.

---

# 10. Identity Domain

## Responsibility

Identity bertanggung jawab terhadap:

* user identity
* authentication state
* account ownership
* session identity

Identity tidak bertanggung jawab terhadap:

* Birth Data
* metaphysical calculation
* Library content
* chart rendering

---

# 11. Profile Domain

Profile bertanggung jawab terhadap informasi user-facing profile.

Conceptually:

```text
Profile
├── User Identity
├── Account Display Data
└── Birth Data Access
```

Birth Data dapat dianggap sebagai subdomain khusus yang memiliki lifecycle dan rules sendiri.

---

# 12. Birth Data Domain

Birth Data merupakan salah satu domain inti Metaphysica.

```text
Birth Data
│
├── Birth Profile
├── Birth Time
├── Birth Place
├── Create
├── Edit
├── Delete
└── Selection
```

Birth Data bertanggung jawab terhadap:

* penyimpanan birth profile
* validasi struktur birth profile
* known/unknown birth time
* birth place
* profile relationship
* profile selection

Birth Data **tidak menghitung chart**.

---

# 13. Birth Data Independence

Birth Data harus independent dari metaphysical systems.

Correct:

```text
Birth Profile
      │
      ├────→ Astrology
      ├────→ Human Design
      ├────→ BaZi
      └────→ Numerology
```

Incorrect:

```text
Astrology Birth Profile
Human Design Birth Profile
BaZi Birth Profile
Numerology Birth Profile
```

Birth Profile merupakan shared domain data.

---

# 14. Generation Domain

Generation merupakan orchestration domain.

```text
Generation
│
├── Profile Selection
├── System Selection
├── Requirement Validation
├── Configuration
├── Execution
├── Loading
├── Error
└── Result
```

Generation tidak mengetahui detail calculation setiap system.

Generation hanya mengatur:

```text
Who
What system
Which configuration
Which input
What result
```

---

# 15. Generation Responsibility

Generation bertanggung jawab terhadap lifecycle:

```text
SELECT
  ↓
VALIDATE
  ↓
CONFIGURE
  ↓
GENERATE
  ↓
RESULT
```

Contoh:

```text
User
 ↓
Select Bayu
 ↓
Select Astrology
 ↓
Select Natal
 ↓
Validate
 ↓
Generate
 ↓
Astrology Result
```

---

# 16. Generation Must Not Own System Logic

Generation tidak boleh berisi logic seperti:

```text
if astrology
  calculate planets

if human design
  calculate gates

if bazi
  calculate pillars
```

Model tersebut akan membuat Generation menjadi giant conditional controller.

Sebaliknya:

```text
Generation
    ↓
System Registry
    ↓
Selected System Module
```

---

# 17. System Registry

System Registry merupakan discovery mechanism untuk metaphysical systems.

Conceptually:

```text
System Registry
│
├── Astrology
├── Human Design
├── Numerology
├── BaZi
├── Zi Wei Dou Shu
└── Tzolkin
```

Registry menyediakan informasi seperti:

```text
System ID
Name
Description
Availability
Requirements
Configuration
Generation Handler
Result Handler
```

Detail implementation ditentukan pada technical architecture.

---

# 18. System Module Contract

Setiap metaphysical system harus mengikuti conceptual contract.

```text
MetaphysicalSystem
│
├── identity
├── requirements
├── configuration
├── validation
├── calculation
├── result transformation
└── visualization
```

Dengan demikian Generation tidak perlu mengetahui detail internal system.

---

# 19. Metaphysical System Boundary

Setiap system memiliki boundary sendiri.

```text
Systems
│
├── Astrology
│
├── Human Design
│
├── Numerology
│
├── BaZi
│
├── Zi Wei Dou Shu
│
└── Tzolkin
```

System tidak boleh langsung memodifikasi internal state system lain.

---

# 20. Astrology Architecture

Astrology memiliki architecture khusus karena extensible.

```text
Astrology
│
├── Astrology Core
│
├── Chart Type Registry
│
├── Chart Requirements
│
├── Chart Configuration
│
├── Chart Calculation
│
├── Chart Result
│
└── Chart Visualization
```

---

# 21. Astrology Chart Registry

Chart Registry berada di dalam Astrology.

```text
Astrology
└── Chart Registry
     │
     ├── Natal
     ├── Draconic
     ├── Solar Return
     ├── Lunar Return
     └── Progressed
```

Future chart:

```text
Astrology
└── Chart Registry
     │
     ├── Existing Modules
     └── New Module
```

Core Astrology architecture tidak perlu ditulis ulang.

---

# 22. Astrology Chart Module Contract

Setiap chart type harus memiliki conceptual contract:

```text
AstrologyChartModule
│
├── identity
├── requirements
├── configuration
├── validation
├── calculation
├── result transformation
├── visualization
└── interpretation
```

Contoh:

```text
NatalModule
DraconicModule
SolarReturnModule
LunarReturnModule
ProgressedModule
```

---

# 23. Astrology Module Isolation

Natal calculation tidak boleh berada di:

```text
AstrologyPage
```

atau:

```text
GenerationPage
```

Calculation harus berada di module/domain yang relevan.

Correct:

```text
Astrology
└── Natal
    └── Calculation
```

---

# 24. Future Astrology Expansion

Jika suatu hari ditambahkan:

```text
Synastry
Composite
Transit
Solar Arc
```

arsitektur yang diharapkan:

```text
Astrology
└── Chart Registry
     ├── Natal
     ├── Draconic
     ├── Solar Return
     ├── Lunar Return
     ├── Progressed
     ├── Synastry
     ├── Composite
     ├── Transit
     └── Solar Arc
```

Tidak boleh diperlukan perubahan terhadap:

```text
Core Generation
Birth Data
Global Navigation
Generic Result Architecture
```

kecuali terdapat requirement baru yang memang memerlukan perubahan tersebut.

---

# 25. Other System Architecture

System non-Astrology mengikuti architecture yang sama secara konseptual.

## Human Design

```text
Human Design
├── Requirements
├── Configuration
├── Validation
├── Calculation
├── Result
└── Visualization
```

## Numerology

```text
Numerology
├── Requirements
├── Configuration
├── Validation
├── Calculation
├── Result
└── Visualization
```

## BaZi

```text
BaZi
├── Requirements
├── Configuration
├── Validation
├── Calculation
├── Result
└── Visualization
```

## Zi Wei Dou Shu

```text
Zi Wei Dou Shu
├── Requirements
├── Configuration
├── Validation
├── Calculation
├── Result
└── Visualization
```

## Tzolkin

```text
Tzolkin
├── Requirements
├── Configuration
├── Validation
├── Calculation
├── Result
└── Visualization
```

---

# 26. Calculation Domain

Calculation merupakan boundary antara product flow dan mathematical/metaphysical computation.

```text
Generation
     ↓
System Module
     ↓
Calculation
     ↓
Raw Result
```

Calculation harus dapat berjalan tanpa mengetahui detail UI.

---

# 27. Calculation Engine Principle

Calculation engine harus menerima structured input.

Contoh:

```text
Calculation Input
├── birthDate
├── birthTime
├── birthPlace
└── systemConfiguration
```

Kemudian menghasilkan structured output.

```text
Calculation Output
├── system
├── calculationVersion
└── domainData
```

---

# 28. Calculation and Interpretation Separation

Calculation dan interpretation harus dipisahkan.

```text
Input
 ↓
Calculation
 ↓
Raw Result
 ↓
Interpretation
 ↓
Presentation Result
```

Calculation menjawab:

> "Apa hasil perhitungannya?"

Interpretation menjawab:

> "Bagaimana hasil tersebut dijelaskan kepada user?"

---

# 29. Calculation and UI Separation

UI tidak boleh melakukan calculation.

Incorrect:

```text
ChartComponent
 ↓
calculatePlanetPosition()
```

Correct:

```text
ChartComponent
 ↓
receive Visualization Data
 ↓
render chart
```

---

# 30. Result Architecture

Result terdiri dari beberapa conceptual layers:

```text
Generation Result
│
├── Input Snapshot
│
├── Calculation Output
│
├── Visualization Data
│
└── Interpretation
```

Flow:

```text
Calculation Output
        ↓
Result Transformation
        ↓
Visualization Data
        ↓
UI
```

---

# 31. Result Isolation

Result harus immutable secara konseptual setelah generation selesai.

```text
Generation A
     ↓
Result A
```

Perubahan terhadap:

```text
Birth Profile
System Configuration
Current UI
```

tidak boleh mengubah historical Result A secara diam-diam.

---

# 32. Library Domain

Library merupakan domain edukasi.

```text
Library
│
├── Categories
├── Content
├── Search
├── Filtering
└── Reading
```

Library tidak bergantung pada Generation untuk dapat berfungsi.

---

# 33. Library and Systems Relationship

Library dapat reference ke system.

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

Namun system tidak bergantung pada Library untuk melakukan calculation.

Correct:

```text
Library → System Reference
```

Not required:

```text
System → Library → Calculation
```

---

# 34. Library to Generation Connection

Library dapat menjadi entry point menuju generation.

Contoh:

```text
Library Article
     ↓
"Generate Your Astrology Chart"
     ↓
Birth Data
     ↓
Astrology
     ↓
Chart Type
     ↓
Generate
```

Namun Library tidak melakukan generation secara langsung.

---

# 35. Settings Domain

Settings mengelola application preferences.

```text
Settings
├── Appearance
├── Language
└── Preferences
```

Settings tidak mengontrol:

```text
Calculation
Birth Data
System Requirements
Generation Logic
```

---

# 36. Application Shell

Application Shell menyediakan struktur global aplikasi.

```text
Application Shell
│
├── Header
├── Navigation
├── Profile Menu
├── Main Content
├── Global Feedback
└── Modal / Overlay Layer
```

Shell tidak boleh memiliki business logic system-specific.

---

# 37. Modal Architecture

Modal digunakan untuk interaction yang tidak membutuhkan dedicated page.

Examples:

```text
Birth Data
Create Birth Profile
Edit Birth Profile
Confirmation
```

Modal tetap berada dalam application flow tetapi tidak menjadi domain logic.

---

# 38. Page vs Domain

Page bukan domain.

Contoh:

```text
Astrology Page
```

merupakan presentation surface.

Domain:

```text
Astrology System
```

merupakan business/system domain.

Satu domain dapat memiliki beberapa presentation surfaces.

---

# 39. Dependency Direction

Dependency harus bergerak menuju domain/application rules.

Conceptual direction:

```text
Presentation
     ↓
Application
     ↓
Domain
     ↓
Infrastructure
```

Tidak boleh:

```text
Domain
  ↓
React Component
```

atau:

```text
Calculation
  ↓
Page
```

---

# 40. Cross-Domain Communication

Domain harus berkomunikasi melalui defined contracts.

Example:

```text
Generation
     ↓
System Registry
     ↓
Astrology
```

Generation tidak boleh mengakses internal detail:

```text
Astrology
└── Natal
    └── internalCalculationState
```

Generation hanya menggunakan public contract.

---

# 41. Shared Data vs Shared Logic

Shared data boleh digunakan jika benar-benar generic.

Contoh:

```text
BirthProfile
BirthPlace
BirthTime
```

Shared logic harus dibatasi.

Jangan membuat:

```text
UniversalMetaphysicalCalculator
```

yang mencoba menggabungkan seluruh system.

Metaphysical systems memiliki calculation logic yang berbeda.

---

# 42. Avoid God Modules

Metaphysica harus menghindari module yang mengetahui terlalu banyak.

Contoh yang harus dihindari:

```text
MetaphysicaEngine
├── Astrology
├── Human Design
├── Numerology
├── BaZi
├── Zi Wei Dou Shu
├── Tzolkin
├── Library
├── User
└── Settings
```

Module seperti ini akan menjadi bottleneck dan sulit dipelihara.

---

# 43. Feature Boundary

Feature harus memiliki responsibility yang jelas.

Conceptual grouping:

```text
Features
│
├── Birth Data
├── Generation
├── Library
├── Profile
├── Settings
└── Systems
```

Systems kemudian memiliki internal modules:

```text
Systems
└── Astrology
     └── Chart Modules
```

---

# 44. Domain Boundary vs Feature Boundary

Domain dan feature tidak selalu satu banding satu.

Contoh:

```text
Birth Data Domain
```

dapat digunakan oleh:

```text
Birth Data Feature
Generation Feature
Profile Feature
```

Karena itu architecture harus memisahkan:

```text
Domain responsibility
```

dari:

```text
UI feature
```

---

# 45. Generation Flow Architecture

Complete flow:

```text
User
 ↓
Presentation
 ↓
Generation Use Case
 ↓
Birth Data
 ↓
System Registry
 ↓
Selected System
 ↓
Requirement Validation
 ↓
Configuration
 ↓
Calculation
 ↓
Result Transformation
 ↓
Generation Result
 ↓
Presentation
```

---

# 46. Astrology Generation Flow

```text
User
 ↓
Select Birth Profile
 ↓
Select Astrology
 ↓
Astrology Chart Registry
 ↓
Select Chart Type
 ↓
Chart Requirements
 ↓
Validation
 ↓
Chart Configuration
 ↓
Chart Calculation
 ↓
Result Transformation
 ↓
Astrology Result
 ↓
Visualization
```

---

# 47. Human Design Generation Flow

```text
User
 ↓
Select Birth Profile
 ↓
Human Design
 ↓
Human Design Requirements
 ↓
Validation
 ↓
Configuration
 ↓
Calculation
 ↓
Result
 ↓
Visualization
```

Jika birth time unknown:

```text
Validation
 ↓
FAIL
 ↓
Missing Birth Time
 ↓
Generation Blocked
```

---

# 48. Multi-Profile Architecture

Generation architecture harus mendukung jumlah profile yang ditentukan oleh system/module.

Conceptually:

```text
Generation
└── Profile References
     ├── Profile A
     └── Profile B
```

Tetapi system dapat menentukan:

```text
requiredProfiles = 1
```

atau:

```text
requiredProfiles = 2
```

Hal ini penting untuk future systems/chart types seperti:

```text
Synastry
Composite
Comparison
```

Core generation architecture tidak perlu diubah hanya karena jumlah input profile berubah.

---

# 49. Validation Architecture

Validation terdiri dari beberapa tahap:

```text
1. Structural Validation
        ↓
2. Profile Validation
        ↓
3. System Requirement Validation
        ↓
4. Configuration Validation
        ↓
5. Calculation Readiness
```

Contoh:

```text
Birth Profile exists?
        ↓
Birth Date valid?
        ↓
Birth Time sufficient?
        ↓
Birth Place sufficient?
        ↓
Chart configuration valid?
        ↓
Ready
```

---

# 50. Error Boundary

Error harus memiliki boundary yang jelas.

Conceptual categories:

```text
User Input Error
System Requirement Error
Configuration Error
Calculation Error
Infrastructure Error
Unknown Error
```

Setiap error harus dapat diterjemahkan menjadi user-facing state tanpa membocorkan internal technical details.

---

# 51. Loading Architecture

Generation merupakan asynchronous operation secara konseptual.

```text
Idle
 ↓
Validating
 ↓
Generating
 ↓
Success
```

atau:

```text
Generating
 ↓
Error
```

UI harus merepresentasikan state tersebut.

Calculation engine tidak bertanggung jawab terhadap UI loading indicator.

---

# 52. Extensibility Model

Metaphysica dirancang untuk berkembang melalui module registration.

Conceptually:

```text
Core
│
├── Generation
├── Registry
└── Shared Contracts

Extensions
│
├── Astrology
├── Human Design
├── Numerology
├── BaZi
├── Zi Wei Dou Shu
└── Tzolkin
```

Astrology kemudian memiliki extension layer sendiri:

```text
Astrology
└── Chart Extensions
     ├── Natal
     ├── Draconic
     ├── Solar Return
     ├── Lunar Return
     └── Progressed
```

---

# 53. Adding a New Top-Level System

Jika future product menambahkan system baru:

```text
New System
```

system tersebut harus:

1. memiliki identity
2. mendefinisikan requirements
3. mendefinisikan configuration
4. memiliki validation
5. memiliki calculation
6. memiliki result transformation
7. memiliki visualization
8. mendaftarkan diri ke System Registry

Core Generation tidak boleh membutuhkan rewrite besar.

---

# 54. Adding a New Astrology Chart Type

Jika menambahkan:

```text
New Astrology Chart Type
```

module harus:

1. terdaftar di Astrology Chart Registry
2. mendefinisikan requirements
3. mendefinisikan configuration
4. mendefinisikan validation
5. menyediakan calculation
6. menyediakan result transformation
7. menyediakan visualization
8. menyediakan interpretation jika diperlukan

Tidak boleh:

```text
Rewrite Generation
Rewrite Birth Data
Rewrite System Registry
```

kecuali terdapat requirement baru.

---

# 55. Architecture Anti-Patterns

Hal berikut harus dihindari.

## 55.1 System-Specific Birth Profiles

```text
AstrologyBirthProfile
HumanDesignBirthProfile
BaZiBirthProfile
```

Tidak diperbolehkan.

---

## 55.2 Giant Generation Controller

```text
if astrology...
else if humanDesign...
else if bazi...
```

Tidak diperbolehkan sebagai architecture utama.

---

## 55.3 Calculation Inside UI

```text
ChartPage → calculation
```

Tidak diperbolehkan.

---

## 55.4 Library Owning Birth Data

```text
Library → BirthProfile
```

Tidak diperbolehkan.

---

## 55.5 Astrology Chart as Top-Level System

```text
System
├── Natal
├── Draconic
└── Astrology
```

Tidak diperbolehkan.

---

## 55.6 Shared Universal Calculator

```text
UniversalMetaphysicsCalculator
```

yang menangani semua system sekaligus harus dihindari.

---

## 55.7 Framework-Driven Domain Design

Domain architecture tidak boleh dibentuk hanya karena struktur default framework.

Framework harus mengikuti architecture produk sejauh memungkinkan.

---

# 56. Conceptual Module Map

Final conceptual module map:

```text
METAPHYSICA
│
├── Application Shell
│
├── Identity
│
├── Profile
│
├── Birth Data
│   ├── Birth Profile
│   ├── Birth Time
│   └── Birth Place
│
├── Generation
│   ├── Selection
│   ├── Validation
│   ├── Configuration
│   ├── Execution
│   └── Result
│
├── Systems
│   ├── System Registry
│   │
│   ├── Astrology
│   │   ├── Chart Registry
│   │   ├── Natal
│   │   ├── Draconic
│   │   ├── Solar Return
│   │   ├── Lunar Return
│   │   └── Progressed
│   │
│   ├── Human Design
│   ├── Numerology
│   ├── BaZi
│   ├── Zi Wei Dou Shu
│   └── Tzolkin
│
├── Calculation
│
├── Library
│
└── Settings
```

---

# 57. Complete Architecture Flow

```text
                         METAPHYSICA
                              │
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
          Identity         Library         Profile
                                              │
                                              ↓
                                         Birth Data
                                              │
                                   ┌──────────┴──────────┐
                                   ↓                     ↓
                              Birth Profile         Birth Place
                                   │
                                   ↓
                            Generation Flow
                                   │
                                   ↓
                            System Registry
                                   │
            ┌──────────────────────┼──────────────────────┐
            ↓                      ↓                      ↓
       Astrology             Human Design           Other Systems
            │
            ↓
     Chart Registry
            │
      ┌─────┼─────┬───────────┐
      ↓     ↓     ↓           ↓
    Natal Draconic Returns  Progressed
      │
      ↓
 Requirement Validation
      │
      ↓
 Configuration
      │
      ↓
 Calculation
      │
      ↓
 Result Transformation
      │
      ↓
 Generation Result
      │
      ↓
 Visualization
```

---

# 58. Architecture Quality Requirements

Architecture dianggap memenuhi specification jika:

* domain memiliki responsibility yang jelas
* Birth Data tidak bergantung pada metaphysical system
* Generation tidak mengetahui internal calculation setiap system
* system modules memiliki boundary
* Astrology chart types berada di bawah Astrology
* calculation tidak berada di presentation layer
* Library terpisah dari generation
* historical result terisolasi dari perubahan input
* system baru dapat ditambahkan melalui module architecture
* Astrology chart baru dapat ditambahkan melalui chart module architecture
* multi-profile generation dapat didukung
* validation dapat dilakukan sebelum calculation
* infrastructure tidak mencemari domain rules

---

# 59. Architecture Definition of Done

`06-system-architecture.md` dianggap selesai ketika:

* seluruh core domain telah didefinisikan
* application layers telah ditentukan
* dependency direction telah ditentukan
* Birth Data boundary telah ditentukan
* Generation boundary telah ditentukan
* System Registry telah ditentukan
* Astrology architecture telah ditentukan
* Astrology Chart Registry telah ditentukan
* Calculation boundary telah ditentukan
* Library boundary telah ditentukan
* Result isolation telah ditentukan
* extensibility model telah ditentukan
* anti-pattern utama telah ditentukan
* architecture tidak bergantung pada framework tertentu

---

# 60. Next Document

Dokumen berikutnya:

```text
07-design-system.md
```

Dokumen tersebut akan menentukan bahasa visual Metaphysica, termasuk:

* visual direction
* design principles
* color system
* typography
* spacing
* grid
* surfaces
* borders
* radius
* shadows
* effects
* iconography
* imagery
* responsive behavior
* accessibility
* visual hierarchy
* interaction states

Design System harus menjadi dasar visual sebelum UI Component Specification dibuat.

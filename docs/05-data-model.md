# Metaphysica Data Model Specification

**Document:** `05-data-model.md`
**Version:** 1.0
**Status:** Draft Specification
**Scope:** Product Data Model
**Next Document:** `06-system-architecture.md`

---

## 1. Purpose

Dokumen ini mendefinisikan struktur data utama yang digunakan oleh Metaphysica.

Dokumen ini menjawab:

* Data apa saja yang dimiliki Metaphysica?
* Apa tujuan setiap data?
* Data apa yang wajib dan opsional?
* Bagaimana hubungan antar data?
* Bagaimana data digunakan dalam feature?
* Data apa yang reusable?
* Data apa yang hanya berlaku untuk satu generation request?
* Bagaimana sistem menjaga agar data antar metaphysical system tidak tercampur?

Dokumen ini **tidak menentukan teknologi database, ORM, framework implementation, atau struktur folder source code**.

Keputusan teknis tersebut ditentukan pada dokumen `09-technical-architecture.md`.

---

# 2. Data Model Principles

Metaphysica menggunakan prinsip data berikut.

## 2.1 Birth Data Is Reusable

Birth Data merupakan data dasar yang dapat digunakan oleh lebih dari satu metaphysical system.

Birth data tidak boleh diduplikasi untuk setiap system.

Contoh:

```text
Bayu
25 September 2005
14:30
Kuningan, Indonesia
```

Data tersebut dapat digunakan untuk:

```text
Astrology
Human Design
BaZi
Zi Wei Dou Shu
dan system lain
```

jika requirements masing-masing system terpenuhi.

---

## 2.2 System-Specific Data Must Remain Separate

Data yang hanya berlaku untuk satu metaphysical system tidak boleh dimasukkan ke dalam generic Birth Profile jika tidak diperlukan oleh system lain.

Contoh:

```text
Birth Profile
├── birthDate
├── birthTime
└── birthPlace

Astrology Configuration
├── chartType
└── targetDate

BaZi Configuration
└── system-specific settings

Human Design Configuration
└── system-specific settings
```

Dengan demikian Birth Profile tetap bersifat generic.

---

## 2.3 Unknown Is Different From Empty or Zero

Nilai yang tidak diketahui harus dibedakan dari nilai yang benar-benar diketahui.

Contoh:

```text
Known birth time
14:30

Unknown birth time
null / explicit unknown state

Known midnight birth
00:00
```

`00:00` tidak boleh digunakan sebagai representasi birth time yang tidak diketahui.

---

## 2.4 Generation Data Is Immutable

Setelah sebuah generation berhasil dibuat, generation tersebut harus menyimpan konteks yang diperlukan untuk memahami hasilnya.

Perubahan Birth Profile di kemudian hari tidak boleh secara otomatis mengubah hasil generation yang sudah dibuat.

Conceptually:

```text
Birth Profile
      │
      │ used by
      ↓
Generation Request
      │
      ↓
Generation Result
```

Generation Result merupakan snapshot dari generation tersebut.

---

## 2.5 Top-Level System Is Singular

Satu generation request hanya boleh memiliki satu top-level metaphysical system.

Valid:

```text
Generation
└── Astrology
```

Valid:

```text
Generation
└── Human Design
```

Tidak valid:

```text
Generation
├── Astrology
└── Human Design
```

Jika user ingin membuat dua system berbeda, user membuat dua generation request.

---

# 3. Core Data Model

Data model utama Metaphysica:

```text
User
│
├── Settings
│
└── Birth Profiles
     │
     ├── Birth Place
     └── Birth Time
     
System Registry
│
├── Astrology
├── Human Design
├── Numerology
├── BaZi
├── Zi Wei Dou Shu
└── Tzolkin

Astrology
└── Astrology Chart Types
     ├── Natal
     ├── Draconic
     ├── Solar Return
     ├── Lunar Return
     └── Progressed

Generation Request
│
├── Birth Profile Reference(s)
├── System
├── Configuration
└── Generation State
       │
       ↓
Generation Result

Library Content
└── System Reference
```

---

# 4. Entity Overview

Core entities:

| Entity                    | Purpose                          |
| ------------------------- | -------------------------------- |
| `User`                    | Identitas account pengguna       |
| `Settings`                | Preferensi pengguna              |
| `BirthProfile`            | Reusable profile data kelahiran  |
| `BirthPlace`              | Lokasi kelahiran                 |
| `BirthTime`               | Informasi waktu kelahiran        |
| `System`                  | Metadata metaphysical system     |
| `AstrologyChartType`      | Metadata jenis chart Astrology   |
| `GenerationRequest`       | Konteks sebuah proses generation |
| `GenerationConfiguration` | Konfigurasi khusus generation    |
| `GenerationResult`        | Hasil generation                 |
| `LibraryContent`          | Konten edukasi metaphysical      |
| `LibraryCategory`         | Pengelompokan konten library     |

---

# 5. User

## 5.1 Purpose

`User` merepresentasikan account pengguna Metaphysica.

User menjadi owner dari:

* Birth Profiles
* Settings
* Generation history, jika fitur tersebut diaktifkan
* User-specific application data

---

## 5.2 Conceptual Structure

```text
User
├── id
├── email
├── displayName
├── createdAt
└── updatedAt
```

---

## 5.3 Fields

### `id`

Identifier unik user.

Required.

Tidak boleh menggunakan display name sebagai identifier.

---

### `email`

Email account user.

Required jika authentication menggunakan email.

---

### `displayName`

Nama yang ditampilkan pada UI.

Optional.

Display name tidak sama dengan Birth Profile name.

---

### `createdAt`

Timestamp ketika account dibuat.

Required.

---

### `updatedAt`

Timestamp perubahan terakhir pada user.

Required.

---

# 6. Settings

## 6.1 Purpose

`Settings` menyimpan preferensi aplikasi milik user.

Settings tidak boleh digunakan untuk menyimpan Birth Data.

---

## 6.2 Conceptual Structure

```text
Settings
├── id
├── userId
├── language
├── theme
├── createdAt
└── updatedAt
```

---

## 6.3 Rules

Settings:

* dimiliki oleh satu User
* tidak menyimpan chart configuration
* tidak menyimpan Birth Profile
* tidak menyimpan hasil generation
* dapat berkembang ketika application settings bertambah

---

# 7. BirthProfile

## 7.1 Purpose

`BirthProfile` adalah reusable representation dari seseorang yang birth data-nya dapat digunakan untuk metaphysical calculations.

Birth Profile dapat merepresentasikan:

```text
Myself
Someone Else
```

Future relationship categories dapat ditambahkan tanpa mengubah struktur fundamental Birth Profile.

---

## 7.2 Conceptual Structure

```text
BirthProfile
├── id
├── userId
├── profileName
├── relationship
├── birthDate
├── birthTime
├── birthPlace
├── createdAt
└── updatedAt
```

---

## 7.3 Fields

### `id`

Unique identifier.

Required.

---

### `userId`

Owner dari Birth Profile.

Required.

Satu Birth Profile hanya dapat dimiliki oleh satu User.

---

### `profileName`

Nama profile yang digunakan user untuk mengenali data.

Contoh:

```text
Bayu
Person A
My Partner
Father
```

Required.

---

### `relationship`

Menjelaskan hubungan profile dengan owner.

Initial values:

```text
MYSELF
SOMEONE_ELSE
```

Future values dapat ditambahkan.

Contoh kemungkinan:

```text
FAMILY
PARTNER
FRIEND
OTHER
```

Nilai ini bersifat metadata/UX dan tidak boleh digunakan sebagai dasar perhitungan metaphysical.

---

### `birthDate`

Tanggal lahir.

Required.

---

### `birthTime`

Informasi waktu lahir.

Birth time dapat memiliki dua kondisi utama:

```text
KNOWN
UNKNOWN
```

Jika known:

```text
14:30
```

Jika unknown:

```text
unknown
```

Unknown birth time **tidak boleh disimpan sebagai `00:00`**.

---

### `birthPlace`

Reference ke Birth Place.

Required pada profile yang digunakan untuk system yang membutuhkan lokasi lahir.

Untuk product flow awal, Birth Place dianggap bagian dari completed Birth Profile.

---

### `createdAt`

Timestamp pembuatan profile.

---

### `updatedAt`

Timestamp perubahan terakhir profile.

---

# 8. BirthTime

## 8.1 Purpose

`BirthTime` memisahkan status known dan unknown sehingga sistem tidak salah menginterpretasikan waktu.

---

## 8.2 Conceptual Structure

```text
BirthTime
├── status
└── time
```

---

## 8.3 Status

Allowed states:

```text
KNOWN
UNKNOWN
```

---

## 8.4 Rules

Jika:

```text
status = KNOWN
```

maka `time` harus memiliki nilai valid.

Jika:

```text
status = UNKNOWN
```

maka `time` harus kosong/null.

Invalid:

```text
status = UNKNOWN
time = 00:00
```

Valid:

```text
status = UNKNOWN
time = null
```

Valid:

```text
status = KNOWN
time = 14:30
```

---

# 9. BirthPlace

## 9.1 Purpose

`BirthPlace` menyimpan informasi lokasi kelahiran yang dapat digunakan oleh calculation engine.

---

## 9.2 Conceptual Structure

```text
BirthPlace
├── id
├── name
├── country
├── latitude
├── longitude
└── timezone
```

---

## 9.3 Fields

### `id`

Unique identifier.

---

### `name`

Nama lokasi yang ditampilkan kepada user.

Contoh:

```text
Kuningan
Jakarta
Bandung
Tokyo
```

---

### `country`

Negara lokasi.

---

### `latitude`

Latitude lokasi.

---

### `longitude`

Longitude lokasi.

---

### `timezone`

Timezone yang relevan untuk lokasi.

Timezone disimpan secara eksplisit untuk mengurangi ambiguity pada calculation.

---

## 9.4 Location Data Rule

Nama lokasi saja tidak cukup untuk calculation engine yang membutuhkan koordinat atau timezone.

Karena itu sistem harus mempertahankan data lokasi terstruktur ketika tersedia.

---

# 10. System

## 10.1 Purpose

`System` merepresentasikan top-level metaphysical system yang tersedia di Metaphysica.

Initial systems:

```text
ASTROLOGY
HUMAN_DESIGN
NUMEROLOGY
BAZI
ZI_WEI_DOU_SHU
TZOLKIN
```

---

## 10.2 Important Rule

System adalah top-level category.

Astrology chart type bukan System.

Correct:

```text
System
└── Astrology
      └── Chart Type
           └── Natal
```

Incorrect:

```text
System
├── Astrology
├── Natal
├── Draconic
├── Solar Return
└── Human Design
```

---

## 10.3 Conceptual Structure

```text
System
├── id
├── key
├── name
├── description
├── status
└── metadata
```

---

## 10.4 System Registry Principle

System metadata harus dapat direpresentasikan sebagai registry.

Conceptual example:

```text
systems
├── astrology
├── human-design
├── numerology
├── bazi
├── zi-wei-dou-shu
└── tzolkin
```

Tujuannya agar penambahan atau perubahan system tidak mengharuskan perubahan pada seluruh generation architecture.

---

# 11. AstrologyChartType

## 11.1 Purpose

`AstrologyChartType` merepresentasikan mode/chart type di dalam Astrology.

Initial chart types:

```text
NATAL
DRACONIC
SOLAR_RETURN
LUNAR_RETURN
PROGRESSED
```

---

## 11.2 Relationship

```text
System
└── Astrology
      │
      └── AstrologyChartType
```

---

## 11.3 Conceptual Structure

```text
AstrologyChartType
├── id
├── key
├── name
├── description
├── status
└── metadata
```

---

## 11.4 Extensibility Rule

Future chart types harus dapat ditambahkan tanpa mengubah core Generation Request structure.

Contoh future:

```text
TRANSIT
SYNASTRY
COMPOSITE
SOLAR_ARC
```

Penambahan chart type harus menjadi extension terhadap Astrology module.

---

# 12. GenerationRequest

## 12.1 Purpose

`GenerationRequest` merepresentasikan satu permintaan user untuk menghasilkan chart atau metaphysical result.

---

## 12.2 Conceptual Structure

```text
GenerationRequest
├── id
├── userId
├── system
├── birthProfileReferences
├── configuration
├── status
├── createdAt
└── completedAt
```

---

## 12.3 Fields

### `id`

Unique generation identifier.

---

### `userId`

User yang menjalankan generation.

---

### `system`

Exactly one top-level system.

Contoh:

```text
ASTROLOGY
```

atau:

```text
HUMAN_DESIGN
```

Tidak boleh lebih dari satu.

---

### `birthProfileReferences`

Reference ke satu atau lebih Birth Profile.

Jumlah profile yang diperbolehkan ditentukan oleh system requirements.

Contoh:

```text
Natal
→ 1 profile

Synastry future module
→ potentially 2 profiles
```

Karena itu data model tidak boleh mengunci seluruh generation menjadi single-profile secara global.

---

### `configuration`

Konfigurasi tambahan generation.

Configuration harus system-specific.

---

### `status`

Initial states:

```text
IDLE
VALIDATING
GENERATING
SUCCESS
ERROR
```

Status dapat dikembangkan jika diperlukan.

---

### `createdAt`

Timestamp generation request dibuat.

---

### `completedAt`

Timestamp generation selesai.

Boleh null ketika generation belum selesai.

---

# 13. GenerationConfiguration

## 13.1 Purpose

`GenerationConfiguration` menyimpan parameter yang dibutuhkan oleh system atau chart type tertentu.

Karena setiap metaphysical system dapat memiliki kebutuhan berbeda, configuration harus extensible.

---

## 13.2 Conceptual Structure

```text
GenerationConfiguration
├── system
├── chartType
└── parameters
```

---

## 13.3 Example: Astrology Natal

```text
GenerationConfiguration
├── system: ASTROLOGY
├── chartType: NATAL
└── parameters
```

Natal-specific parameters dapat berisi kebutuhan calculation yang ditentukan oleh Astrology module.

---

## 13.4 Example: Solar Return

```text
GenerationConfiguration
├── system: ASTROLOGY
├── chartType: SOLAR_RETURN
└── parameters
    └── targetYear
```

---

## 13.5 Example: Progressed

```text
GenerationConfiguration
├── system: ASTROLOGY
├── chartType: PROGRESSED
└── parameters
    └── targetDate
```

Parameter final tidak ditentukan di data model generic.

Parameter harus ditentukan oleh system/chart module masing-masing.

---

# 14. GenerationResult

## 14.1 Purpose

`GenerationResult` menyimpan hasil dari generation process.

---

## 14.2 Conceptual Structure

```text
GenerationResult
├── id
├── generationRequestId
├── system
├── chartType
├── inputSnapshot
├── calculationOutput
├── interpretation
├── visualizationData
├── createdAt
└── version
```

---

## 14.3 Input Snapshot

Result harus mempertahankan informasi input yang digunakan saat calculation.

Contoh:

```text
inputSnapshot
├── birthProfile
├── birthTime
├── birthPlace
├── system
├── chartType
└── configuration
```

Tujuannya agar result tetap dapat dipahami meskipun Birth Profile berubah setelah generation.

---

## 14.4 Calculation Output

`calculationOutput` menyimpan data hasil perhitungan.

Struktur ini bersifat system-specific.

Contoh konseptual:

```text
Astrology
└── calculationOutput
    ├── planets
    ├── houses
    ├── aspects
    └── positions
```

System lain dapat memiliki struktur berbeda.

---

## 14.5 Visualization Data

Visualization data menyimpan informasi yang diperlukan UI untuk menampilkan result.

Calculation output dan visualization data tidak harus memiliki struktur identik.

Contoh:

```text
Calculation Output
        ↓
Visualization Data
        ↓
Chart UI
```

Dengan demikian UI tidak harus memahami seluruh calculation engine.

---

## 14.6 Interpretation

Interpretation berisi hasil interpretasi yang ditampilkan kepada user.

Interpretation harus dipisahkan dari raw calculation output.

---

## 14.7 Version

Result dapat memiliki calculation/interpretation version.

Tujuannya untuk tracking ketika calculation engine berkembang.

Contoh:

```text
calculationVersion: 1.0
interpretationVersion: 1.0
```

Versioning strategy final ditentukan dalam technical architecture.

---

# 15. LibraryCategory

## 15.1 Purpose

`LibraryCategory` mengelompokkan konten edukasi.

Initial system categories:

```text
Astrology
Human Design
Numerology
BaZi
Zi Wei Dou Shu
Tzolkin
```

---

## 15.2 Conceptual Structure

```text
LibraryCategory
├── id
├── system
├── name
└── description
```

---

# 16. LibraryContent

## 16.1 Purpose

`LibraryContent` merepresentasikan materi edukasi di Library.

Library bukan storage untuk Birth Data.

---

## 16.2 Conceptual Structure

```text
LibraryContent
├── id
├── categoryId
├── title
├── slug
├── summary
├── content
├── contentType
├── status
├── createdAt
└── updatedAt
```

---

## 16.3 Content Type

Initial conceptual types:

```text
ARTICLE
GUIDE
REFERENCE
INTRODUCTION
FUNDAMENTALS
TERMINOLOGY
```

Jenis content dapat berkembang.

---

## 16.4 Library Rules

Library Content:

* tidak menyimpan personal Birth Data
* tidak menghasilkan chart secara langsung sebagai default behavior
* tidak menggantikan Generation Result
* dapat memiliki reference ke metaphysical system
* dapat digunakan sebagai educational entry point menuju generation flow

---

# 17. Entity Relationships

Core relationships:

```text
User
 │
 ├───────────────┐
 ↓               ↓
Settings     BirthProfile
                 │
                 ├── BirthTime
                 │
                 └── BirthPlace
                 
User
 │
 ↓
GenerationRequest
 │
 ├── System
 │    └── Astrology
 │         └── AstrologyChartType
 │
 ├── BirthProfile Reference(s)
 │
 └── GenerationConfiguration
          │
          ↓
    GenerationResult
```

Library:

```text
System
   │
   ↓
LibraryCategory
   │
   ↓
LibraryContent
```

---

# 18. Birth Profile and Generation Relationship

Birth Profile adalah reusable source data.

```text
BirthProfile
     │
     ├──────────────→ Generation A
     │
     ├──────────────→ Generation B
     │
     └──────────────→ Generation C
```

Contoh:

```text
Bayu
│
├── Astrology Natal
├── Human Design
├── Numerology
└── BaZi
```

Satu Birth Profile dapat digunakan berkali-kali.

---

# 19. Generation Isolation

Generation harus terisolasi dari perubahan Birth Profile setelah generation selesai.

Contoh:

```text
Birth Profile
25 Sep 2005
14:30
Kuningan

        ↓

Generation A
Astrology Natal
        ↓
Result A
```

Jika user kemudian mengubah:

```text
Birth Profile
25 Sep 2005
15:00
Kuningan
```

maka:

```text
Result A
```

tetap merepresentasikan generation dengan:

```text
14:30
```

Generation baru harus dibuat untuk data baru.

---

# 20. System Requirement Relationship

Data model menyediakan input umum.

System menentukan apakah input tersebut cukup.

Conceptually:

```text
BirthProfile
      │
      ↓
System Requirements
      │
      ├── valid
      │    ↓
      │  Configuration
      │    ↓
      │  Generation
      │
      └── invalid
           ↓
       Missing Data
```

Contoh:

```text
Birth Time = UNKNOWN
        │
        ↓
Human Design
        │
        ↓
Requirement Validation
        │
        ↓
Invalid
```

System tidak boleh mengubah:

```text
UNKNOWN
```

menjadi:

```text
00:00
```

untuk memaksa generation berjalan.

---

# 21. Astrology Data Model

Astrology membutuhkan struktur khusus karena memiliki banyak chart types.

```text
System
└── Astrology
      │
      └── Chart Type
            │
            ├── Natal
            ├── Draconic
            ├── Solar Return
            ├── Lunar Return
            └── Progressed
```

Setiap chart type dapat memiliki:

```text
Requirements
Configuration
Calculation
Output
Visualization
Interpretation
```

Namun semuanya tetap berada di bawah Astrology.

---

# 22. Astrology Chart Extensibility

Core generation architecture tidak boleh mengetahui detail setiap chart type secara hardcoded.

Conceptually:

```text
Generation Engine
       │
       ↓
Astrology Module
       │
       ↓
Chart Type Registry
       │
       ├── Natal Module
       ├── Draconic Module
       ├── Solar Return Module
       ├── Lunar Return Module
       ├── Progressed Module
       └── Future Module
```

Menambahkan chart type baru harus berarti menambahkan module baru yang mengikuti contract yang sama.

---

# 23. Data Ownership

Ownership model:

```text
User
│
├── owns → Settings
│
├── owns → BirthProfiles
│
└── owns → GenerationRequests
```

Birth Profile:

```text
BirthProfile
├── owns/contains → BirthTime
└── references → BirthPlace
```

Generation:

```text
GenerationRequest
├── references → BirthProfile(s)
├── references → System
├── contains → Configuration
└── produces → GenerationResult
```

Library:

```text
LibraryCategory
└── contains → LibraryContent
```

Library content bukan milik user secara default.

---

# 24. Data Lifecycle

## 24.1 Birth Profile

```text
Create
  ↓
Active
  ↓
Edit
  ↓
Active
  ↓
Delete
```

Deleting a Birth Profile harus mempertimbangkan existing Generation Results.

Completed historical results tidak boleh rusak hanya karena source Birth Profile dihapus.

---

## 24.2 Generation

```text
Created
  ↓
Validating
  ↓
Generating
  ↓
Success
```

Error path:

```text
Created
  ↓
Validating
  ↓
Error
```

atau:

```text
Created
  ↓
Validating
  ↓
Generating
  ↓
Error
```

---

# 25. Deletion Rules

## 25.1 Birth Profile

User dapat menghapus Birth Profile.

Penghapusan tidak boleh membuat historical Generation Result kehilangan konteks penting.

Karena itu Generation Result harus memiliki snapshot atau immutable input reference strategy.

---

## 25.2 Generation Result

Generation Result dapat memiliki lifecycle berbeda dari Birth Profile.

Keputusan apakah user dapat menghapus historical result ditentukan pada feature/technical specification.

---

## 25.3 Library Content

Library Content dikelola sebagai application content.

User tidak memiliki ownership terhadap Library Content.

---

# 26. Data Validation Principles

Semua data yang masuk ke generation harus melalui validation.

Validation minimal meliputi:

```text
Birth Date
Birth Time State
Birth Place
System
Chart Type
System Configuration
```

Validation harus dilakukan sebelum calculation dijalankan.

---

# 27. Data Model vs Calculation Model

Metaphysica harus membedakan:

```text
Product Data Model
```

dengan:

```text
Calculation Model
```

Product Data Model:

```text
User
BirthProfile
GenerationRequest
GenerationResult
```

Calculation Model:

```text
Planet
House
Aspect
Gate
Line
Star
Pillar
etc.
```

Calculation model akan bergantung pada metaphysical system.

Calculation model tidak boleh memaksa seluruh system menggunakan struktur yang sama.

---

# 28. System-Specific Calculation Data

Setiap system dapat memiliki domain model sendiri.

Contoh:

```text
Astrology
├── Planet
├── House
├── Aspect
├── Sign
└── Position

Human Design
├── Center
├── Gate
├── Line
├── Channel
└── Type

BaZi
├── Pillar
├── Heavenly Stem
├── Earthly Branch
└── Element
```

Struktur tersebut belum merupakan final implementation schema.

Detail calculation domain akan didefinisikan ketika masing-masing system specification dibuat.

---

# 29. Generic vs System-Specific Data

Generic:

```text
User
BirthProfile
BirthTime
BirthPlace
GenerationRequest
```

System-specific:

```text
AstrologyChartType
AstrologyCalculationOutput
HumanDesignCalculationOutput
BaZiCalculationOutput
etc.
```

Rule:

> Generic data harus tetap generic. System-specific knowledge harus berada di system-specific module.

---

# 30. Data Flow

Complete conceptual flow:

```text
User
  │
  ↓
Birth Profile
  │
  ├── Birth Date
  ├── Birth Time
  └── Birth Place
  │
  ↓
Select Profile(s)
  │
  ↓
Select System
  │
  ↓
Validate Requirements
  │
  ↓
System Configuration
  │
  ↓
Generation Request
  │
  ↓
Calculation Engine
  │
  ↓
Generation Result
  │
  ├── Input Snapshot
  ├── Calculation Output
  ├── Visualization Data
  └── Interpretation
```

---

# 31. Example Data Scenarios

## 31.1 Known Birth Time

```text
BirthProfile
├── profileName: "Bayu"
├── relationship: MYSELF
├── birthDate: 2005-09-25
├── birthTime:
│   ├── status: KNOWN
│   └── time: 14:30
└── birthPlace:
    ├── name: "Kuningan"
    ├── country: "Indonesia"
    ├── latitude: ...
    ├── longitude: ...
    └── timezone: ...
```

---

## 31.2 Unknown Birth Time

```text
BirthProfile
├── profileName: "Person A"
├── relationship: SOMEONE_ELSE
├── birthDate: 2002-03-12
├── birthTime:
│   ├── status: UNKNOWN
│   └── time: null
└── birthPlace:
    ├── name: "Jakarta"
    ├── country: "Indonesia"
    ├── latitude: ...
    ├── longitude: ...
    └── timezone: ...
```

---

## 31.3 Astrology Natal Generation

```text
GenerationRequest
├── system: ASTROLOGY
├── birthProfileReferences:
│   └── Bayu
├── configuration:
│   ├── chartType: NATAL
│   └── parameters: ...
└── status: SUCCESS
```

---

## 31.4 Astrology Solar Return Generation

```text
GenerationRequest
├── system: ASTROLOGY
├── birthProfileReferences:
│   └── Bayu
├── configuration:
│   ├── chartType: SOLAR_RETURN
│   └── parameters:
│       └── targetYear: ...
└── status: SUCCESS
```

---

## 31.5 Human Design With Unknown Birth Time

```text
BirthProfile
└── birthTime
    ├── status: UNKNOWN
    └── time: null
```

Then:

```text
Human Design
      ↓
Requirement Validation
      ↓
Birth Time Required
      ↓
Generation Blocked
```

The system must not substitute an artificial time.

---

# 32. Data Integrity Rules

The following rules are mandatory:

1. Every Birth Profile belongs to a User.
2. Every Birth Profile has a birth date.
3. Birth Time explicitly distinguishes known and unknown.
4. Unknown Birth Time must not be represented as `00:00`.
5. Birth Place stores structured location data when required.
6. One Generation Request has exactly one top-level System.
7. Astrology Chart Types belong to Astrology.
8. Astrology Chart Types are not top-level Systems.
9. Generation Configuration is system-specific.
10. Completed Generation Results preserve their generation context.
11. Historical results must not silently change when Birth Profiles are edited.
12. Library Content is separate from personal Birth Data.
13. System-specific calculation models must remain system-specific.
14. Generic product entities must not contain unnecessary system-specific fields.
15. Adding an Astrology Chart Type must not require restructuring the core Generation Request model.

---

# 33. Future Expansion

The data model should be capable of supporting future features such as:

```text
Generation History
Saved Results
Result Comparison
Multiple Profile Comparison
Synastry
Composite Charts
Chart Sharing
Public Charts
Export
PDF Reports
Interpretation Preferences
AI-assisted Interpretation
Library Bookmarks
Library Progress
```

These features are not part of the initial MVP unless explicitly added to the feature specification.

---

# 34. Out of Scope

The following are intentionally not finalized in this document:

* Database engine
* ORM
* SQL schema
* API architecture
* Authentication provider
* Next.js implementation
* React component structure
* Folder structure
* State management library
* Calculation library selection
* Deployment infrastructure
* Caching strategy
* Queue architecture
* External API provider

These decisions belong to later technical documentation.

---

# 35. Data Model Acceptance Criteria

The data model is considered valid when:

### Birth Profile

* A Birth Profile can be associated with a User.
* A Birth Profile can store known birth time.
* A Birth Profile can explicitly store unknown birth time.
* Unknown birth time cannot be represented as `00:00`.
* Birth Place can contain structured geographic information.

### Systems

* Exactly six initial top-level systems are represented.
* Astrology is represented as one top-level system.
* Astrology Chart Types exist below Astrology.
* Future Astrology Chart Types can be added without changing the generic generation model.

### Generation

* A Generation Request references one top-level system.
* A Generation Request can reference the required number of Birth Profiles.
* System-specific configuration can be represented.
* Generation status can represent validation, processing, success, and error states.
* Generation Result can preserve generation input context.

### Separation

* Birth Data is reusable across systems.
* Library Content is separate from Birth Data.
* Calculation models can differ between systems.
* System-specific data does not pollute generic entities.

---

# 36. Definition of Done

`05-data-model.md` is considered complete when:

* All core product entities are defined.
* Relationships between entities are defined.
* Required and optional data concepts are identified.
* Birth Time known/unknown behavior is explicitly defined.
* Birth Profile reuse is defined.
* Generation Request structure is defined.
* Generation Result isolation is defined.
* System and Astrology Chart Type hierarchy is defined.
* Library data is separated from generation data.
* Generic and system-specific data boundaries are documented.
* Data integrity rules are documented.
* Future extensibility constraints are documented.
* Database technology remains intentionally undecided.

---

# 37. Next Document

The next document is:

```text
06-system-architecture.md
```

`06-system-architecture.md` will define how the product-level data model is organized into application-level domains and modules.

It should answer:

```text
How do these entities and features work together
inside the Metaphysica application?
```

It should cover:

* application domains
* system boundaries
* feature boundaries
* module relationships
* generation architecture
* system registry
* Astrology module architecture
* calculation engine boundary
* library architecture
* birth data domain
* data flow between domains
* dependency direction
* extensibility rules

Technology-specific decisions should remain limited until `09-technical-architecture.md`.

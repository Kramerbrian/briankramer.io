# Public Claim Source-Validation Queue

**Status:** OPEN — no item verified without primary or durable source  
**Machine-readable authority:** `content/press.ts` → `sourceValidationQueue`  
**Evidence registry:** `content/publishing/public-claim-evidence.ts` (linked by `claimIds`)

Nothing in this queue is verified from memory. URLs are not published until a primary source artifact is supplied and reviewed.

---

## 1. The Wall Street Journal

| Field | Value |
|---|---|
| **Queue ID** | `svq-wsj-mention` |
| **Claim IDs** | `press-wsj-source-pending` |
| **Current public claim** | Homepage “Featured in” lists The Wall Street Journal with note: **Source validation pending**. No URL published. |
| **Current status** | `pending` |
| **Exact source needed** | Primary WSJ article or profile naming Brian Kramer as subject, quoted source, or bylined author — with headline, publication date, and durable permalink or archivable citation. |
| **Acceptable evidence types** | WSJ.com permalink (subscriber or archived); Nexis/Lexis printable article with metadata; print citation (date, section, page, headline) |
| **Public treatment until verified** | `label` — keep pending note visible; no URL |
| **Remain public?** | **Yes** — as named mention with pending label. Remove if no primary citation found after source search. |

---

## 2. Automotive News 40 Under 40

| Field | Value |
|---|---|
| **Queue ID** | `svq-automotive-news-40-under-40` |
| **Claim IDs** | `press-automotive-news-source-pending`, `bio-an-40-under-40` |
| **Current public claim** | Homepage press lists Automotive News with “40 Under 40” recognition; citation pending. About credentials repeat recognition with primary award citation pending. Person schema `award` property remains removed. |
| **Current status** | `pending` |
| **Exact source needed** | Official Automotive News 40 Under 40 honoree record naming Brian Kramer with award year/class and publication or announcement date. |
| **Acceptable evidence types** | AN official award/honoree page URL; AN published honoree announcement with date; durable archived capture of AN page with URL and timestamp |
| **Public treatment until verified** | `label` — citation pending on all surfaces |
| **Remain public?** | **Yes** — biographical credential with pending label. Do not restore Person schema award until primary AN citation supplied. |

---

## 3. F&I Magazine

| Field | Value |
|---|---|
| **Queue ID** | `svq-fandi-mention` |
| **Claim IDs** | `press-fandi-source-pending` |
| **Current public claim** | Homepage “Featured in” lists F&I Magazine with note: **Source validation pending**. No URL published. |
| **Current status** | `pending` |
| **Exact source needed** | Primary F&I Magazine article, profile, or interview URL naming Brian Kramer with headline and publication date. |
| **Acceptable evidence types** | F&I Magazine permalink; Wayback/archived publisher URL; print issue citation (volume, issue, date, page, headline) |
| **Public treatment until verified** | `label` |
| **Remain public?** | **Yes** — with pending label. Remove if no primary citation found. |

---

## 4. Digital Dealer Magazine

| Field | Value |
|---|---|
| **Queue ID** | `svq-digital-dealer-mention` |
| **Claim IDs** | `press-digital-dealer-source-pending` |
| **Current public claim** | Homepage “Featured in” lists Digital Dealer Magazine with note: **Source validation pending**. No URL published. |
| **Current status** | `pending` |
| **Exact source needed** | Primary Digital Dealer Magazine article, profile, or interview URL naming Brian Kramer with headline and publication date. |
| **Acceptable evidence types** | Digital Dealer Magazine permalink; Wayback/archived publisher URL; print or digital issue citation with date and headline |
| **Public treatment until verified** | `label` |
| **Remain public?** | **Yes** — with pending label. Remove if no primary citation found. |

---

## 5. Jalopnik

| Field | Value |
|---|---|
| **Queue ID** | `svq-jalopnik-mention` |
| **Claim IDs** | `press-jalopnik-source-pending` |
| **Current public claim** | Homepage “Featured in” lists Jalopnik with note: **Source validation pending**. No URL published. |
| **Current status** | `pending` |
| **Exact source needed** | Primary Jalopnik article or post URL naming Brian Kramer with headline and publication date. |
| **Acceptable evidence types** | Jalopnik.com permalink; Wayback/archived publisher URL; syndicated repost only if it traces to original Jalopnik URL |
| **Public treatment until verified** | `label` |
| **Remain public?** | **Yes** — with pending label. Remove if no primary citation found. |

---

## 6. PBS Viewpoint with Dennis Quaid

| Field | Value |
|---|---|
| **Queue ID** | `svq-pbs-viewpoint-appearance` |
| **Claim IDs** | `press-pbs-viewpoint-source-pending` |
| **Current public claim** | Homepage “Featured in” lists PBS "Viewpoint" with Dennis Quaid with note: **Appearance citation pending**. No episode URL published. |
| **Current status** | `pending` |
| **Exact source needed** | PBS episode page, program guide entry, or broadcast metadata showing Brian Kramer appearance on Viewpoint with Dennis Quaid including air date or episode identifier. |
| **Acceptable evidence types** | PBS.org episode or series page URL; PBS program guide or distributor listing with date; official PBS press/programming document naming guest and air date |
| **Public treatment until verified** | `label` — appearance citation pending |
| **Remain public?** | **Yes** — with pending label. Do not add watch URL until verified. Remove if appearance cannot be substantiated. |

---

## 7. Google Dealer Advisory Board

| Field | Value |
|---|---|
| **Queue ID** | `svq-google-dealer-advisory-board` |
| **Claim IDs** | `bio-google-dealer-advisory-board` |
| **Current public claim** | About credentials: **Former member, Google Dealer Advisory Board** — biography evidence; roster confirmation pending. |
| **Current status** | `pending` |
| **Exact source needed** | Google-issued invitation, published board roster, or official Google/Cars program announcement listing Brian Kramer as advisory board member with service period. |
| **Acceptable evidence types** | Google invitation email or letter (author-held); official Google press release or program page naming board members; archived Google dealer program roster page; employer/Google roster export with dates (author-held, redacted as needed) |
| **Public treatment until verified** | `label` — roster confirmation pending |
| **Remain public?** | **Yes** — qualified former membership with pending label. Remove if membership cannot be substantiated. |

---

## 8. Early Web3 transaction

| Field | Value |
|---|---|
| **Queue ID** | `svq-early-web3-transaction` |
| **Claim IDs** | `bio-web3-first-transaction` |
| **Current public claim** | About credentials: **Facilitated an early Web3 transaction in automotive retail** — qualified claim; absolute “industry first” not asserted. |
| **Current status** | `pending` |
| **Exact source needed** | Transaction record, dealer/OEM announcement, trade-press article, or on-chain evidence identifying the dealership Web3 transaction Brian Kramer facilitated, with date and context. |
| **Acceptable evidence types** | On-chain transaction hash plus contextual deal summary (privacy-redacted); dealer or OEM press release; contemporaneous trade-press article; author-held deal summary or contract excerpt with date (redacted) |
| **Public treatment until verified** | `qualify` — “early” only; never “first” |
| **Remain public?** | **Yes** — with qualified wording. Remove or further soften if transaction cannot be substantiated. |

---

## 9. Germain 7,500 retail vehicles annually

| Field | Value |
|---|---|
| **Queue ID** | `svq-germain-7500-retail-volume` |
| **Claim IDs** | `bio-germain-volume-7500` |
| **Current public claim** | About page and credentials: Germain Toyota/Lincoln Naples store volume **reported above 7,500 retail vehicles annually** — biography evidence; ledger confirmation pending. |
| **Current status** | `pending` |
| **Exact source needed** | Store operational ledger, annual volume report, or employer GM record for Germain Toyota of Naples and Germain Lincoln of Naples covering relevant years with retail unit counts and period definition. |
| **Acceptable evidence types** | Internal dealer KPI or annual volume report (author-held); audited store report or P&L volume line; manufacturer/franchise annual statement; employer letter confirming GM tenure and store volume for defined years |
| **Public treatment until verified** | `label` — biography evidence; ledger confirmation pending |
| **Remain public?** | **Yes** — as operator biography with non-audited label. Remove numeric claim if ledger cannot be supplied. Do not present as industry benchmark. |

---

## Verification rules

1. No item moves to `verified` without a supplied primary or durable source artifact.
2. No URL is added to `pressMentions` until the matching queue item is cleared.
3. Person schema `award` stays removed until `svq-automotive-news-40-under-40` is verified.
4. Doctrine, manuscript source, playbook source, and formula knowledge are out of scope for this queue.

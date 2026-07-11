# Formula Knowledge

Status: Canonical  
Version: 1.0.0  
Canonized: 2026-07-11  
Owner: Brian Kramer  
Machine registry: `content/doctrine/automotive-update-doctrine.ts`

This document is the human-readable specification for every formula exported by `automotiveUpdateFormulas`. The TypeScript registry controls formula IDs, names, expressions, and qualifications. This document adds operating definitions without changing those expressions. Universal thresholds are not approved unless separately governed.

## Formula: appraisal-to-sale

- **Name:** Appraisal-to-Sale Ratio
- **Expression:** `completed_appraisals / retail_vehicle_sales`
- **Grain:** Dealership rooftop and reporting period.
- **Numerator:** Count of completed appraisals during the reporting period.
- **Denominator:** Count of retail vehicle sales during the same reporting period.
- **Units:** Ratio, expressed as appraisals per retail sale.
- **Required inputs:** Appraisal ID, appraisal completion status, appraisal completion timestamp, retail delivery ID, retail delivery timestamp, rooftop identifier.
- **Permitted proxies:** None.
- **Exclusions:** Incomplete or abandoned appraisal records; wholesale-only sales; duplicate appraisal records; deliveries outside the reporting period.
- **Null and zero handling:** Return null when the denominator is zero or unavailable. Never coerce a zero denominator to zero performance.
- **Worked example:** 180 completed appraisals / 120 retail vehicle sales = 1.5 appraisals per sale.
- **Interpretation:** Describes appraisal activity relative to retail sales. Interpret with Trade Capture Rate and Missed Trade Rate.
- **Misuse risks:** Treating the ratio as a close rate; inferring causation; comparing stores with inconsistent appraisal-completion rules; publishing universal thresholds.
- **Evidence status:** Formula approved. Universal performance thresholds remain held pending source validation.
- **Source:** Brian Kramer Automotive Update, 2025-09-20; governed by `automotive-update-doctrine.ts`.
- **Version:** 1.0.0
- **Owner:** Brian Kramer; operational data owner: dealership used-vehicle leader.

## Formula: trade-capture

- **Name:** Trade Capture Rate
- **Expression:** `trades_acquired / verified_trade_eligible_opportunities`
- **Grain:** Dealership rooftop and reporting period.
- **Numerator:** Count of trade-eligible opportunities resulting in a vehicle acquired by the dealership.
- **Denominator:** Count of verified trade-eligible opportunities in the same population and period.
- **Units:** Rate, normally displayed as a percentage.
- **Required inputs:** Opportunity ID, verified trade eligibility, acquisition outcome, acquisition timestamp, rooftop identifier.
- **Permitted proxies:** Retail sales may be used only as a clearly labeled proxy when trade eligibility is unavailable.
- **Exclusions:** Opportunities without verified eligibility; duplicate opportunities; acquisitions unrelated to the measured opportunity population.
- **Null and zero handling:** Return null when the denominator is zero or unavailable. A proxy result must never be presented as the verified rate.
- **Worked example:** 48 trades acquired / 120 verified trade-eligible opportunities = 40%.
- **Interpretation:** Measures how much of the verified trade opportunity set the dealership acquired.
- **Misuse risks:** Substituting all retail sales without labeling; excluding missed opportunities from the denominator; equating the result with Look-to-Book.
- **Evidence status:** Approved with proxy qualification.
- **Source:** Brian Kramer Automotive Update, 2025-09-20; governed by `automotive-update-doctrine.ts`.
- **Version:** 1.0.0
- **Owner:** Brian Kramer; operational data owner: dealership used-vehicle leader.

## Formula: missed-trade

- **Name:** Missed Trade Rate
- **Expression:** `verified_trade_opportunities_not_acquired / verified_trade_eligible_opportunities`
- **Grain:** Dealership rooftop and reporting period.
- **Numerator:** Count of verified trade-eligible opportunities not acquired by the dealership.
- **Denominator:** Count of verified trade-eligible opportunities in the same population and period.
- **Units:** Rate, normally displayed as a percentage.
- **Required inputs:** Opportunity ID, verified trade eligibility, acquisition outcome, rooftop identifier, reporting timestamp.
- **Permitted proxies:** None.
- **Exclusions:** Unverified trade eligibility; duplicate opportunities; unresolved outcomes until resolution.
- **Null and zero handling:** Return null when the denominator is zero or unavailable. Keep unresolved outcomes separate rather than treating them as missed.
- **Worked example:** 72 verified opportunities not acquired / 120 verified trade-eligible opportunities = 60%.
- **Interpretation:** Measures verified acquisition opportunity leakage.
- **Misuse risks:** Counting unverified opportunities; treating unresolved outcomes as losses; assuming every missed trade was economically desirable.
- **Evidence status:** Formula approved; universal performance thresholds are not approved.
- **Source:** Brian Kramer Automotive Update, 2025-09-20; governed by `automotive-update-doctrine.ts`.
- **Version:** 1.0.0
- **Owner:** Brian Kramer; operational data owner: dealership used-vehicle leader.

## Formula: recon-variance

- **Name:** Reconditioning Variance
- **Expression:** `final_gl_recon_cost - recon_estimate_at_appraisal`
- **Grain:** Acquired vehicle/VIN.
- **Numerator:** Not applicable; signed difference between final general-ledger reconditioning cost and appraisal estimate.
- **Denominator:** Not applicable.
- **Units:** Currency per vehicle.
- **Required inputs:** VIN or vehicle ID, recon estimate captured at appraisal, final GL recon cost, consistent currency.
- **Permitted proxies:** None.
- **Exclusions:** Vehicles without a final closed recon ledger; costs outside the governed recon definition; post-sale costs.
- **Null and zero handling:** Return null until both values are present and final. Zero is valid when actual and estimated costs match.
- **Worked example:** $1,850 final cost - $1,400 estimate = +$450 variance.
- **Interpretation:** Positive values indicate actual recon exceeded the estimate; negative values indicate the estimate exceeded actual cost.
- **Misuse risks:** Mixing open and final costs; comparing inconsistent GL categories; treating signed errors as an accuracy measure across a portfolio.
- **Evidence status:** Approved.
- **Source:** Brian Kramer Automotive Update, 2025-05-28; governed by `automotive-update-doctrine.ts`.
- **Version:** 1.0.0
- **Owner:** Brian Kramer; operational data owners: used-vehicle and accounting leaders.

## Formula: absolute-recon-error

- **Name:** Absolute Reconditioning Error
- **Expression:** `abs(final_gl_recon_cost - recon_estimate_at_appraisal)`
- **Grain:** Acquired vehicle/VIN.
- **Numerator:** Not applicable; absolute difference between final GL recon cost and appraisal estimate.
- **Denominator:** Not applicable.
- **Units:** Currency per vehicle.
- **Required inputs:** VIN or vehicle ID, recon estimate captured at appraisal, final GL recon cost, consistent currency.
- **Permitted proxies:** None.
- **Exclusions:** Vehicles without a final closed recon ledger; costs outside the governed recon definition; post-sale costs.
- **Null and zero handling:** Return null until both values are present and final. Zero is a valid exact estimate.
- **Worked example:** abs($1,850 - $1,400) = $450 absolute error.
- **Interpretation:** Measures estimate accuracy without positive and negative errors canceling each other.
- **Misuse risks:** Losing directional information; averaging unlike vehicle segments without stratification; using incomplete ledger costs.
- **Evidence status:** Approved.
- **Source:** Brian Kramer Automotive Update, 2025-05-28; governed by `automotive-update-doctrine.ts`.
- **Version:** 1.0.0
- **Owner:** Brian Kramer; operational data owners: used-vehicle and accounting leaders.

## Formula: fi-pvr

- **Name:** F&I PVR
- **Expression:** `total_fi_gross / retail_deliveries`
- **Grain:** Dealership rooftop and reporting period.
- **Numerator:** Total governed F&I gross for retail deliveries in the reporting period.
- **Denominator:** Count of retail deliveries in the same reporting period.
- **Units:** Currency per retail vehicle.
- **Required inputs:** Retail delivery ID and date, governed F&I gross, rooftop identifier, consistent currency.
- **Permitted proxies:** None.
- **Exclusions:** Wholesale transactions; canceled or unwound deliveries according to accounting policy; gross outside the governed F&I definition.
- **Null and zero handling:** Return null when retail deliveries are zero or unavailable.
- **Worked example:** $180,000 total F&I gross / 120 retail deliveries = $1,500 PVR.
- **Interpretation:** Describes average F&I gross per retail delivery for the defined period.
- **Misuse risks:** Mixing accounting definitions; comparing periods with different unwind treatment; presenting held historical benchmarks as universal.
- **Evidence status:** Formula approved. Published historical progression values remain held for source validation.
- **Source:** Brian Kramer Automotive Update, 2025-05-28; governed by `automotive-update-doctrine.ts`.
- **Version:** 1.0.0
- **Owner:** Brian Kramer; operational data owners: F&I and accounting leaders.

## Formula: used-front-end-pvr

- **Name:** Used Front-End PVR
- **Expression:** `used_front_end_gross / used_retail_units`
- **Grain:** Dealership rooftop and reporting period.
- **Numerator:** Governed used-vehicle front-end gross for used retail units in the reporting period.
- **Denominator:** Count of used retail units in the same reporting period.
- **Units:** Currency per used retail vehicle.
- **Required inputs:** Used retail unit ID and delivery date, governed front-end gross, rooftop identifier, consistent currency.
- **Permitted proxies:** None.
- **Exclusions:** Wholesale units; new vehicles; canceled or unwound deliveries according to accounting policy; back-end gross.
- **Null and zero handling:** Return null when used retail units are zero or unavailable.
- **Worked example:** $240,000 used front-end gross / 120 used retail units = $2,000 PVR.
- **Interpretation:** Describes average used front-end gross per used retail unit for the defined period.
- **Misuse risks:** Mixing front- and back-end gross; ignoring acquisition-source and recon mix; attributing every change to execution.
- **Evidence status:** Approved.
- **Source:** Brian Kramer Automotive Update, 2025-05-28; governed by `automotive-update-doctrine.ts`.
- **Version:** 1.0.0
- **Owner:** Brian Kramer; operational data owners: used-vehicle and accounting leaders.

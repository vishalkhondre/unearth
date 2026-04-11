# Healthcare EHR Blueprint

A reference capability model for electronic health record (EHR) systems and healthcare platforms covering clinical data management, patient engagement, clinical workflows, interoperability, and compliance. Use this blueprint with skill `10-blueprint` to assess coverage gaps in any healthcare IT codebase.

## Domain

Electronic health record systems, clinical information systems, patient portals, telehealth platforms, and health information exchanges. Covers ambulatory, inpatient, and specialty care settings.

## Sources

This blueprint is derived from healthcare IT standards, certification requirements, and industry reference models:

- **ONC Health IT Certification Program** (21st Century Cures Act) -- required capabilities for certified EHR technology
- **HL7 FHIR R4** resource model -- the standard for healthcare data exchange (Patient, Observation, Condition, MedicationRequest, Encounter, etc.)
- **USCDI (United States Core Data for Interoperability)** v3/v4 -- standardized health data classes
- **SMART on FHIR** -- app launch and authorization framework for EHR-integrated applications
- **IHE (Integrating the Healthcare Enterprise)** integration profiles
- **HIPAA** privacy and security rule requirements
- **Epic / Cerner (Oracle Health) / athenahealth** capability domains (generalized, not vendor-specific)
- **TEFCA (Trusted Exchange Framework and Common Agreement)** -- national health information exchange framework

## Capabilities

### C1 -- Patient Demographics and Registration

**Description:** Register patients and manage demographic information including identity, contact details, insurance coverage, and consent. Support patient matching, merge, and deduplication across systems.

**Sub-capabilities:**
- C1.1 Patient registration and identity capture
- C1.2 Demographic management (name, DOB, gender, race, ethnicity, language)
- C1.3 Insurance and coverage verification
- C1.4 Patient matching and master patient index (MPI)
- C1.5 Patient merge and deduplication
- C1.6 Consent management (treatment, research, data sharing)
- C1.7 Emergency contact and next of kin

**Evidence signals:** Patient entity models (FHIR Patient resource), MPI services, insurance verification integrations, consent management endpoints, demographic forms.

---

### C2 -- Encounter and Visit Management

**Description:** Track patient encounters across care settings including scheduling, check-in, encounter documentation, and discharge. Support ambulatory visits, inpatient admissions, and emergency encounters.

**Sub-capabilities:**
- C2.1 Appointment scheduling and calendar management
- C2.2 Patient check-in and arrival workflows
- C2.3 Encounter creation and classification (ambulatory, inpatient, ED)
- C2.4 Encounter status tracking (planned, in-progress, completed)
- C2.5 Admission, discharge, and transfer (ADT) management
- C2.6 Provider assignment and care team management
- C2.7 Encounter-based billing trigger

**Evidence signals:** Encounter entities (FHIR Encounter resource), scheduling services, ADT event handlers, check-in workflow UIs, provider assignment models.

---

### C3 -- Clinical Documentation

**Description:** Capture and manage clinical notes, assessments, and care documentation. Support structured and unstructured documentation including progress notes, history and physical, discharge summaries, and operative reports.

**Sub-capabilities:**
- C3.1 Progress note authoring (structured and free-text)
- C3.2 Clinical note templates and macros
- C3.3 History and physical documentation
- C3.4 Discharge summary generation
- C3.5 Voice dictation and transcription
- C3.6 Clinical document signing and co-signing
- C3.7 Amendment and addendum management

**Evidence signals:** Clinical note models (FHIR DocumentReference), note template engines, rich text editors, dictation integrations, digital signature workflows.

---

### C4 -- Problem List and Diagnoses

**Description:** Maintain a patient's active, resolved, and historical clinical problems and diagnoses. Support coded diagnoses (ICD-10, SNOMED CT) and problem-diagnosis linkage.

**Sub-capabilities:**
- C4.1 Problem list management (add, resolve, inactivate)
- C4.2 Diagnosis coding (ICD-10-CM, SNOMED CT)
- C4.3 Problem-encounter association
- C4.4 Principal and secondary diagnosis designation
- C4.5 Problem list reconciliation

**Evidence signals:** Condition entities (FHIR Condition resource), diagnosis code lookups, problem list UIs, code search services, encounter-diagnosis linking.

---

### C5 -- Medication Management

**Description:** Manage medication prescribing, dispensing, and administration. Support e-prescribing, medication reconciliation, drug interaction checking, and medication history.

**Sub-capabilities:**
- C5.1 Medication prescribing (e-prescribing / EPCS)
- C5.2 Medication reconciliation
- C5.3 Drug-drug and drug-allergy interaction checking
- C5.4 Medication administration record (MAR) -- inpatient
- C5.5 Prescription refill and renewal management
- C5.6 Formulary and drug database integration
- C5.7 Controlled substance prescribing (EPCS)
- C5.8 Medication history from pharmacy benefit managers

**Evidence signals:** MedicationRequest entities (FHIR MedicationRequest), Surescripts/NCPDP integrations, drug interaction databases (FDB, Medi-Span), MAR workflows, formulary lookups.

---

### C6 -- Order Entry (CPOE)

**Description:** Enter, manage, and track clinical orders for labs, imaging, procedures, referrals, and medications. Support computerized provider order entry (CPOE) with decision support.

**Sub-capabilities:**
- C6.1 Lab order entry and management
- C6.2 Imaging and radiology order entry
- C6.3 Procedure order entry
- C6.4 Referral order management
- C6.5 Order set and protocol management
- C6.6 Order status tracking (pending, active, completed, canceled)
- C6.7 Order-based clinical decision support alerts

**Evidence signals:** ServiceRequest entities (FHIR ServiceRequest), order entry UIs, order set configurations, CDS alert engines, order status tracking, result routing.

---

### C7 -- Results Management

**Description:** Receive, display, and manage clinical results including lab results, imaging reports, and pathology reports. Support result notification, abnormal flagging, and result acknowledgment.

**Sub-capabilities:**
- C7.1 Lab result receipt and display
- C7.2 Imaging and radiology result management
- C7.3 Abnormal result flagging and alerts
- C7.4 Result acknowledgment and sign-off
- C7.5 Result trending and historical comparison
- C7.6 Critical result notification workflow
- C7.7 Discrete data extraction from results

**Evidence signals:** Observation entities (FHIR Observation, DiagnosticReport), HL7 v2 ORU message handlers, result display components, abnormal range configurations, result notification services.

---

### C8 -- Allergy and Adverse Reaction Tracking

**Description:** Document and maintain patient allergies and adverse reactions. Support coded allergens, reaction types, severity, and allergy checking during prescribing.

**Sub-capabilities:**
- C8.1 Allergy documentation (drug, food, environmental)
- C8.2 Reaction type and severity recording
- C8.3 Allergy checking during medication ordering
- C8.4 No-known-allergy documentation
- C8.5 Allergy reconciliation

**Evidence signals:** AllergyIntolerance entities (FHIR AllergyIntolerance), allergy checking services, allergen code lookups, allergy display components.

---

### C9 -- Immunization Management

**Description:** Track patient immunization history, forecast due immunizations, and support immunization registry reporting.

**Sub-capabilities:**
- C9.1 Immunization history documentation
- C9.2 Immunization forecasting and scheduling
- C9.3 Immunization registry submission (IIS)
- C9.4 Vaccine inventory management
- C9.5 Immunization consent documentation

**Evidence signals:** Immunization entities (FHIR Immunization), forecasting engines, HL7 v2 VXU message builders, registry submission services.

---

### C10 -- Clinical Decision Support

**Description:** Provide evidence-based clinical guidance at the point of care through alerts, reminders, order suggestions, and care protocol recommendations.

**Sub-capabilities:**
- C10.1 Drug interaction and allergy alerts
- C10.2 Preventive care and screening reminders
- C10.3 Guideline-based order suggestions
- C10.4 Diagnostic support tools
- C10.5 Clinical rule engine configuration
- C10.6 Alert fatigue management (suppression, override tracking)
- C10.7 CDS Hooks integration (SMART on FHIR)

**Evidence signals:** CDS rule engines, alert generation services, clinical rule configurations, CDS Hooks endpoints, alert override tracking, evidence reference integrations.

---

### C11 -- Patient Portal and Engagement

**Description:** Provide patients with secure online access to their health information, appointment scheduling, messaging, and health education. Support patient-generated health data.

**Sub-capabilities:**
- C11.1 Patient health record viewing (labs, medications, problems)
- C11.2 Secure messaging with care team
- C11.3 Online appointment scheduling
- C11.4 Prescription refill requests
- C11.5 Patient intake forms and questionnaires
- C11.6 Health education and care plan sharing
- C11.7 Proxy access (parent, caregiver)
- C11.8 Patient-generated health data (PGHD) submission

**Evidence signals:** Patient portal applications, FHIR patient-access APIs, secure messaging services, online scheduling UIs, questionnaire services, proxy access models.

---

### C12 -- Telehealth and Virtual Care

**Description:** Enable remote clinical encounters through video visits, asynchronous messaging, and remote patient monitoring. Manage virtual visit workflows and documentation.

**Sub-capabilities:**
- C12.1 Video visit scheduling and launch
- C12.2 Virtual waiting room management
- C12.3 In-visit documentation and screen sharing
- C12.4 Asynchronous (store-and-forward) consultation
- C12.5 Remote patient monitoring data integration
- C12.6 E-visit (structured questionnaire-based visit)

**Evidence signals:** Video platform integrations (Zoom, Twilio, Doxy.me), virtual visit workflow UIs, RPM device data ingestion, telehealth encounter types.

---

### C13 -- Interoperability and Health Information Exchange

**Description:** Exchange clinical data with external systems using healthcare interoperability standards. Support FHIR APIs, HL7 v2 messaging, C-CDA document exchange, and health information network participation.

**Sub-capabilities:**
- C13.1 FHIR R4 API (patient access, provider access, payer access)
- C13.2 HL7 v2 message interface (ADT, ORM, ORU, SIU)
- C13.3 C-CDA document generation and consumption
- C13.4 Direct messaging (Direct Trust)
- C13.5 Health information exchange (HIE) participation
- C13.6 TEFCA QHIN connectivity
- C13.7 SMART on FHIR app launch framework
- C13.8 Bulk FHIR data export

**Evidence signals:** FHIR server implementations, HL7 v2 interface engines, C-CDA generators, Direct messaging endpoints, HIE connection configurations, SMART launch endpoints.

---

### C14 -- Billing and Revenue Cycle

**Description:** Support the clinical-to-billing workflow including charge capture, claim generation, coding assistance, and remittance processing. Integrate with practice management and clearinghouse systems.

**Sub-capabilities:**
- C14.1 Charge capture (encounter-based, procedure-based)
- C14.2 CPT, HCPCS, and diagnosis coding
- C14.3 Claim generation (837P, 837I)
- C14.4 Eligibility verification (270/271)
- C14.5 Remittance processing (835)
- C14.6 Prior authorization management
- C14.7 Patient billing and statement generation
- C14.8 Coding assistance and validation

**Evidence signals:** Charge capture services, claim generation engines, clearinghouse integrations, eligibility check services, remittance parsers, coding validation rules.

---

### C15 -- Care Coordination and Referral Management

**Description:** Coordinate care across providers and settings through referral management, care plans, transitions of care, and care gap tracking.

**Sub-capabilities:**
- C15.1 Referral creation and tracking
- C15.2 Care plan creation and sharing
- C15.3 Transition of care documentation (C-CDA ToC)
- C15.4 Care gap identification and closure
- C15.5 Care team communication
- C15.6 Social determinants of health (SDOH) screening and referral

**Evidence signals:** CarePlan entities (FHIR CarePlan), referral tracking services, ToC document generators, care gap engines, SDOH screening tools, care team models.

---

### C16 -- Population Health and Quality Reporting

**Description:** Aggregate patient data to support population health management, quality measure reporting (eCQMs), and public health reporting.

**Sub-capabilities:**
- C16.1 Clinical quality measure (CQM) calculation
- C16.2 MIPS/MACRA quality reporting
- C16.3 Patient registry and panel management
- C16.4 Risk stratification
- C16.5 Public health reporting (immunization, syndromic, case reporting)
- C16.6 Population health dashboards

**Evidence signals:** CQM calculation engines, QRDA document generators, patient registry services, risk scoring models, public health message builders, population dashboards.

---

### C17 -- Privacy, Security, and Compliance

**Description:** Enforce HIPAA privacy and security rules including access controls, audit logging, breach notification, and minimum necessary data exposure.

**Sub-capabilities:**
- C17.1 Role-based and context-based access control
- C17.2 Audit trail logging (access, modification, disclosure)
- C17.3 Break-the-glass emergency access
- C17.4 Patient privacy preferences and consent directives
- C17.5 Data encryption (at rest and in transit)
- C17.6 Breach detection and notification
- C17.7 Minimum necessary data exposure enforcement
- C17.8 Accounting of disclosures

**Evidence signals:** Access control frameworks, audit log services, break-the-glass workflows, consent directive models, encryption configuration, breach notification procedures.

---

### C18 -- Imaging and PACS Integration

**Description:** View, manage, and integrate medical images from radiology, cardiology, and other imaging departments. Support DICOM standards and image viewer integration.

**Sub-capabilities:**
- C18.1 DICOM image storage and retrieval
- C18.2 Image viewer integration (zero-footprint or PACS)
- C18.3 Imaging order-to-result workflow
- C18.4 Image sharing (XDS-I, DICOMweb)
- C18.5 Radiology report management

**Evidence signals:** DICOM/DICOMweb integrations, image viewer components, ImagingStudy entities (FHIR ImagingStudy), PACS connectivity, radiology report parsers.

---

### C19 -- Clinical Workflow and Task Management

**Description:** Manage clinical tasks, work queues, and inbox items for providers and staff. Support task assignment, prioritization, and completion tracking.

**Sub-capabilities:**
- C19.1 Provider inbox and message center
- C19.2 Task assignment and work queue management
- C19.3 Result and document routing
- C19.4 Order follow-up tracking
- C19.5 Prescription renewal queue
- C19.6 Clinical reminder and alert inbox

**Evidence signals:** Task entities (FHIR Task), inbox UIs, work queue services, task routing rules, follow-up tracking, reminder management.

---

### C20 -- Reporting and Analytics

**Description:** Provide clinical, operational, and financial analytics through dashboards, ad-hoc reporting, and data visualization. Support clinical data warehouse integration.

**Sub-capabilities:**
- C20.1 Clinical dashboards (patient panels, quality metrics)
- C20.2 Operational reporting (visit volume, wait times, utilization)
- C20.3 Ad-hoc report builder
- C20.4 Data extract and export for analytics
- C20.5 Clinical data warehouse integration
- C20.6 Predictive analytics and risk models

**Evidence signals:** Dashboard components, report generation services, data extract jobs, warehouse ETL pipelines, analytics database schemas, predictive model integrations.

---

## Using This Blueprint

When running skill `10-blueprint` against a healthcare EHR codebase:

1. Map each discovered L1 capability to the closest blueprint capability (C1--C20).
2. Rate coverage as **Full**, **Partial**, **Gap**, or **N/A**.
3. For partial matches, document what exists versus what is missing.
4. Identify capabilities present in the codebase but absent from this blueprint.
5. Prioritize gaps as **Critical** (regulatory requirement or patient safety) or **Moderate** (limits clinical workflow or competitive positioning).

### Critical path capabilities

These form the minimum viable EHR. Gaps here represent regulatory or patient safety blockers:

C1 (Patient Demographics), C3 (Clinical Documentation), C5 (Medications), C6 (CPOE), C7 (Results), C13 (Interoperability), C17 (Privacy/Security).

### Differentiating capabilities

These separate modern platforms from basic clinical systems:

C10 (CDS), C11 (Patient Portal), C12 (Telehealth), C15 (Care Coordination), C16 (Population Health), C18 (Imaging).

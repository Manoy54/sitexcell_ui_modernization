# SiteXcell LAAN Request Context

This context defines the business language and workflow boundaries for analysing the SiteXcell LAAN request. It keeps LAAN Request distinct from Access Requests while identifying where information may be related or reusable.

## Workflow terms

**LAAN Request**:
An authenticated request to arrange access associated with a LAAN/SAR-LAN activity at a selected site. It is the canonical term for this workflow.
_Avoid_: Access Request, treating the two workflows as interchangeable.

**Request context**:
The activity, commencement date, owner/site relationship, site information, and terms acceptance that establish what the request concerns.
_Avoid_: Page 1 data, when discussing the business meaning rather than the screen location.

**Access details**:
The carrier, project reference, tenant/contact information, location, areas accessed, and related technical details needed to explain how access will occur.
_Avoid_: Page 2 data, when discussing the business meaning rather than the screen location.

**Evidence**:
The LAAN document, additional supporting documents, and confirmations that demonstrate or declare the request's supporting information.
_Avoid_: Attachments, when the discussion includes confirmations or declarations as well as files.

**Ready-to-submit state**:
A state in which the request has passed the tested checks, required information is available for review, and the final submission action is available but has not been performed.
_Avoid_: Submitted, approved, lodged, or completed request.

**Final submission**:
The action that creates, lodges, sends, or confirms the LAAN Request in the system.
_Avoid_: Next, continue, or page transition.

## Domain entities and relationships

**Requester**:
The authenticated person initiating or completing the LAAN Request.
_Avoid_: Tenant, carrier, or site owner unless the business relationship is explicitly the same.

**Site**:
The canonical location to which the LAAN Request relates. Site selection may determine related address, notes, owner requirements, or technical context.
_Avoid_: Free-text location, when referring to the canonical site relationship.

**Site owner**:
The owner or owner-related context associated with a site. In the current workflow it is also an optional way to narrow site choices; it is not automatically the requester.
_Avoid_: Requester, carrier, or tenant.

**Activity**:
The type of work associated with the request, currently represented by activities such as Installation, Inspection, and Maintenance.
_Avoid_: Request status.

**Carrier**:
The registered carrier or contractor organisation associated with the work.
_Avoid_: Tenant or site owner.

**Tenant contact**:
The company and person information describing the tenant or lessee contact for the access activity.
_Avoid_: Requester, unless the business relationship is explicitly confirmed.

**Access location**:
The floor, rooftop, tower, area, or other specific place within the selected site that will be accessed.
_Avoid_: Site, when the value identifies an internal area rather than the canonical site.

## Workflow structure

**Two-stage workflow**:
The LAAN Request sequence in which request context is established first, then access details and evidence are supplied before reaching the ready-to-submit state.
_Avoid_: Two separate requests.

**Stage 1 — request context**:
The first stage that establishes activity, commencement date, site context, and terms acceptance.
_Avoid_: Submission stage.

**Stage 2 — access details and evidence**:
The second stage that records carrier, tenant/contact, access location, documents, confirmations, and any additional technical details that apply.
_Avoid_: Confirmation-only stage.

**Cross-workflow reuse**:
The controlled reuse of valid LAAN information in a related workflow such as Access Requests or Site Owner Approval.
_Avoid_: Automatic copying, which implies that authority, freshness, and relationship rules have already been proven.

**Authoritative source**:
The record or business relationship that is trusted to supply a value for reuse or prepopulation, such as a Site, company, person, or current request.
_Avoid_: Most recent value, when authority and freshness have not been established.

**Synthetic test data**:
Non-production values used to exercise the workflow without creating a real request or exposing real personal or business information.
_Avoid_: Dummy data, when the values are intentionally structured to represent a valid scenario.

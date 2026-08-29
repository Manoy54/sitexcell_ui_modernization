# SiteXcell UI Prototype Context

This glossary defines the domain language for the SiteXcell public website and Co-Siter access-management prototype. It keeps business concepts distinct from the visual and technical implementation described in PROJECT.md.

## SiteXcell domain

**SiteXcell**:
The independent telecommunications property advisory and management brand represented by this project.
_Avoid_: telco, carrier, network operator

**Client**:
A property owner or organisation whose commercial interests SiteXcell represents or supports.
_Avoid_: customer, account, user

**Property owner**:
The person or organisation with an interest in property that contains, may contain, or may receive telecommunications infrastructure.
_Avoid_: landlord, client

**Telecommunications property**:
The property, site, building, land, lease, access arrangement, or installed infrastructure relationship affected by telecommunications equipment or activity.
_Avoid_: telco site, network property

**Advisory**:
Professional guidance that helps a client assess telecommunications property decisions, risks, negotiations, access matters, or commercial opportunities.
_Avoid_: consulting, advice service

**Agency**:
An ongoing arrangement in which SiteXcell manages telecommunications property matters on a client’s behalf.
_Avoid_: management service, administration

**Lease negotiation**:
The process of assessing, negotiating, renewing, or replacing a telecommunications property lease to protect the client’s commercial interests.
_Avoid_: rent negotiation, contract deal

**Property access**:
The controlled permission and operational arrangement for telecommunications personnel or contractors to enter or work at a client’s property.
_Avoid_: site visit, entry request

**Land Access Activity Notice**:
A notice concerning proposed telecommunications-related activity on or affecting land, commonly abbreviated as LAAN.
_Avoid_: land notice, access notice

**Unauthorised equipment**:
Telecommunications equipment or infrastructure present without the expected authority, agreement, record, or commercial arrangement.
_Avoid_: illegal equipment, unknown telco

**Site evaluation audit**:
An assessment intended to establish what telecommunications equipment or related arrangements exist at a property.
_Avoid_: telco inspection, equipment check

## Co-Siter access domain

**Co-Siter**:
The access-management experience associated with SiteXcell for coordinating telecommunications site access and related requests.
_Avoid_: portal, contractor app

**Access request**:
A request to arrange or manage access to a telecommunications property.
_Avoid_: site request, visit request

**SAR**:
The prototype label for a site access request.
_Avoid_: access ticket, service request

**Request status**:
The named stage that communicates where a request sits in its lifecycle.
_Avoid_: request color, progress label

**Submitted**:
A request state indicating that a request has been entered and is awaiting the next review or processing step.
_Avoid_: pending, new

**Commenced**:
A request state indicating that the relevant work or handling activity has begun.
_Avoid_: in progress, started

**Completed**:
A request state indicating that the relevant request activity has been finalised.
_Avoid_: closed, done

**Withdrawn**:
A request state indicating that the request has been removed from active consideration before completion.
_Avoid_: cancelled, rejected

**Request register**:
The organised list of access-related requests visible to an authorised portal user.
_Avoid_: request table, dashboard list

**Review details**:
The focused information shown for one selected request so a user can understand its context and next action.
_Avoid_: drawer data, request popup

## Prototype boundary

**Prototype**:
A reviewable representation of an intended experience whose visual completeness does not imply operational completeness.
_Avoid_: production feature, live workflow

**Prototype surface**:
A page or interface state intended to test content, layout, interaction, or information architecture.
_Avoid_: application, product module

**Sample request**:
A fictional or representative request shown to evaluate portal presentation; it is not a live business record.
_Avoid_: test ticket, real request

**Production provider**:
The external or host-managed system that receives, validates, stores, and processes a real submission.
_Avoid_: form mockup, backend form

**Fallback form**:
The visual-only enquiry form used when no production provider has been configured.
_Avoid_: live form, contact workflow

**Autonomy**:
The ability of the prototype to render and demonstrate presentation behavior without live data, authentication, persistence, or business integrations.
_Avoid_: independence, production readiness

**Productionisation**:
The deliberate work required to connect the prototype to authoritative data, identity, permissions, workflows, integrations, and operational controls.
_Avoid_: launch, polish, completion

## Brand and experience

**Independent**:
A SiteXcell brand quality expressed through advice that is not framed as carrier-owned or carrier-biased.
_Avoid_: neutral, impartial

**Commercial interest**:
The client’s financial, contractual, operational, and strategic position in a telecommunications property matter.
_Avoid_: business need, client goal

**Proof point**:
A specific SiteXcell result, scale indicator, or experience claim used to establish credibility.
_Avoid_: statistic, marketing number

**SiteXcell red**:
The controlled brand accent used for meaningful actions, active states, markers, emphasis, and selected visual details.
_Avoid_: primary color, alert red

## LAAN Request modernization

**LAAN Request**:
A request workflow for recording the context, access details, evidence, and confirmations associated with a Land Access Activity Notice.
_Avoid_: generic form, live submission

**Request context**:
The first LAAN stage containing activity, proposed commencement date, Site, optional owner narrowing, and terms acceptance.
_Avoid_: page one, header details

**Access details**:
The second LAAN stage containing carrier, project, tenant, location, and access-area information.
_Avoid_: contact form, secondary fields

**Evidence**:
The documents associated with a request, including the required LAAN document and optional supporting documents.
_Avoid_: attachments only

**Ready-to-submit state**:
A review state in which required context, access details, evidence, and confirmations are complete; in this prototype it is informational and does not enable submission.
_Avoid_: submitted, approved

**Final submission**:
The provider action that would create or update a real request. It is intentionally disabled in the prototype and guarded in live characterization tests.
_Avoid_: ready state, draft

**Semantic selector**:
A stable `data-testid` hook describing the UI behavior under test, used by local modernization tests instead of coupling them to provider-generated field markup.
_Avoid_: CSS selector, Gravity Forms ID

**Original field mapping**:
The retained `data-original-id` value that maps a modernized control to its existing Gravity Forms field identity for future integration.
_Avoid_: implementation selector

## Access Request test domain

**Access Request test case**:
A named, independently evidenced check of one Access Request behavior identified by a stable case ID.
_Avoid_: test file, step test

**Test journey**:
A reusable path through the Access Request workflow that prepares a controlled state for one or more test cases.
_Avoid_: test case, fixture

**Test capability**:
A coherent behavior family under evaluation, such as documents, recovery, conditional behavior, or accessibility.
_Avoid_: step group, test folder

**Coverage boundary**:
The declared workflow entry point, covered steps, and stopping point for a test case.
_Avoid_: current page, last step

**Prerequisite blocker**:
A missing authorization, field map, decision, fixture, control, or protocol that prevents a test case from being honestly executed.
_Avoid_: test failure, skipped pass

**Decision-gated case**:
A test case whose execution depends on an approved product, governance, staging, or human-measurement decision.
_Avoid_: incomplete test, optional test

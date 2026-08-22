# Access Request form analysis

Analyzed URL: `https://co-siter.com.au/access-requests/`

The page contains Gravity Form `gform_3`, an eight-step POST form. The final
submission control is `#gform_submit_button_3` and is present only on Step 8.
The automated test never navigates beyond Step 4. Gravity Forms uses POST for
normal transitions between steps, so the network guard allows those transitions
but blocks any final submission originating from Step 8.

## Observed workflow

1. LAAN linkage, owner/site selection, tenure confirmation, network emergency
   information, and Terms and Conditions acceptance.
2. Site-specific documentation requirements and acknowledgement.
3. Project, carrier, access date/time, health and safety contact, and on-site
   contact details.
4. Contractor count, contractor identity/induction information, and mandatory
   qualifications/training uploads.
5. Nature of work, isolation requirements, authority documents, permits, and
   special-access acknowledgement.
6. Technical installation, cabling, power, fire-rating, after-hours, high-risk,
   and rooftop/structure access questions.
7. SWMS review checklist plus safety, insurance, permit, and plan uploads.
8. Additional documents, declarations, invoice details, final acknowledgements,
   and the Submit button.

## Dedicated test path

The Site Name list contains `The CRM Carpenters Test`. Selecting it resolves the
test building address to `The CRM Carpenters Test Building, Redbank, QLD, 4301`.
The script uses this site exclusively.

Each run increments `.test-run-sequence` and creates a unique identifier in the
following form:

`test-The-CRM-Carpenters-000001-<UTC timestamp>`

The identifier is entered into Associated LAAN ID, Project Reference, test
contact names, and non-deliverable `example.invalid` email addresses.

## Safety boundary

- No Submit click is implemented.
- Any final POST originating from Step 8 is aborted in the browser.
- The test stops on Step 4 by intentionally verifying the mandatory upload
  validation message.
- No file is uploaded and Save and Continue Later is not clicked.

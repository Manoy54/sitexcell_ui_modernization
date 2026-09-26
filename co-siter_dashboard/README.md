# Co-Siter dashboard module

This directory groups the WordPress dashboard prototype, its two form prototypes, their assets, and their local verification files.

```text
co-siter_dashboard/
├── assets/
│   ├── css/cositer-demo.css
│   └── js/cositer-demo.js
├── includes/cositer-demo.php
├── pages/cositer-demo/
│   ├── template.php
│   ├── fixtures.php
│   ├── icons.php
│   └── views/
├── proposed_access_request_form/
├── proposed_laan_form/
└── tests/cositer-demo/
```

The plugin bootstrap at the repository root still owns WordPress hooks. It loads the route helper, selects the dashboard template, and enqueues assets from this module. The two `proposed_*` folders retain their standalone prototype servers and form implementations; the dashboard mounts their existing forms inside the shared shell.

The production WordPress LAAN workflow remains in the plugin's root `includes/laan-request.php`, `pages/laan-request/`, and `assets/`. The dashboard's LAAN form is a separate non-submitting prototype.

See [`../docs/COSITER_WORDPRESS_PROTOTYPE.md`](../docs/COSITER_WORDPRESS_PROTOTYPE.md) for routes, boundaries, and test commands.

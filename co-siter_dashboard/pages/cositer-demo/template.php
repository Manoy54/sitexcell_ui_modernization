<?php
/**
 * WordPress document for the local, non-submitting Co-Siter journey.
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/fixtures.php';

$view = sitexcell_ui_cositer_demo_view();
$requests = sitexcell_ui_cositer_demo_requests();
$users = sitexcell_ui_cositer_demo_users();
$documents = sitexcell_ui_cositer_demo_documents();
$page_titles = [
    'login' => 'Portal entry',
    'requests' => 'Requests',
    'request' => 'Request details',
    'users' => 'Users',
    'documents' => 'Documents',
    'settings' => 'Settings',
    'contact' => 'Contact Us',
    'laan' => 'LAAN Request',
    'access' => 'Access Request',
    'not-found' => 'Page not found',
];
$is_form = in_array($view, ['laan', 'access'], true);
$active_section = in_array($view, ['request', 'laan', 'access'], true) ? 'requests' : $view;
$nav_items = [
    ['view' => 'requests', 'label' => 'Requests', 'icon' => 'request'],
    ['view' => 'users', 'label' => 'Users', 'icon' => 'users'],
    ['view' => 'documents', 'label' => 'Documents', 'icon' => 'document'],
    ['view' => 'settings', 'label' => 'Settings', 'icon' => 'settings'],
    ['view' => 'contact', 'label' => 'Contact Us', 'icon' => 'phone'],
];

if ($view === 'not-found') {
    status_header(404);
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title><?php echo esc_html($page_titles[$view] ?? 'Co-Siter'); ?> · Co-Siter</title>
    <?php wp_head(); ?>
</head>
<body <?php body_class('sx-cositer-demo sx-cositer-' . $view); ?>>
<?php wp_body_open(); ?>
<a class="demo-skip-link" href="#main-content">Skip to main content</a>
<?php if ($view === 'login') : ?>
    <main id="main-content" class="demo-login">
        <div class="demo-login-card">
            <p class="demo-wordmark"><span>co-</span>siter<sup>™</sup></p>
            <p class="demo-eyebrow">SiteXcell · Co-Siter portal</p>
            <h1>Welcome to Co-Siter</h1>
            <p>Access requests, land access notices, and related information in one place.</p>
            <a class="demo-button demo-button-primary" href="<?php echo esc_url(sitexcell_ui_cositer_demo_url()); ?>">Enter dashboard</a>
            <a class="demo-login-back" href="<?php echo esc_url(home_url('/' . SITEXCELL_UI_HOME_SLUG . '/')); ?>">Back to SiteXcell</a>
        </div>
    </main>
<?php else : ?>
    <div class="demo-shell">
        <aside class="demo-sidebar">
            <a class="demo-brand" href="<?php echo esc_url(sitexcell_ui_cositer_demo_url()); ?>" aria-label="Co-Siter Requests">
                <span class="demo-wordmark"><span>co-</span>siter<sup>™</sup></span>
                <small>Telco Site Access Portal<br>by SiteXcell</small>
            </a>
            <nav class="demo-nav" aria-label="Co-Siter navigation">
                <?php foreach ($nav_items as $item) : ?>
                    <a href="<?php echo esc_url(sitexcell_ui_cositer_demo_url($item['view'])); ?>" <?php echo $active_section === $item['view'] ? 'aria-current="page"' : ''; ?>>
                        <svg class="demo-icon" aria-hidden="true"><use href="#icon-<?php echo esc_attr($item['icon']); ?>"></use></svg>
                        <span><?php echo esc_html($item['label']); ?></span>
                    </a>
                <?php endforeach; ?>
            </nav>
            <div class="demo-account" data-demo-account>
                <button class="demo-account-trigger" type="button" aria-label="Account options" aria-expanded="false" aria-controls="demo-account-options" aria-haspopup="true" data-demo-account-toggle>
                    <span class="demo-avatar" aria-hidden="true">GU</span>
                    <span class="demo-account-copy"><strong>Guest User</strong><small>Guest access</small></span>
                    <svg class="demo-icon demo-account-chevron" aria-hidden="true"><use href="#icon-chevron"></use></svg>
                </button>
                <div class="demo-account-popover" id="demo-account-options" data-demo-account-menu hidden>
                    <div class="demo-account-popover-header">
                        <span class="demo-avatar" aria-hidden="true">GU</span>
                        <span class="demo-account-copy"><strong>Guest User</strong><small>Guest access</small></span>
                    </div>
                    <nav class="demo-account-options" aria-label="Account options">
                        <a class="demo-account-option" href="<?php echo esc_url(sitexcell_ui_cositer_demo_url('settings')); ?>">
                            <svg class="demo-icon" aria-hidden="true"><use href="#icon-settings"></use></svg>
                            <span>Account settings</span>
                        </a>
                        <a class="demo-account-option" href="<?php echo esc_url(sitexcell_ui_cositer_demo_url('contact')); ?>">
                            <svg class="demo-icon" aria-hidden="true"><use href="#icon-phone"></use></svg>
                            <span>Contact support</span>
                        </a>
                        <a class="demo-account-option demo-account-exit" href="<?php echo esc_url(home_url('/' . SITEXCELL_UI_COSITER_LOGIN_SLUG . '/')); ?>" data-demo-exit>
                            <svg class="demo-icon" aria-hidden="true"><use href="#icon-log-out"></use></svg>
                            <span>Leave dashboard</span>
                        </a>
                    </nav>
                </div>
            </div>
        </aside>
        <div class="demo-stage">
            <header class="demo-topbar">
                <p><?php echo esc_html($page_titles[$view] ?? 'Co-Siter'); ?></p>
                <div class="demo-topbar-actions">
                    <?php if ($is_form) : ?>
                        <a href="<?php echo esc_url(sitexcell_ui_cositer_demo_url()); ?>" class="demo-button demo-button-secondary" data-demo-leave>Back to Requests</a>
                    <?php else : ?>
                        <a href="<?php echo esc_url(sitexcell_ui_cositer_demo_url('laan')); ?>" class="demo-button demo-button-primary">LAAN Request</a>
                        <a href="<?php echo esc_url(sitexcell_ui_cositer_demo_url('access')); ?>" class="demo-button demo-button-secondary">Access Request</a>
                    <?php endif; ?>
                </div>
            </header>
            <main id="main-content" class="demo-main <?php echo $is_form ? 'demo-main-form' : ''; ?>">
                <?php if ($is_form) : ?>
                    <div id="prototype-root" data-portal-embedded="true"></div>
                <?php else : ?>
                    <?php
                    $view_files = [
                        'requests' => 'requests.php',
                        'request' => 'request.php',
                        'users' => 'users.php',
                        'documents' => 'documents.php',
                        'settings' => 'settings.php',
                        'contact' => 'contact.php',
                    ];
                    $view_file = $view_files[$view] ?? 'not-found.php';
                    include __DIR__ . '/views/' . $view_file;
                    ?>
                <?php endif; ?>
            </main>
        </div>
    </div>
<?php endif; ?>
<?php include __DIR__ . '/icons.php'; ?>
<?php wp_footer(); ?>
</body>
</html>

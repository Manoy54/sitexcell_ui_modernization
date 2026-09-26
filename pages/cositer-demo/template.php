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
    'login' => 'Demo entry',
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
    <title><?php echo esc_html($page_titles[$view] ?? 'Co-Siter demo'); ?> · Co-Siter demo</title>
    <?php wp_head(); ?>
</head>
<body <?php body_class('sx-cositer-demo sx-cositer-' . $view); ?>>
<?php wp_body_open(); ?>
<a class="demo-skip-link" href="#main-content">Skip to main content</a>
<?php if ($view === 'login') : ?>
    <main id="main-content" class="demo-login">
        <div class="demo-login-card">
            <p class="demo-wordmark"><span>co-</span>siter<sup>™</sup></p>
            <p class="demo-eyebrow">SiteXcell · Portal prototype</p>
            <h1>Explore the Co-Siter demo</h1>
            <p>This is a local preview with fictional request data. No account or password is needed, and the forms do not submit.</p>
            <a class="demo-button demo-button-primary" href="<?php echo esc_url(sitexcell_ui_cositer_demo_url()); ?>">Enter demo dashboard</a>
            <a class="demo-login-back" href="<?php echo esc_url(home_url('/' . SITEXCELL_UI_HOME_SLUG . '/')); ?>">Back to SiteXcell</a>
        </div>
    </main>
<?php else : ?>
    <div class="demo-shell">
        <aside class="demo-sidebar">
            <a class="demo-brand" href="<?php echo esc_url(sitexcell_ui_cositer_demo_url()); ?>" aria-label="Co-Siter demo Requests">
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
            <div class="demo-account">
                <span class="demo-avatar" aria-hidden="true">DU</span>
                <span><strong>Demo User</strong><small>Prototype only</small></span>
                <a href="<?php echo esc_url(home_url('/' . SITEXCELL_UI_COSITER_LOGIN_SLUG . '/')); ?>" data-demo-exit>Exit demo</a>
            </div>
        </aside>
        <div class="demo-stage">
            <header class="demo-topbar">
                <p><?php echo esc_html($page_titles[$view] ?? 'Co-Siter demo'); ?></p>
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
                    <p class="demo-form-disclosure">Prototype form · No request will be submitted.</p>
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

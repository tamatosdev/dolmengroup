<?php
/**
 * Copy this file to config.local.php on the server and fill SMTP password.
 * config.local.php is gitignored.
 */
return [
  'to_email' => 'info@dolmengroup.com',
  'to_name' => 'Dolmen Group',
  'from_email' => 'info@dolmengroup.com',
  'from_name' => 'Dolmen Website',
  'smtp_host' => 'mail.dolmengroup.com',
  'smtp_port' => 465,
  'smtp_secure' => 'ssl', // ssl | tls
  'smtp_user' => 'info@dolmengroup.com',
  'smtp_pass' => 'YOUR_EMAIL_PASSWORD_HERE',
];

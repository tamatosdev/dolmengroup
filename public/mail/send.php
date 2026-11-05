<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$config = require __DIR__ . '/config.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
  $data = $_POST;
}

$type = isset($data['type']) ? trim((string) $data['type']) : 'contact';

function respond_error(string $message, int $code = 400): void {
  http_response_code($code);
  echo json_encode(['ok' => false, 'error' => $message]);
  exit;
}

function clean_line(string $value): string {
  return trim(str_replace(["\r", "\n"], '', $value));
}

function smtp_expect($socket, array $codes): void {
  $response = '';
  while ($line = fgets($socket, 515)) {
    $response .= $line;
    if (isset($line[3]) && $line[3] === ' ') {
      break;
    }
  }

  $code = (int) substr($response, 0, 3);
  if (!in_array($code, $codes, true)) {
    throw new RuntimeException('SMTP error: ' . trim($response));
  }
}

function smtp_command($socket, string $command, array $codes): void {
  fwrite($socket, $command . "\r\n");
  smtp_expect($socket, $codes);
}

function send_smtp_mail(array $config, string $subject, string $body, string $replyTo = ''): void {
  $host = $config['smtp_host'];
  $port = (int) $config['smtp_port'];
  $secure = $config['smtp_secure'];
  $remote = ($secure === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;

  $socket = @stream_socket_client($remote, $errno, $errstr, 30, STREAM_CLIENT_CONNECT);
  if (!$socket) {
    throw new RuntimeException("Could not connect to SMTP: $errstr ($errno)");
  }

  stream_set_timeout($socket, 30);
  smtp_expect($socket, [220]);
  smtp_command($socket, 'EHLO dolmengroup.com', [250]);

  if ($secure === 'tls') {
    smtp_command($socket, 'STARTTLS', [220]);
    $cryptoMethod = STREAM_CRYPTO_METHOD_TLS_CLIENT;
    if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
      $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
    }
    if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
      $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
    }
    if (!stream_socket_enable_crypto($socket, true, $cryptoMethod)) {
      throw new RuntimeException('Could not enable TLS');
    }
    smtp_command($socket, 'EHLO dolmengroup.com', [250]);
  }

  smtp_command($socket, 'AUTH LOGIN', [334]);
  smtp_command($socket, base64_encode($config['smtp_user']), [334]);
  smtp_command($socket, base64_encode($config['smtp_pass']), [235]);

  $fromEmail = clean_line($config['from_email']);
  $fromName = clean_line($config['from_name']);
  $toEmail = clean_line($config['to_email']);
  $toName = clean_line($config['to_name']);

  smtp_command($socket, 'MAIL FROM:<' . $fromEmail . '>', [250]);
  smtp_command($socket, 'RCPT TO:<' . $toEmail . '>', [250, 251]);
  smtp_command($socket, 'DATA', [354]);

  $headers = [
    'Date: ' . date('r'),
    'From: ' . sprintf('"%s" <%s>', $fromName, $fromEmail),
    'To: ' . sprintf('"%s" <%s>', $toName, $toEmail),
    'Subject: ' . clean_line($subject),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
  ];

  if ($replyTo !== '') {
    $headers[] = 'Reply-To: ' . clean_line($replyTo);
  }

  $message = implode("\r\n", $headers) . "\r\n\r\n" . str_replace("\n.", "\n..", $body) . "\r\n.";
  fwrite($socket, $message . "\r\n");
  smtp_expect($socket, [250]);
  smtp_command($socket, 'QUIT', [221]);
  fclose($socket);
}

/**
 * Send through the web server's own mailer (PHP mail()). Needs no mailbox
 * password: the domain's SPF record ("a") authorises this server to send
 * as @dolmengroup.com.
 */
function send_server_mail(array $config, string $subject, string $body, string $replyTo = ''): void {
  $fromEmail = clean_line($config['from_email']);
  $fromName = clean_line($config['from_name']);
  $toEmail = clean_line($config['to_email']);

  $headers = [
    'From: ' . sprintf('"%s" <%s>', $fromName, $fromEmail),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
  ];

  if ($replyTo !== '') {
    $headers[] = 'Reply-To: ' . clean_line($replyTo);
  }

  $encodedSubject = '=?UTF-8?B?' . base64_encode(clean_line($subject)) . '?=';
  $sent = mail($toEmail, $encodedSubject, $body, implode("\r\n", $headers), '-f' . $fromEmail);

  if (!$sent) {
    throw new RuntimeException('The server could not send the email. Please try again later.');
  }
}

function send_mail(array $config, string $subject, string $body, string $replyTo = ''): void {
  if (empty($config['smtp_pass'])) {
    send_server_mail($config, $subject, $body, $replyTo);
    return;
  }

  send_smtp_mail($config, $subject, $body, $replyTo);
}

const DUPLICATE_WINDOW_SECONDS = 120;

/**
 * Claim a submission so the same form data is mailed only once within
 * DUPLICATE_WINDOW_SECONDS (double clicks, resubmits). Returns the lock path,
 * '' when no lock could be written (send anyway), or null when an identical
 * submission was already sent.
 */
function claim_submission(array $fields): ?string {
  $normalized = array_map(static function ($value) {
    return strtolower(trim((string) $value));
  }, $fields);
  $path = sys_get_temp_dir() . '/dolmen-mail-' . sha1(json_encode($normalized));

  if (@is_file($path)) {
    if (time() - (int) @filemtime($path) < DUPLICATE_WINDOW_SECONDS) {
      return null;
    }
    @unlink($path);
  }

  // 'x' fails if another request created the lock first, so only one sends.
  $handle = @fopen($path, 'x');
  if ($handle === false) {
    clearstatcache(true, $path);
    // Lost the race to a parallel identical request: that one sends.
    // Otherwise the temp dir isn't writable here: never drop a real enquiry.
    return @is_file($path) ? null : '';
  }
  fclose($handle);

  return $path;
}

$lockPath = null;

try {
  if ($type === 'newsletter') {
    $email = isset($data['email']) ? trim((string) $data['email']) : '';
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
      respond_error('Please enter a valid email address.');
    }

    $lockPath = claim_submission(['newsletter', $email]);
    if ($lockPath === null) {
      echo json_encode(['ok' => true, 'message' => 'Subscribed successfully.']);
      exit;
    }

    $subject = 'Newsletter subscription — Dolmen website';
    $body = "New newsletter subscription\n\nEmail: {$email}\nSubmitted: " . date('Y-m-d H:i:s');
    // No Reply-To: a free-mail Reply-To on a message From our own domain is
    // scored as spoofing (FREEMAIL_FORGED_REPLYTO) and gets filtered.
    send_mail($config, $subject, $body);

    echo json_encode(['ok' => true, 'message' => 'Subscribed successfully.']);
    exit;
  }

  $name = isset($data['name']) ? trim((string) $data['name']) : '';
  $phone = isset($data['phone']) ? trim((string) $data['phone']) : '';
  $email = isset($data['email']) ? trim((string) $data['email']) : '';
  $enquiry = isset($data['enquiry']) ? trim((string) $data['enquiry']) : '';
  $message = isset($data['message']) ? trim((string) $data['message']) : '';

  if ($name === '' || $phone === '' || $email === '' || $message === '') {
    respond_error('Please fill in all required fields.');
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond_error('Please enter a valid email address.');
  }

  if (empty($data['consent'])) {
    respond_error('Please agree to the Privacy Policy and Terms of Service.');
  }

  $lockPath = claim_submission(['contact', $name, $phone, $email, $enquiry, $message]);
  if ($lockPath === null) {
    echo json_encode(['ok' => true, 'message' => 'Message sent successfully.']);
    exit;
  }

  $subject = 'Website enquiry' . ($enquiry !== '' ? " — {$enquiry}" : '');
  $body = "New enquiry from the Dolmen website\n\n"
    . "Reply to the visitor at: {$email}\n\n"
    . "Name: {$name}\n"
    . "Phone: {$phone}\n"
    . "Email: {$email}\n"
    . "Enquiry: {$enquiry}\n\n"
    . "Message:\n{$message}\n\n"
    . "Consent: Agreed to the Privacy Policy and Terms of Service\n"
    . 'Submitted: ' . date('Y-m-d H:i:s');

  // Visitor email is in the body, not Reply-To (see newsletter note above).
  send_mail($config, $subject, $body);

  echo json_encode(['ok' => true, 'message' => 'Message sent successfully.']);
} catch (Throwable $error) {
  // Sending failed: release the lock so the visitor can retry right away.
  if ($lockPath !== null && $lockPath !== '') {
    @unlink($lockPath);
  }
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => $error->getMessage()]);
}

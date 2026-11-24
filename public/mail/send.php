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

/**
 * Content headers + body for a plain-text message, or multipart/mixed with
 * one attachment (['name' => ..., 'type' => ..., 'data' => raw bytes]).
 */
function build_mime(string $body, ?array $attachment): array {
  if ($attachment === null) {
    return [
      ['MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: 8bit'],
      $body,
    ];
  }

  $boundary = 'dolmen-' . bin2hex(random_bytes(12));
  $fileName = str_replace(['"', "\r", "\n"], '', $attachment['name']);
  $parts = "--{$boundary}\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n"
    . "Content-Transfer-Encoding: 8bit\r\n\r\n"
    . $body . "\r\n"
    . "--{$boundary}\r\n"
    . 'Content-Type: ' . $attachment['type'] . '; name="' . $fileName . "\"\r\n"
    . "Content-Transfer-Encoding: base64\r\n"
    . 'Content-Disposition: attachment; filename="' . $fileName . "\"\r\n\r\n"
    . chunk_split(base64_encode($attachment['data']), 76, "\r\n")
    . "--{$boundary}--";

  return [
    ['MIME-Version: 1.0', 'Content-Type: multipart/mixed; boundary="' . $boundary . '"'],
    $parts,
  ];
}

function send_smtp_mail(array $config, string $subject, string $body, string $replyTo = '', ?array $attachment = null): void {
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
    'Subject: =?UTF-8?B?' . base64_encode(clean_line($subject)) . '?=',
  ];

  if ($replyTo !== '') {
    $headers[] = 'Reply-To: ' . clean_line($replyTo);
  }

  [$mimeHeaders, $mimeBody] = build_mime($body, $attachment);
  $headers = array_merge($headers, $mimeHeaders);

  $message = implode("\r\n", $headers) . "\r\n\r\n" . str_replace("\n.", "\n..", $mimeBody) . "\r\n.";
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
function send_server_mail(array $config, string $subject, string $body, string $replyTo = '', ?array $attachment = null): void {
  $fromEmail = clean_line($config['from_email']);
  $fromName = clean_line($config['from_name']);
  $toEmail = clean_line($config['to_email']);

  $headers = [
    'From: ' . sprintf('"%s" <%s>', $fromName, $fromEmail),
  ];

  if ($replyTo !== '') {
    $headers[] = 'Reply-To: ' . clean_line($replyTo);
  }

  [$mimeHeaders, $body] = build_mime($body, $attachment);
  $headers = array_merge($headers, $mimeHeaders);

  $encodedSubject = '=?UTF-8?B?' . base64_encode(clean_line($subject)) . '?=';
  $sent = mail($toEmail, $encodedSubject, $body, implode("\r\n", $headers), '-f' . $fromEmail);

  if (!$sent) {
    throw new RuntimeException('The server could not send the email. Please try again later.');
  }
}

function send_mail(array $config, string $subject, string $body, string $replyTo = '', ?array $attachment = null): void {
  if (empty($config['smtp_pass'])) {
    send_server_mail($config, $subject, $body, $replyTo, $attachment);
    return;
  }

  send_smtp_mail($config, $subject, $body, $replyTo, $attachment);
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

  if ($type === 'career') {
    $name = isset($data['name']) ? trim((string) $data['name']) : '';
    $phone = isset($data['phone']) ? trim((string) $data['phone']) : '';
    $email = isset($data['email']) ? trim((string) $data['email']) : '';
    $location = isset($data['location']) ? clean_line((string) $data['location']) : '';
    $category = isset($data['category']) ? clean_line((string) $data['category']) : '';
    $coverLetter = isset($data['coverLetter']) ? trim((string) $data['coverLetter']) : '';

    if ($name === '' || $phone === '' || $email === '') {
      respond_error('Please fill in all required fields.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      respond_error('Please enter a valid email address.');
    }

    if (empty($data['consent'])) {
      respond_error('Please agree to the Privacy Policy and Recruitment Terms.');
    }

    $coverLetter = function_exists('mb_substr') ? mb_substr($coverLetter, 0, 1000) : substr($coverLetter, 0, 4000);

    $file = $_FILES['resume'] ?? null;
    if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
      respond_error('Please upload your CV.');
    }
    if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE || (int) $file['size'] > 5 * 1024 * 1024) {
      respond_error('Your CV must be 5 MB or smaller.');
    }
    if ($file['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
      respond_error('Your CV could not be uploaded. Please try again.');
    }

    $allowedTypes = [
      'pdf' => 'application/pdf',
      'doc' => 'application/msword',
      'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    $extension = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
    if (!isset($allowedTypes[$extension])) {
      respond_error('Please upload your CV as a PDF, DOC or DOCX file.');
    }

    $fileData = file_get_contents($file['tmp_name']);
    if ($fileData === false || $fileData === '') {
      respond_error('Your CV could not be read. Please try again.');
    }

    $lockPath = claim_submission(['career', $name, $phone, $email, $location, $category, sha1($fileData)]);
    if ($lockPath === null) {
      echo json_encode(['ok' => true, 'message' => 'Application sent successfully.']);
      exit;
    }

    $safeName = trim((string) preg_replace('/[^A-Za-z0-9 ._-]/', '', pathinfo((string) $file['name'], PATHINFO_FILENAME)));
    if ($safeName === '') {
      $safeName = 'CV';
    }

    $subject = 'Career application' . ($category !== '' ? " — {$category}" : '') . ($location !== '' ? " ({$location})" : '');
    $body = "New career application from the Dolmen website\n\n"
      . "Reply to the applicant at: {$email}\n\n"
      . "Name: {$name}\n"
      . "Phone: {$phone}\n"
      . "Email: {$email}\n"
      . "Location: {$location}\n"
      . "Position: {$category}\n\n"
      . "Cover letter:\n" . ($coverLetter !== '' ? $coverLetter : '(none)') . "\n\n"
      . "CV: attached\n"
      . "Consent: Agreed to the Privacy Policy and Recruitment Terms\n"
      . 'Submitted: ' . date('Y-m-d H:i:s');

    send_mail($config, $subject, $body, '', [
      'name' => $safeName . '.' . $extension,
      'type' => $allowedTypes[$extension],
      'data' => $fileData,
    ]);

    echo json_encode(['ok' => true, 'message' => 'Application sent successfully.']);
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

<?php
// booking.php - Backend PHP proxy for BitForm submissions

// 1. Set your BitForm API key here (DO NOT expose this in the frontend React code!)
$api_key = "ccksweeeed71iwiic2iptsjp1506i9y1e5cdre"; 
$form_id = "1";
$bitform_endpoint = "https://old.escapegamingzone.com/wp-json/bitform/v1/entry/" . $form_id;

// 2. Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
    exit;
}

// 3. Read the JSON body sent by React
$json_str = file_get_contents('php://input');
$data = json_decode($json_str, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON payload"]);
    exit;
}

// 4. Build the POST fields as expected by BitForm
$timestamp = !empty($data['timestamp']) ? $data['timestamp'] : date('d M Y, h:i A (T)');
$raw_message = isset($data['message']) ? trim($data['message']) : "";
$message_with_time = !empty($raw_message) 
    ? $raw_message . "\n\n[Submission Time: " . $timestamp . "]"
    : "[Submission Time: " . $timestamp . "]";

$post_fields = [
    "b1-2" => isset($data['name']) ? $data['name'] : "",
    "b1-3" => isset($data['phone']) ? $data['phone'] : "",
    "b1-4" => isset($data['email']) ? $data['email'] : "",
    "b1-5" => isset($data['experience']) ? $data['experience'] : "",
    "b1-6" => $message_with_time,
    "b1-1" => "Submit"
];

// 5. Send the request via cURL to BitForm
$ch = curl_init($bitform_endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_fields));

// Add the custom API Key header
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Bitform-Api-Key: " . $api_key,
    "Content-Type: application/x-www-form-urlencoded"
]);

// Execute the request
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// 6. Direct Email Notification Safeguard
// Even if BitForm's workflow or WordPress SMTP is not yet configured,
// this will attempt to send the booking email directly to your inbox.
$to_email = "escapegamingbandra@gmail.com";
$customer_name = !empty($data['name']) ? strip_tags($data['name']) : "Customer";
$customer_phone = !empty($data['phone']) ? strip_tags($data['phone']) : "N/A";
$customer_email = !empty($data['email']) ? filter_var($data['email'], FILTER_SANITIZE_EMAIL) : "";
$experience_booked = !empty($data['experience']) ? strip_tags($data['experience']) : "General";
$user_notes = !empty($data['message']) ? nl2br(htmlspecialchars($data['message'])) : "No notes provided";

$subject = "New Booking Request: " . $experience_booked . " - " . $customer_name;
$email_html = "
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; padding: 20px; }
    .card { background: #ffffff; padding: 24px; border-radius: 8px; max-width: 550px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    h2 { color: #111; margin-top: 0; border-bottom: 2px solid #00f0ff; padding-bottom: 8px; }
    .item { margin-bottom: 12px; }
    .label { font-weight: bold; color: #555; }
    .val { color: #222; }
    .msg-box { background: #f9f9fb; border-left: 3px solid #ff0055; padding: 12px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class='card'>
    <h2>🎮 New Booking Request Received</h2>
    <div class='item'><span class='label'>Name:</span> <span class='val'>" . htmlspecialchars($customer_name) . "</span></div>
    <div class='item'><span class='label'>Phone:</span> <span class='val'><a href='tel:" . htmlspecialchars($customer_phone) . "'>" . htmlspecialchars($customer_phone) . "</a></span></div>
    <div class='item'><span class='label'>Email:</span> <span class='val'><a href='mailto:" . htmlspecialchars($customer_email) . "'>" . htmlspecialchars($customer_email) . "</a></span></div>
    <div class='item'><span class='label'>Experience:</span> <span class='val'>" . htmlspecialchars($experience_booked) . "</span></div>
    <div class='item'><span class='label'>Submission Time:</span> <span class='val'>" . htmlspecialchars($timestamp) . "</span></div>
    <div class='item'>
      <span class='label'>Customer Message / Notes:</span>
      <div class='msg-box'>" . $user_notes . "</div>
    </div>
  </div>
</body>
</html>
";

$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Escape Gaming Bookings <noreply@escapegamingzone.com>',
    'X-Mailer: PHP/' . phpversion()
];
if (!empty($customer_email)) {
    $headers[] = 'Reply-To: ' . $customer_email;
}

@mail($to_email, $subject, $email_html, implode("\r\n", $headers));

// 7. Return the response back to React
http_response_code($httpcode ?: 200);
header('Content-Type: application/json');

if ($error) {
    echo json_encode(["error" => "cURL Error", "details" => $error]);
} else {
    echo $response;
}
?>

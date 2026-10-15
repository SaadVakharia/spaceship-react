<?php
/**
 * Plugin Name: Escape Gaming Floor Manager API
 * Description: Ultra-fast, lightweight REST API for Escape Gaming Zone multi-admin floor management, real-time station timers, extensions, station transfers, maintenance modes, bookings history, and DB-backed experience configuration.
 * Version: 1.2.0
 * Author: Escape Gaming Zone
 */

// Block direct access
if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    // 1. GET /wp-json/escape/v1/sessions - Fetch all active floor sessions, recent history, and experiences
    register_rest_route('escape/v1', '/sessions', [
        'methods' => 'GET',
        'callback' => 'escape_get_floor_sessions',
        'permission_callback' => '__return_true',
    ]);

    // 2. POST /wp-json/escape/v1/sessions - Save or update a session
    register_rest_route('escape/v1', '/sessions', [
        'methods' => 'POST',
        'callback' => 'escape_save_floor_session',
        'permission_callback' => '__return_true',
    ]);

    // 3. DELETE /wp-json/escape/v1/sessions/<id> - Free station / complete session
    register_rest_route('escape/v1', '/sessions/(?P<id>[a-zA-Z0-9_\-]+)', [
        'methods' => 'DELETE',
        'callback' => 'escape_delete_floor_session',
        'permission_callback' => '__return_true',
    ]);

    // 4. DELETE /wp-json/escape/v1/history/<id> - Remove single booking from history
    register_rest_route('escape/v1', '/history/(?P<id>[a-zA-Z0-9_\-]+)', [
        'methods' => 'DELETE',
        'callback' => 'escape_delete_floor_history',
        'permission_callback' => '__return_true',
    ]);

    // 5. GET /wp-json/escape/v1/experiences - Fetch experiences configuration from DB
    register_rest_route('escape/v1', '/experiences', [
        'methods' => 'GET',
        'callback' => 'escape_get_experiences_route',
        'permission_callback' => '__return_true',
    ]);

    // 6. POST /wp-json/escape/v1/experiences - Save experiences configuration to DB
    register_rest_route('escape/v1', '/experiences', [
        'methods' => 'POST',
        'callback' => 'escape_save_experiences_route',
        'permission_callback' => '__return_true',
    ]);
});

function escape_get_experiences_config() {
    $exp = get_option('escape_experiences_config', null);
    if (!is_array($exp) || empty($exp)) {
        // Initial 4 experiences with 0 systems initialized (capacities configured via Settings modal)
        $exp = [
            [
                'id' => 'pc',
                'name' => 'PC Esports Arena',
                'prefix' => 'PC',
                'capacity' => 0,
                'rate' => 150,
                'minDuration' => 30,
                'color' => '#00f2fe',
                'icon' => 'monitor',
            ],
            [
                'id' => 'ps5',
                'name' => 'PS5 Lounge',
                'prefix' => 'PS5',
                'capacity' => 0,
                'rate' => 200,
                'minDuration' => 30,
                'color' => '#3b82f6',
                'icon' => 'gamepad',
            ],
            [
                'id' => 'vr',
                'name' => 'VR Immersion Pods',
                'prefix' => 'VR',
                'capacity' => 0,
                'rate' => 350,
                'minDuration' => 30,
                'color' => '#a855f7',
                'icon' => 'glasses',
            ],
            [
                'id' => 'racing',
                'name' => 'Racing Simulators',
                'prefix' => 'SIM',
                'capacity' => 0,
                'rate' => 300,
                'minDuration' => 30,
                'color' => '#f59e0b',
                'icon' => 'gauge',
            ],
        ];
        update_option('escape_experiences_config', $exp, false);
    }
    return $exp;
}

function escape_get_experiences_route() {
    return rest_ensure_response([
        'success' => true,
        'experiences' => array_values(escape_get_experiences_config()),
    ]);
}

function escape_save_experiences_route($request) {
    $data = $request->get_json_params();
    if (empty($data)) {
        $data = $request->get_params();
    }
    if (isset($data['experiences']) && is_array($data['experiences'])) {
        $items = $data['experiences'];
    } elseif (is_array($data)) {
        $items = $data;
    } else {
        $items = [];
    }

    $sanitized = [];
    foreach ($items as $item) {
        if (!is_array($item) || empty($item['id'])) continue;
        $sanitized[] = [
            'id' => sanitize_text_field($item['id']),
            'name' => isset($item['name']) ? sanitize_text_field($item['name']) : 'Experience',
            'prefix' => isset($item['prefix']) ? strtoupper(sanitize_text_field($item['prefix'])) : 'EXP',
            'capacity' => isset($item['capacity']) ? max(0, intval($item['capacity'])) : 0,
            'rate' => isset($item['rate']) ? max(0, floatval($item['rate'])) : 0,
            'minDuration' => isset($item['minDuration']) ? intval($item['minDuration']) : 30,
            'color' => isset($item['color']) ? sanitize_hex_color($item['color']) ?: '#00f2fe' : '#00f2fe',
            'icon' => isset($item['icon']) ? sanitize_text_field($item['icon']) : 'monitor',
        ];
    }

    update_option('escape_experiences_config', $sanitized, false);

    return rest_ensure_response([
        'success' => true,
        'experiences' => $sanitized,
    ]);
}

function escape_get_floor_sessions() {
    $sessions = get_option('escape_active_floor_sessions', []);
    if (!is_array($sessions)) {
        $sessions = [];
    }
    $history = get_option('escape_floor_bookings_history', []);
    if (!is_array($history)) {
        $history = [];
    }
    $experiences = escape_get_experiences_config();

    return rest_ensure_response([
        'success' => true,
        'count' => count($sessions),
        'sessions' => array_values($sessions),
        'history' => array_values($history),
        'experiences' => array_values($experiences),
    ]);
}

function escape_save_floor_session($request) {
    $data = $request->get_json_params();
    if (empty($data)) {
        $data = $request->get_params();
    }

    $station_id = isset($data['stationId']) ? sanitize_text_field($data['stationId']) : '';
    if (empty($station_id)) {
        return new WP_Error('missing_station', 'stationId parameter is required', ['status' => 400]);
    }

    $sessions = get_option('escape_active_floor_sessions', []);
    if (!is_array($sessions)) {
        $sessions = [];
    }

    // Handle station transfer: if transferSource is provided, free the source station
    if (!empty($data['transferSource']) && isset($sessions[$data['transferSource']])) {
        unset($sessions[$data['transferSource']]);
    }

    $session_id = !empty($data['id']) ? sanitize_text_field($data['id']) : ('SES-' . round(microtime(true) * 1000));

    $session_entry = [
        'id' => $session_id,
        'stationId' => $station_id,
        'stationName' => $station_id,
        'customerName' => isset($data['customerName']) ? sanitize_text_field($data['customerName']) : 'Gamer',
        'customerPhone' => isset($data['customerPhone']) ? sanitize_text_field($data['customerPhone']) : '',
        'customerEmail' => isset($data['customerEmail']) ? sanitize_email($data['customerEmail']) : '',
        'experienceId' => isset($data['experienceId']) ? sanitize_text_field($data['experienceId']) : 'pc',
        'durationMinutes' => isset($data['durationMinutes']) ? intval($data['durationMinutes']) : 60,
        'startTime' => isset($data['startTime']) ? floatval($data['startTime']) : (microtime(true) * 1000),
        'endTime' => isset($data['endTime']) ? floatval($data['endTime']) : ((microtime(true) + 3600) * 1000),
        'amount' => isset($data['amount']) ? floatval($data['amount']) : 0,
        'paymentMethod' => isset($data['paymentMethod']) ? sanitize_text_field($data['paymentMethod']) : 'Cash',
        'bookingType' => isset($data['bookingType']) ? sanitize_text_field($data['bookingType']) : 'Walk-in',
        'staffName' => isset($data['staffName']) ? sanitize_text_field($data['staffName']) : 'Admin',
        'notes' => isset($data['notes']) ? sanitize_textarea_field($data['notes']) : '',
        'status' => isset($data['status']) ? sanitize_text_field($data['status']) : 'active',
        'updatedAt' => date('c'),
    ];

    $sessions[$station_id] = $session_entry;
    update_option('escape_active_floor_sessions', $sessions, false);

    // If it's a real booking (not maintenance), store/update in history as well
    if ($session_entry['status'] !== 'MAINTENANCE') {
        $history = get_option('escape_floor_bookings_history', []);
        if (!is_array($history)) {
            $history = [];
        }
        $found = false;
        foreach ($history as $idx => $hItem) {
            if ($hItem['id'] === $session_id) {
                $history[$idx] = $session_entry;
                $found = true;
                break;
            }
        }
        if (!$found) {
            array_unshift($history, $session_entry);
            // Cap history to 200 items to keep option tiny
            if (count($history) > 200) {
                $history = array_slice($history, 0, 200);
            }
        }
        update_option('escape_floor_bookings_history', $history, false);
    }

    return rest_ensure_response([
        'success' => true,
        'session' => $sessions[$station_id],
    ]);
}

function escape_delete_floor_session($request) {
    $target = $request['id'];
    $sessions = get_option('escape_active_floor_sessions', []);
    if (!is_array($sessions)) {
        $sessions = [];
    }

    $deleted_session = null;

    // Check if matching stationId directly
    if (isset($sessions[$target])) {
        $deleted_session = $sessions[$target];
        unset($sessions[$target]);
    } else {
        // Search by session id
        foreach ($sessions as $st => $sess) {
            if (isset($sess['id']) && $sess['id'] === $target) {
                $deleted_session = $sess;
                unset($sessions[$st]);
                break;
            }
        }
    }

    update_option('escape_active_floor_sessions', $sessions, false);

    // If a session was ended, mark it completed in history
    if ($deleted_session && $deleted_session['status'] !== 'MAINTENANCE') {
        $history = get_option('escape_floor_bookings_history', []);
        if (is_array($history)) {
            foreach ($history as $idx => $hItem) {
                if ($hItem['id'] === $deleted_session['id']) {
                    $history[$idx]['status'] = 'completed';
                    $history[$idx]['actualEndTime'] = round(microtime(true) * 1000);
                    break;
                }
            }
            update_option('escape_floor_bookings_history', $history, false);
        }
    }

    return rest_ensure_response([
        'success' => true,
        'deleted' => $deleted_session !== null,
    ]);
}

function escape_delete_floor_history($request) {
    $target_id = $request['id'];
    $history = get_option('escape_floor_bookings_history', []);
    if (!is_array($history)) {
        $history = [];
    }

    $filtered = array_values(array_filter($history, function ($item) use ($target_id) {
        return $item['id'] !== $target_id;
    }));

    update_option('escape_floor_bookings_history', $filtered, false);

    return rest_ensure_response([
        'success' => true,
        'deleted' => true,
    ]);
}

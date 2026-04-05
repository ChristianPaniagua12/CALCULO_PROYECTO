<?php
// ==============================================
// MAZE PAINT - API Backend
// Almacena puntajes y controla acceso por nombre
// Guarda IP para referencia del administrador
// ==============================================

header('Content-Type: application/json; charset=utf-8');

$DATA_DIR = __DIR__ . '/data';
$DATA_FILE = $DATA_DIR . '/scores.json';

if (!file_exists($DATA_DIR)) {
    mkdir($DATA_DIR, 0777, true);
}

function loadScores() {
    global $DATA_FILE;
    if (file_exists($DATA_FILE)) {
        $content = file_get_contents($DATA_FILE);
        $data = json_decode($content, true);
        return is_array($data) ? $data : [];
    }
    return [];
}

function saveScores($scores) {
    global $DATA_FILE;
    file_put_contents($DATA_FILE, json_encode($scores, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function getClientIP() {
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    }
    return $_SERVER['REMOTE_ADDR'];
}

function normalizeName($name) {
    return mb_strtolower(trim($name));
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {

    case 'check_name':
        $name = isset($_GET['name']) ? $_GET['name'] : '';
        $nameNorm = normalizeName($name);
        $scores = loadScores();
        $found = false;
        $playerData = null;
        foreach ($scores as $entry) {
            if (normalizeName($entry['name']) === $nameNorm) {
                $found = true;
                $playerData = [
                    'name' => $entry['name'],
                    'score' => $entry['score'],
                    'time' => $entry['time'] ?? null
                ];
                break;
            }
        }
        echo json_encode(['played' => $found, 'data' => $playerData]);
        break;

    case 'save_score':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !isset($input['name']) || !isset($input['score'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos faltantes']);
            break;
        }
        $scores = loadScores();
        $nameNorm = normalizeName($input['name']);
        foreach ($scores as $entry) {
            if (normalizeName($entry['name']) === $nameNorm) {
                echo json_encode(['error' => 'Ya jugaste', 'success' => false]);
                break 2;
            }
        }
        $scores[] = [
            'name' => mb_substr(trim($input['name']), 0, 20),
            'score' => intval($input['score']),
            'time' => isset($input['time']) ? intval($input['time']) : 0,
            'ip' => getClientIP(),
            'timestamp' => time()
        ];
        saveScores($scores);
        echo json_encode(['success' => true]);
        break;

    case 'get_podium':
        $scores = loadScores();
        usort($scores, function($a, $b) {
            if ($b['score'] !== $a['score']) {
                return $b['score'] - $a['score'];
            }
            return ($a['time'] ?? PHP_INT_MAX) - ($b['time'] ?? PHP_INT_MAX);
        });
        $podium = [];
        $top = array_slice($scores, 0, 3);
        foreach ($top as $entry) {
            $podium[] = [
                'name' => $entry['name'],
                'score' => $entry['score'],
                'time' => $entry['time'] ?? null
            ];
        }
        echo json_encode(['podium' => $podium, 'total' => count($scores)]);
        break;

    case 'delete_name':
        $name = isset($_GET['name']) ? $_GET['name'] : '';
        $nameNorm = normalizeName($name);
        $scores = loadScores();
        $filtered = [];
        foreach ($scores as $entry) {
            if (normalizeName($entry['name']) !== $nameNorm) {
                $filtered[] = $entry;
            }
        }
        saveScores($filtered);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Accion invalida']);
}

<?php
header('Content-Type: text/plain');
header('Content-Disposition: attachment; filename="lista_tareas.txt"');

// Obtener tareas desde el cuerpo de la solicitud POST
$tareas = json_decode(file_get_contents('php://input'), true);

// Validar datos
if (!is_array($tareas)) {
    die("Error: Datos inválidos para generar la lista de tareas.");
}

// Imprimir las tareas
foreach ($tareas as $tarea) {
    // Escapar datos para prevenir inyección de código
    $tareaEscapada = htmlspecialchars($tarea['tarea'], ENT_QUOTES, 'UTF-8');
    $colorEscapado = htmlspecialchars($tarea['color'], ENT_QUOTES, 'UTF-8');

    echo $tareaEscapada . " - " . $colorEscapado . "\n";
}
?>

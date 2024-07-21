<?php
header('Content-Type: text/plain');
header('Content-Disposition: attachment; filename="lista_tareas.txt"');

// Obtener tareas desde la cadena de consulta GET
$tareas = array_map(null, $_GET['tarea'], $_GET['color']); // Combina 'tarea' y 'color' en un array

// Validar datos (ajustado para GET)
if (empty($tareas)) {
    die("Error: No se encontraron tareas para descargar.");
}

// Imprimir las tareas (resto del código igual)
foreach ($tareas as $tarea) {
    $tareaEscapada = htmlspecialchars($tarea[0], ENT_QUOTES, 'UTF-8'); // Índice 0 para 'tarea'
    $colorEscapado = htmlspecialchars($tarea[1], ENT_QUOTES, 'UTF-8'); // Índice 1 para 'color'

    echo $tareaEscapada . " - " . $colorEscapado . "\n";
}
?>

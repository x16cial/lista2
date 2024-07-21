const { spawn } = require('child_process');

module.exports = async (req, res) => {
    const queryString = new URLSearchParams(req.url.split('?')[1]).toString();

    const phpProcess = spawn('php', ['descargar_tareas.php', queryString]);

    // Capturar la salida del proceso PHP
    let phpOutput = '';
    phpProcess.stdout.on('data', (data) => {
        phpOutput += data.toString();
    });

    // Manejar errores del proceso PHP
    phpProcess.stderr.on('data', (data) => {
        console.error(`Error en PHP: ${data.toString()}`);
        res.status(500).send('Error interno del servidor');
    });

    // Enviar la respuesta cuando el proceso PHP termine
    phpProcess.on('close', (code) => {
        if (code === 0) { // Éxito
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename="lista_tareas.txt"');
            res.send(phpOutput);
        } else {
            console.error(`Proceso PHP salió con código ${code}`);
            res.status(500).send('Error interno del servidor');
        }
    });
};

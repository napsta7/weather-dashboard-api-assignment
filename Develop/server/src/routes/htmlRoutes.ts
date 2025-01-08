import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
//🟦This serves the index.html file for all incoming requests
router.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

export default router;

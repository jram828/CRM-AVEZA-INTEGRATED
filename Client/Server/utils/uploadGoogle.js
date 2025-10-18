# Genera el codigo que permita recibir un archivo desde el frontend (React) y almacenarlo en mi base de datos de postgre

## Arquitectura General

Para recibir un archivo desde un frontend en React y almacenarlo en una base de datos PostgreSQL, necesitas:

- **Frontend (React):** Un formulario que permita al usuario seleccionar y enviar un archivo.
- **Backend (Node.js + Express):** Un servidor que reciba el archivo, lo procese y lo almacene en PostgreSQL.
- **Base de datos (PostgreSQL):** Una tabla preparada para guardar metadatos del archivo (nombre, tipo, tamaño, ruta, etc.) y, opcionalmente, el contenido binario del archivo (aunque lo habitual es guardar solo la ruta en el sistema de archivos y los metadatos en la BD).

A continuación, te muestro un ejemplo completo y funcional, paso a paso.

---

## Frontend: React (Subida de archivos)

```jsx
import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setIsUploading(true);
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Archivo subido con éxito');
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      alert('Error al subir el archivo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Subir Archivo</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Subiendo...' : 'Subir Archivo'}
      </button>
    </div>
  );
}

export default FileUpload;
```
Este componente permite seleccionar un archivo y enviarlo al backend mediante Axios, usando FormData para el envío multipart[5].

---

## Backend: Node.js + Express (Recibir y procesar el archivo)

```js
const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Configuración de PostgreSQL
const pool = new Pool({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'tu_basededatos',
  password: 'tu_contraseña',
  port: 5432,
});

// Endpoint para subir archivos
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se subió ningún archivo.');
  }

  const { originalname, mimetype, size, filename, path: filepath } = req.file;

  try {
    // Guardar metadatos en PostgreSQL
    const query = `
      INSERT INTO archivos (nombre_original, tipo_mime, tamaño, nombre_guardado, ruta)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    const values = [originalname, mimetype, size, filename, filepath];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Archivo subido y registrado correctamente',
      fileId: result.rows[0].id,
    });
  } catch (err) {
    console.error(err);
    // Eliminar el archivo subido si hay error en la BD
    fs.unlinkSync(filepath);
    res.status(500).send('Error al guardar el archivo en la base de datos.');
  }
});

app.listen(5000, () => {
  console.log('Servidor backend escuchando en http://localhost:5000');
});
```

**Explicación:**
- **Multer** maneja la subida de archivos y los guarda en una carpeta `uploads
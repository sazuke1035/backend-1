import fs from 'fs/promises';

 export const generateId = () => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    console.log(`Nuevo ID generado: ${id}`);
    return id;
};

// Función para leer archivos JSON de manera segura
export const readJSON = async (file) => {
    try {
        const data = await fs.readFile(file, 'utf-8');
        console.log(`Datos leídos de ${file}:`, data);
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al leer ${file}:`, error);
        return [];
    }
};

// Función para escribir datos en un archivo JSON
export const writeJSON = async (file, data) => {
    try {
        await fs.writeFile(file, JSON.stringify(data, null, 2));
        console.log(`Datos guardados en ${file}`);
    } catch (error) {
        console.error(`Error al escribir en ${file}:`, error);
    }
};
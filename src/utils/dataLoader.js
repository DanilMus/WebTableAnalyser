import Papa from "papaparse";
import { parse, isValid } from "date-fns";

/**
 * Валидирует CSV данные:
 * 1. Проверяет, что данные не пустые и содержат заголовки.
 * 2. Проверяет, что первый столбец содержит только даты в формате dd.MM.yyyy.
 * 
 * @param {Array} data - массив объектов, полученный после парсинга CSV
 * @throws {Error} если валидация не пройдена
 */
export function validateCSVData(data) {
    if (data.length === 0) {
        throw new Error("CSV файл пуст.");
    }
    const headers = Object.keys(data[0]);
    if (!headers || headers.length === 0) {
        throw new Error("CSV файл не содержит заголовков.");
    }
    const dateColumn = headers[0];
    const allDatesValid = data.every(row => {
        const dateStr = row[dateColumn];
        if (!dateStr) return false;
        const parsedDate = parse(dateStr, "dd.MM.yyyy", new Date());
        return isValid(parsedDate);
    });
    if (!allDatesValid) {
        throw new Error("Первый столбец должен содержать только даты в формате dd.MM.yyyy.");
    }
    return true;
}

/**
 * Функция загрузки и обработки CSV-файла.
 * Использует PapaParse для разбора текста и 
 * затем сначала валидирует данные, а потом обрабатывает их.
 * 
 * @param {String} csvPath - путь к CSV файлу
 * @returns {Array} обработанных данных
 */
export function loadCSVData(csvPath) {
    return fetch(csvPath)
        .then((response) => response.text())
        .then((csvText) => {
            const { data } = Papa.parse(csvText, { header: true }); // сам парсинг данных
            return processData(data); // отправка на обработку
        })
        .catch((error) => console.error("Ошибка загрузки CSV:", error));
}

/**
 * Функция обработки данных.
 * Преобразует данные из CSV, оставляя только заполненные строки,
 * преобразуя числовые значения и подсчитывая количество абзацев для текстовых значений.
 * 
 * @param {Array} data - валидированные данные CSV
 * @returns {Array} обработанных данных
 */
export function processData(data) {
    if (data.length === 0) return [];

    const headers = Object.keys(data[0]); // Заголовки столбцов
    const dateColumn = headers[0]; // Первый столбец — даты

    return data
        .filter((row) => row[dateColumn]?.trim()) // Убираем строки с пустой датой
        .map((row) => {
            const parsedRow = { date: row[dateColumn] }; // Дата
            headers.slice(1).forEach((col) => {
                const value = row[col];
                if (!isNaN(value) && value !== "") {
                    parsedRow[col] = Number(value); // Число
                } else {
                    parsedRow[col] = countParagraphs(value); // Строка и производим Подсчет абзацев
                }
            });
            return parsedRow;
        });
}

/**
 * Функция подсчёта абзацев в тексте.
 *
 * @param {String} text 
 * @returns {Number}
 */
export function countParagraphs(text) {
    return text ? text.split(/\n+/).length : 0;
}

import Papa from "papaparse";

// Функция загрузки и обработки CSV-файла
export function loadCSVData(csvPath) {
    return fetch(csvPath)
        .then((response) => response.text())
        .then((csvText) => {
            const { data } = Papa.parse(csvText, { header: true }); // сам парсинг данных
            return processData(data); // отправка на обработку
        })
        .catch((error) => console.error("Ошибка загрузки CSV:", error));
}

// Функция обработки данных
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

// Функция подсчёта новых строк (абзацев)
export function countParagraphs(text) {
    return text ? text.split(/\n+/).length : 0;
}

<script setup>
import { ref, defineEmits } from "vue";
import Papa from "papaparse"; // Библиотека для разбора CSV-файлов
import { processData, validateCSVData } from "@/utils/dataLoader.js"; // Импортируем функцию обработки данных

const emit = defineEmits(["fileLoaded"]); // Определяем событие, которое будет отправляться в App.vue
const fileInput = ref(null); // Создаём реактивную переменную для хранения ссылки на input (файл)

const handleFileUpload = (event) => {
    // Получаем загруженный файл
    const file = event.target.files[0]; 
    if (!file) return; // Если файл не выбран, выходим

    if (!file.name.toLowerCase().endsWith(".csv")) {
        alert("Пожалуйста, выберите CSV файл.");
        return;
    }

    const reader = new FileReader(); // Создаём объект для чтения файла
    reader.onload = (e) => {
        const csvText = e.target.result; // Получаем содержимое файла в виде текста
        const { data } = Papa.parse(csvText, { header: true }); // Используем PapaParse для разбора CSV в массив объектов

        // Валидируем CSV данные (проверка первого столбца)
        try {
            validateCSVData(data);
        } catch (error) {
            alert(error.message);
            return;
        }
        
        // Обрабатываем данные перед отправкой
        const processedData = processData(data);

        // Передаём обработанные данные вверх через событие "fileLoaded"
        emit("fileLoaded", processedData);
    };
    
    reader.readAsText(file); // Читаем файл как текст
};
</script>

<template>
    <div class="file-uploader">
        <label for="fileInput">Загрузить CSV</label>
        <input type="file" id="fileInput" ref="fileInput" accept=".csv" @change="handleFileUpload" />
    </div>
</template>

<style scoped>
.file-uploader {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

input[type="file"] {
    display: none;
}

label {
    padding: 10px 20px;
    background: var(--primary-color);
    color: var(--background-color);
    border: 2px solid var(--primary-color);
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

label:hover {
    background: var(--background-color);
    color: var(--primary-color);
    border-color: var(--primary-color);
}
</style>

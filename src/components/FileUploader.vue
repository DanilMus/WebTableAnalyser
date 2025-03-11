<script setup>
import { ref, defineEmits } from "vue";
import Papa from "papaparse"; // Библиотека для разбора CSV-файлов
import { processData } from "@/utils/dataLoader.js"; // Импортируем функцию обработки данных

const emit = defineEmits(["fileLoaded"]); // Определяем событие, которое будет отправляться в App.vue
const fileInput = ref(null); // Создаём реактивную переменную для хранения ссылки на input (файл)

const handleFileUpload = (event) => {
    // Получаем загруженный файл
    const file = event.target.files[0]; 
    if (!file) return; // Если файл не выбран, выходим

    const reader = new FileReader(); // Создаём объект для чтения файла
    reader.onload = (e) => {
        const csvText = e.target.result; // Получаем содержимое файла в виде текста
        
        // Используем PapaParse для разбора CSV в массив объектов
        const { data } = Papa.parse(csvText, { header: true });

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
        <input type="file" ref="fileInput" accept=".csv" @change="handleFileUpload" />
    </div>
</template>

<style scoped>
.file-uploader {
    margin-bottom: 20px;
}
</style>

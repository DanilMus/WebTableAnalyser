<script setup>
import { ref } from "vue";
import FileUploader from "@/components/FileUploader.vue";
import TableChart from "@/components/TableChart.vue";

const csvData = ref([]); // Реактивные данные для графика

// Функция обновления данных после загрузки файла
const handleFileData = (data) => {
    console.log("App.vue получил данные.");
    csvData.value = data; // Обновляем состояние данных с файла, которые дальше chartData зафиксирует
};
</script>

<template>
    <div>
        <h1>CSV Анализатор</h1>
        <FileUploader @fileLoaded="handleFileData" />
        <TableChart :chartData="csvData" />
    </div>
</template>

<style scoped>
/* Основной контейнер */
.app-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

/* Заголовок */
h1 {
    text-align: center;
    margin-bottom: 30px;
    color: var(--primary-color);
    font-size: 2.5rem;
    font-weight: bold;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}
</style>
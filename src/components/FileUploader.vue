<script setup>
import { ref, defineEmits } from "vue";
import Papa from "papaparse"; // Добавляем импорт papaparse
import { processData } from "@/utils/dataLoader.js"; // Импортируем функцию обработки данных

const emit = defineEmits(["fileLoaded"]); // Теперь Vue понимает, что мы объявляем событие
const fileInput = ref(null);

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const csvText = e.target.result;
        // console.log("Загруженный CSV текст:", csvText);
        
        const { data } = Papa.parse(csvText, { header: true }); // Теперь Papa точно работает
        // console.log("Парсинг CSV:", data);

        const processedData = processData(data);
        emit("fileLoaded", processedData);
    };
    
    reader.readAsText(file);
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

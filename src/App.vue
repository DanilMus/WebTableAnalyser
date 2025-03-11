<script setup>
import { ref } from "vue";
import FileUploader from "@/components/FileUploader.vue";
import TableChart from "@/components/TableChart.vue";

const csvData = ref([]); // Реактивные данные для графика

// Функция обновления данных после загрузки файла
const handleFileData = (data) => {
    console.log("App.vue получил данные:", data);
    csvData.value = data;
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
h1 {
    text-align: center;
    margin-bottom: 20px;
}
</style>

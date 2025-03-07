<script setup>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import { loadCSVData } from "@/utils/dataLoader.js"; // Функция загрузки данных

const chartRef = ref(null);
const chartData = ref([]); // Данные после обработки

onMounted(async () => {
    // Загружаем и обрабатываем данные
    chartData.value = await loadCSVData("Diary.csv");
    if (chartData.value.length > 0) {
        console.log("Обработанная строка данных:", JSON.parse(JSON.stringify(chartData.value[0])));
    }

    nextTick(() => {
        if (!chartRef.value || chartData.value.length === 0) return;

        const chart = echarts.init(chartRef.value);

        // Достаем даты и числовые данные
        const labels = chartData.value.map(row => row.date);
        const numericKeys = Object.keys(chartData.value[0]).filter(key => key !== "date");

        const series = numericKeys.map(key => ({
            name: key,
            type: "line",
            data: chartData.value.map(row => row[key]),
        }));

        chart.setOption({
            title: { text: "График из CSV" },
            tooltip: { trigger: "axis" },
            xAxis: { type: "category", data: labels },
            yAxis: { type: "value" },
            series,
        });
    });
});
</script>

<template>
    <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

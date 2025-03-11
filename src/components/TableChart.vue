<script setup>
import { defineProps, watch } from "vue";
import * as echarts from "echarts";
import { onMounted, ref } from "vue";

const props = defineProps({ chartData: Array }); // Получаем данные через пропсы
const chartRef = ref(null);

const updateChart = () => {
    console.log("Обновление графика...");

    if (!chartRef.value || !props.chartData.length) {
        console.log("Данных нет, график не обновляется.");
        return;
    }
    const chart = echarts.init(chartRef.value);
    
    const option = {
        title: { text: "График данных" },
        xAxis: { type: "category", data: props.chartData.map((row) => row.date) },
        yAxis: { type: "value" },
        series: Object.keys(props.chartData[0] || {})
            .filter((key) => key !== "date")
            .map((key) => ({
                name: key,
                type: "line",
                data: props.chartData.map((row) => row[key] || 0),
            })),
    };

    console.log("Опции графика:", option);
    chart.clear(); // Очищаем предыдущий график
    chart.setOption(option);
};

// Обновлять график при изменении данных
watch(() => props.chartData, (newData) => {
    console.log("Новые данные для графика:", newData);
    updateChart();
}, { deep: true });


onMounted(() => {
    console.log("chartRef:", chartRef.value);
    updateChart();
});
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

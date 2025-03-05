<script setup>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";

const chartRef = ref(null);

onMounted(() => {
    nextTick(() => {
        const chart = echarts.init(chartRef.value);
        chart.setOption({
            title: { text: "Пример графика" },
            tooltip: {},
            xAxis: { type: "category", data: ["Пн", "Вт", "Ср", "Чт", "Пт"] },
            yAxis: { type: "value" },
            series: [{ name: "Данные", type: "line", data: [120, 200, 150, 80, 70] }],
        });
    });
});
</script>

<template>
    <div ref= "chartRef" style= "width: 100%; height: 400px;"></div>
</template>
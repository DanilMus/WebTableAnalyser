<script setup>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";

const chartRef = ref(null);

onMounted(() => {
    nextTick(() => {
        const chart = echarts.init(chartRef.value);

        const gradient = {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
                { offset: 0, color: "rgba(0, 123, 255, 0.5)" },
                { offset: 1, color: "rgba(0, 123, 255, 0)" }
            ]
        };

        chart.setOption({
            title: { text: "График на ECharts", left: "center", textStyle: { fontSize: 18, fontWeight: "bold" } },
            tooltip: { trigger: "axis" },
            xAxis: {
                type: "category",
                data: ["Пн", "Вт", "Ср", "Чт", "Пт"],
                axisLine: { lineStyle: { color: "#ccc" } },
                axisLabel: { fontSize: 14 }
            },
            yAxis: { type: "value", axisLabel: { fontSize: 14 } },
            series: [{
                name: "Данные",
                type: "line",
                data: [120, 200, 150, 80, 70],
                smooth: true,
                lineStyle: { width: 4, color: "#007bff" },
                areaStyle: { color: gradient },
                symbolSize: 8,
                itemStyle: { color: "#007bff", borderWidth: 2, borderColor: "#fff" }
            }]
        });
    });
});
</script>

<template>
    <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

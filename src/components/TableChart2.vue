<script setup>
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const chartRef = ref(null);

onMounted(() => {
    if (!chartRef.value) return;

    new Chart(chartRef.value, {
        type: "line", // Тип графика
        data: {
            labels: ["Пн", "Вт", "Ср", "Чт", "Пт"],
            datasets: [
                {
                    label: "Данные",
                    data: [120, 200, 150, 80, 70],
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });
});
</script>

<template>
    <div style="width: 100%; height: 400px;">
        <canvas ref="chartRef"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const chartRef = ref(null);

onMounted(() => {
    if (!chartRef.value) return;

    new Chart(chartRef.value, {
        type: "line",
        data: {
            labels: ["Пн", "Вт", "Ср", "Чт", "Пт"],
            datasets: [{
                label: "Данные",
                data: [120, 200, 150, 80, 70],
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.3)",
                borderWidth: 3,
                tension: 0.4, // Делает линию сглаженной
                pointRadius: 6, // Размер точек
                pointBackgroundColor: "white",
                pointBorderWidth: 2,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { font: { size: 14 } } },
                tooltip: { backgroundColor: "rgba(0,0,0,0.7)", titleFont: { size: 16 }, bodyFont: { size: 14 } }
            },
            scales: {
                x: { ticks: { font: { size: 14 }, color: "#666" } },
                y: { ticks: { font: { size: 14 }, color: "#666" } }
            }
        }
    });
});
</script>

<template>
    <div style="width: 100%; height: 400px;">
        <canvas ref="chartRef"></canvas>
    </div>
</template>

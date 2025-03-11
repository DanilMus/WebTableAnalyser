<script setup>
import { defineProps, watch } from "vue";
import * as echarts from "echarts"; // Импортируем библиотеку для построения графиков
import { onMounted, ref } from "vue";

const props = defineProps({ chartData: Array }); // Получаем данные через пропсы
const chartRef = ref(null); // Ссылка на div, внутри которого будет график


// Обновление графика
const updateChart = () => {
    // Проверяем, есть ли данные и ссылка на элемент графика
    if (!chartRef.value || !props.chartData.length) {
        console.log("Данных нет, график не обновляется.");
        return;
    }

    const chart = echarts.init(chartRef.value); // Инициализируем ECharts в div

    const option = {
        title: { text: "График данных" }, // Заголовок графика
        tooltip: {
            trigger: "axis", // Показываем всплывающую подсказку при наведении на ось X
            axisPointer: { type: "line" } // Отображаем вертикальную линию при наведении
        },
        xAxis: { 
            type: "category", // Ось X — категориальная (текстовые метки)
            data: props.chartData.map((row) => row.date) // Берём даты из данных
        },
        yAxis: { type: "value" }, // Ось Y — числовая
        legend: { show: true }, // Показываем легенду (названия линий на графике)
        series: Object.keys(props.chartData[0] || {})
            .filter((key) => key !== "date") // Исключаем "date" из значений
            .map((key) => ({
                name: key, // Название линии в легенде
                type: "line", // График линейный
                data: props.chartData.map((row) => row[key] || 0), // Данные по оси Y
                smooth: true, // Делаем линии плавными
            })),
    };

    console.log("Опции графика:", option);

    chart.clear(); // Очищаем предыдущий график перед обновлением
    chart.setOption(option); // Устанавливаем новые данные
};

// Обновлять график при изменении данных
watch(() => props.chartData, () => {
    updateChart();
}, { deep: true });


onMounted(() => {
    updateChart(); // Строим график при первом рендере
});
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

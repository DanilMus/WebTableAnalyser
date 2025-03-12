<script setup>
import { defineProps, watch, computed } from "vue";
import * as echarts from "echarts"; // Импортируем библиотеку для построения графиков
import { onMounted, ref } from "vue";

const props = defineProps({ chartData: Array }); // Получаем данные через пропсы
const chartRef = ref(null); // Ссылка на div, внутри которого будет график

// Храним список включённых столбцов (по умолчанию все)
const selectedColumns = ref([]);

// Вычисляем доступные столбцы (исключая "date")
const availableColumns = computed(() => {
    if (!props.chartData.length) return [];
    return Object.keys(props.chartData[0]).filter((key) => key !== "date");
});


// Следим за тем, загружена ли новая таблица для анализа или нет
watch(() => props.chartData, (newData) => {
    if (newData.length) {
        selectedColumns.value = [...availableColumns.value]; // Включаем все столбцы
    }
    updateChart();
}, { deep: true });


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
        series: selectedColumns.value.map((key) => ({
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

// Следим за изменением выбранных столбцов и обновляем график
watch(selectedColumns, updateChart, { deep: true });

// Строим график при первом рендере
onMounted(updateChart);
</script>

<template>
    <div>
        <div class="column-selector">
            <label v-for="column in availableColumns" :key="column">
                <input type="checkbox" v-model="selectedColumns" :value="column" />
                {{ column }}
            </label>
        </div>

        <div ref="chartRef" style="width: 100%; height: 400px;"></div>
    </div>
</template>


<style scoped>
.column-selector {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
label {
    cursor: pointer;
}
</style>
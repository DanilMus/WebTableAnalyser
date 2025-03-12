<script setup>
import { defineProps, watch, computed } from "vue";
import * as echarts from "echarts"; // Импортируем библиотеку для построения графиков
import { onMounted, ref } from "vue";
import dayjs from "dayjs"; // Для работы с датами
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const props = defineProps({ chartData: Array }); // Получаем данные через пропсы
const chartRef = ref(null); // Ссылка на div, внутри которого будет график
const selectedColumns = ref([]); // Храним список включённых столбцов (по умолчанию все)
const selectedPeriod = ref("all"); // Выбранный временной диапазон

// Вычисляем доступные столбцы (исключая "date")
const availableColumns = computed(() => {
    if (!props.chartData.length) return [];
    return Object.keys(props.chartData[0]).filter((key) => key !== "date");
});

// Фильтрация данных по выбранному периоду
const filteredData = computed(() => {
    if (!props.chartData.length) return [];
    if (selectedPeriod.value === "all") return props.chartData;

    const now = dayjs();
    let startDate, endDate;

    switch (selectedPeriod.value) {
        case "this_week":
            startDate = now.startOf("week");
            endDate = now.endOf("week");
            break;
        case "last_week":
            startDate = now.subtract(1, "week").startOf("week");
            endDate = now.subtract(1, "week").endOf("week");
            break;
        case "this_month":
            startDate = now.startOf("month");
            endDate = now.endOf("month");
            break;
        case "last_month":
            startDate = now.subtract(1, "month").startOf("month");
            endDate = now.subtract(1, "month").endOf("month");
            break;
        case "this_quarter":
            startDate = now.startOf("quarter");
            endDate = now.endOf("quarter");
            break;
        case "last_quarter":
            startDate = now.subtract(1, "quarter").startOf("quarter");
            endDate = now.subtract(1, "quarter").endOf("quarter");
            break;
        case "this_year":
            startDate = now.startOf("year");
            endDate = now.endOf("year");
            break;
        case "last_year":
            startDate = now.subtract(1, "year").startOf("year");
            endDate = now.subtract(1, "year").endOf("year");
            break;
        default:
            return props.chartData;
    }

    return props.chartData.filter((row) => {
        const date = dayjs(row.date);
        return date.isBetween(startDate, endDate, null, "[]");
    });
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
    if (!chartRef.value || !filteredData.value.length) {
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
            data: filteredData.value.map((row) => row.date) // Берём даты из данных
        },
        yAxis: { type: "value" }, // Ось Y — числовая
        legend: { show: true }, // Показываем легенду (названия линий на графике)
        series: selectedColumns.value.map((key) => ({
                name: key, // Название линии в легенде
                type: "line", // График линейный
                data: filteredData.value.map((row) => row[key] || 0), // Данные по оси Y
                smooth: true, // Делаем линии плавными
        })),
    };

    chart.clear(); // Очищаем предыдущий график перед обновлением
    chart.setOption(option); // Устанавливаем новые данные
};

// Следим за изменением выбранного периода и обновляем график
watch(selectedPeriod, () => {
    console.log("Выбранный период изменён:", selectedPeriod.value);
    updateChart();
});


// Следим за изменением выбранных столбцов и обновляем график
watch(selectedColumns, updateChart, { deep: true });

// Строим график при первом рендере
onMounted(updateChart);
</script>

<template>
    <div>
        <div class="filters">
            <button @click="selectedPeriod = 'this_week'">Эта неделя</button>
            <button @click="selectedPeriod = 'last_week'">Прошлая неделя</button>
            <button @click="selectedPeriod = 'this_month'">Этот месяц</button>
            <button @click="selectedPeriod = 'last_month'">Прошлый месяц</button>
            <button @click="selectedPeriod = 'this_quarter'">Этот квартал</button>
            <button @click="selectedPeriod = 'last_quarter'">Прошлый квартал</button>
            <button @click="selectedPeriod = 'this_year'">Этот год</button>
            <button @click="selectedPeriod = 'last_year'">Прошлый год</button>
            <button @click="selectedPeriod = 'all'">Весь период</button>
        </div>

        <div>
            <div class="column-selector">
                <label v-for="column in availableColumns" :key="column">
                    <input type="checkbox" v-model="selectedColumns" :value="column" />
                    {{ column }}
                </label>
            </div>

            <div ref="chartRef" style="width: 100%; height: 400px;"></div>
        </div>
    </div>
</template>


<style scoped>
.filters {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}
button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background: #f8f8f8;
    cursor: pointer;
}
button:hover {
    background: #e0e0e0;
}
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
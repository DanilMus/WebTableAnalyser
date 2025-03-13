<script setup>
import { defineProps, watch, computed, nextTick } from "vue";
import * as echarts from "echarts"; // Импортируем библиотеку для построения графиков
import { onMounted, ref } from "vue";
// Для работы с датами
import { parse, isValid, isWithinInterval, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths, startOfQuarter, endOfQuarter, subQuarters, startOfYear, endOfYear, subYears } from "date-fns";




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

    const now = new Date();
    let startDate, endDate;

    switch (selectedPeriod.value) {
        case "this_week":
            startDate = startOfWeek(now, { weekStartsOn: 1 });
            endDate = endOfWeek(now, { weekStartsOn: 1 });
            break;
        case "last_week":
            startDate = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
            endDate = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
            break;
        case "this_month":
            startDate = startOfMonth(now);
            endDate = endOfMonth(now);
            break;
        case "last_month":
            startDate = startOfMonth(subMonths(now, 1));
            endDate = endOfMonth(subMonths(now, 1));
            break;
        case "this_quarter":
            startDate = startOfQuarter(now);
            endDate = endOfQuarter(now);
            break;
        case "last_quarter":
            startDate = startOfQuarter(subQuarters(now, 1));
            endDate = endOfQuarter(subQuarters(now, 1));
            break;
        case "this_year":
            startDate = startOfYear(now);
            endDate = endOfYear(now);
            break;
        case "last_year":
            startDate = startOfYear(subYears(now, 1));
            endDate = endOfYear(subYears(now, 1));
            break;
        default:
            return props.chartData;
    }

    return props.chartData.filter((row) => {
        const date = parse(row.date, "dd.MM.yyyy", new Date());
        return isValid(date) && isWithinInterval(date, { start: startDate, end: endDate });
    });
});


// Обновление графика
const updateChart = async () => {
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

    await nextTick(); // Ждем обновления реактивных данных
    chart.clear(); // Очищаем предыдущий график перед обновлением
    chart.setOption(option); // Устанавливаем новые данные
};

// Следим за тем, загружена ли новая таблица для анализа или нет
watch(() => props.chartData, (newData) => {
    if (newData.length) {
        selectedColumns.value = [...availableColumns.value]; // Включаем все столбцы
        updateChart();
    }
}, { deep: true });

// Следим за изменением периода и столбцов
watch([selectedPeriod, selectedColumns], () => {
    updateChart();
}, { deep: true });

// Строим график при первом рендере
onMounted(updateChart);
</script>

<template>
    <div>
        <!-- Кнопки для выбора периода -->
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
        
        <!-- Секция выбора столбцов и графика-->
        <div>
            <!-- Перебор доступных столбцов -->
            <div class="column-selector">
                <label v-for="column in availableColumns" :key="column">
                    <input type="checkbox" v-model="selectedColumns" :value="column" />
                    {{ column }}
                </label>
            </div>
            
            <!-- График -->
            <div ref="chartRef" style="width: 100%; height: 400px;"></div>
        </div>
    </div>
</template>


<style scoped>
/* Стили для фильтров */
.filters {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

/* Стили для кнопок */
button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background: #f8f8f8;
    cursor: pointer;
}

/* Эффект при наведении на кнопку */
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
<script setup>
import { defineProps, watch, computed, ref } from "vue";
import { parse, isValid, isWithinInterval, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths, startOfQuarter, endOfQuarter, subQuarters, startOfYear, endOfYear, subYears } from "date-fns"; // Для работы с датами

// Свои модули
import { updateChart } from "@/utils/chartBuilder.js";


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


// Следим за тем, загружена ли новая таблица для анализа или нет
watch(() => props.chartData, (newData) => {
    if (newData.length) {
        selectedColumns.value = [...availableColumns.value]; // Включаем все столбцы
        updateChart(chartRef, filteredData, selectedColumns);
    }
}, { deep: true });

// Следим за изменением периода и столбцов
watch([selectedPeriod, selectedColumns], () => {
    updateChart(chartRef, filteredData, selectedColumns);
}, { deep: true });
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
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
}

/* Стили для кнопок */
button {
    padding: 10px 15px;
    border: 2px solid var(--primary-color);
    background: var(--background-color);
    color: var(--text-color);
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* Эффект при наведении на кнопку */
button:hover {
    background: var(--primary-color);
    color: var(--background-color);
    border-color: var(--primary-color);
}

/* Секция выбора столбцов */
.column-selector {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
}

.column-selector label {
    cursor: pointer;
    color: var(--text-color);
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
}

/* Стили для чекбоксов */
input[type="checkbox"] {
    accent-color: var(--primary-color);
    width: 16px;
    height: 16px;
}

/* График */
.chart-container {
    width: 100%;
    height: 400px;
    border: 2px solid var(--primary-color);
    border-radius: 10px;
    background: var(--background-color);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}
</style>
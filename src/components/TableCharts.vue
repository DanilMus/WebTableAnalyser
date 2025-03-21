<script setup>
import { defineProps, watch, computed, ref } from "vue";
import { useToast } from "vue-toastification"; // Импорт уведомлений
// Свои модули
import { 
    updateChart, updateSummaryChart, updatePercentChangeChart,
    getAvailableColumns, filterDataPeriod 
} 
from "@/utils/chartsBuilder.js";

const toast = useToast(); // Инициализация уведомлений
const props = defineProps({ chartData: Array }); // Получаем данные через пропсы
const chartRef = ref(null); // Ссылка на div, внутри которого будет график
const selectedColumns = ref([]); // Храним список включённых столбцов (по умолчанию все)
const summaryChartRef = ref(null); // Ссылка на контейнер диаграммы сводки
const percentChangeChartRef = ref(null); // Контейнер для диаграммы процентных изменений
const selectedPeriod = ref("all"); // Выбранный временной диапазон
// Вычисляем доступные столбцы (исключая "date")
const availableColumns = computed(() => getAvailableColumns(props.chartData));
// Фильтрация данных по выбранному периоду
const filteredDataPeriod = computed(() => filterDataPeriod(props.chartData, selectedPeriod.value));


// Следим за тем, загружена ли новая таблица для анализа или нет
watch(() => props.chartData, (newData) => {
    if (newData.length) {
        selectedColumns.value = [...availableColumns.value]; // Включаем все столбцы
        updateChart(chartRef, filteredDataPeriod, selectedColumns, toast);
        updateSummaryChart(summaryChartRef, filteredDataPeriod, selectedColumns, toast);
        updatePercentChangeChart(percentChangeChartRef, filteredDataPeriod, selectedColumns, toast);
    }
}, { deep: true });

// Следим за изменением периода и столбцов
watch([selectedPeriod, selectedColumns], () => {
    updateChart(chartRef, filteredDataPeriod, selectedColumns, toast);
    updateSummaryChart(summaryChartRef, filteredDataPeriod, selectedColumns, toast);
    updatePercentChangeChart(percentChangeChartRef, filteredDataPeriod, selectedColumns, toast);
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

        <!-- Перебор доступных столбцов -->
        <div class="column-selector">
                <label v-for="column in availableColumns" :key="column">
                    <input type="checkbox" v-model="selectedColumns" :value="column" />
                    {{ column }}
                </label>
            </div>
        
        <!-- Секция выбора столбцов и графика-->
        <div class="chart-section">
            <h2 class="chart-title">Главный график</h2>
            <!-- График -->
            <div ref="chartRef" style="width: 100%; height: 400px;"></div>
        </div>

        <!-- Диаграмма сводки (min, avg, max) -->
        <div class="chart-section">
            <h2 class="chart-title">Сводные данные</h2>
            <div ref="summaryChartRef" style="width: 100%; height: 400px;"></div>
        </div>

        <!-- Диаграмма процентных изменений -->
        <div class="chart-section">
            <h2 class="chart-title">График в процентном изменении</h2>
            <div ref="percentChangeChartRef" style="width: 100%; height: 400px;"></div>
        </div>
    </div>
</template>

<style scoped>
/* Общие стили для контейнеров */
.filters, .column-selector {
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

/* Стили для чекбоксов */
.column-selector label {
    cursor: pointer;
    color: var(--text-color);
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
}

/* Стили для лейблов чекбоксов */
input[type="checkbox"] {
    accent-color: var(--primary-color);
    width: 16px;
    height: 16px;
}

/* Стили для секций с графиками */
.chart-section {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid var(--primary-color);
    border-radius: 10px;
    background: var(--background-color);
}

/* Стили для заголовков графиков */
.chart-title {
    text-align: center;
    color: var(--text-color);
    margin-bottom: 20px;
    font-size: 1.5em;
}
</style>
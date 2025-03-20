<script setup>
import { defineProps, watch, computed, ref } from "vue";

// Свои модули
import { updateChart, getAvailableColumns, filterDataPeriod } from "@/utils/chartBuilder.js";


const props = defineProps({ chartData: Array }); // Получаем данные через пропсы
const chartRef = ref(null); // Ссылка на div, внутри которого будет график
const selectedColumns = ref([]); // Храним список включённых столбцов (по умолчанию все)
const selectedPeriod = ref("all"); // Выбранный временной диапазон

// Вычисляем доступные столбцы (исключая "date")
const availableColumns = computed(() => getAvailableColumns(props.chartData));

// Фильтрация данных по выбранному периоду
const filteredDataPeriod = computed(() => filterDataPeriod(props.chartData, selectedPeriod.value));


// Следим за тем, загружена ли новая таблица для анализа или нет
watch(() => props.chartData, (newData) => {
    if (newData.length) {
        selectedColumns.value = [...availableColumns.value]; // Включаем все столбцы
        updateChart(chartRef, filteredDataPeriod, selectedColumns);
    }
}, { deep: true });

// Следим за изменением периода и столбцов
watch([selectedPeriod, selectedColumns], () => {
    updateChart(chartRef, filteredDataPeriod, selectedColumns);
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
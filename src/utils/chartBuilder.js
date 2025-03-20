import * as echarts from "echarts"; // Библиотеку для построения графиков
import { nextTick } from "vue"; 


/**
 * Функция для обновления графика
 * @param {HTMLElement} chartRef - Ссылка на DOM-элемент для графика
 * @param {Array} filteredData - Отфильтрованные данные для графика
 * @param {Array} selectedColumns - Выбранные столбцы для отображения
 */
export const updateChart = async (chartRef, filteredData, selectedColumns) => {
    // Проверяем, есть ли данные и ссылка на элемент графика
    if (!chartRef.value) {
        console.error("chartRef не инициализирован.");
        return;
    }
    if (!filteredData.value.length) {
        console.log("Данных нет, график не обновляется.");
        return;
    }

    const chart = echarts.init(chartRef.value); // Инициализируем ECharts в div

    const option = {
        tooltip: {
            trigger: "axis", // Показываем всплывающую подсказку при наведении на ось X
            axisPointer: { type: "line" } // Отображаем вертикальную линию при наведении
        },
        xAxis: { 
            type: "category", // Ось X — категориальная (текстовые метки)
            data: filteredData.value.map((row) => row.date) // Берём даты из данных
        },
        yAxis: { type: "value" }, // Ось Y — числовая
        legend: { show: false }, // Показываем легенду (названия линий на графике)
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
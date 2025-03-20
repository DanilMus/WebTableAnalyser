import * as echarts from "echarts"; // Библиотеку для построения графиков
import { nextTick } from "vue"; 
import { 
    parse, isValid, isWithinInterval, 
    startOfWeek, endOfWeek, subWeeks, 
    startOfMonth, endOfMonth, subMonths, 
    startOfQuarter, endOfQuarter, subQuarters, 
    startOfYear, endOfYear, subYears 
} from "date-fns"; // Для работы с датами

/**
 * Возвращает список доступных столбцов (без "date")
 * @param {Array} chartData 
 * @returns {Array}
 */
export const getAvailableColumns = (chartData) => {
    if (!chartData.length) return [];
    return Object.keys(chartData[0]).filter((key) => key !== "date");
};

/**
 * Фильтрует данные по выбранному периоду
 * @param {Array} chartData 
 * @param {String} period 
 * @returns {Array}
 */
export const filterDataPeriod = (chartData, period) => {
    if (!chartData.length) return [];
    if (period === "all") return chartData;

    const now = new Date();
    let startDate, endDate;

    switch (period) {
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
                return chartData;
        }
    
    return chartData.filter((row) => {
        const date = parse(row.date, "dd.MM.yyyy", new Date());
        return isValid(date) && isWithinInterval(date, { start: startDate, end: endDate });
    });
};

/**
 * Функция для обновления графика
 * @param {HTMLElement} chartRef - Ссылка на DOM-элемент для графика
 * @param {Array} filteredDataPeriod - Отфильтрованные данные для графика
 * @param {Array} selectedColumns - Выбранные столбцы для отображения
 */
export const updateChart = async (chartRef, filteredDataPeriod, selectedColumns) => {
    // Проверяем, есть ли данные и ссылка на элемент графика
    if (!chartRef.value) {
        console.error("chartRef не инициализирован.");
        return;
    }
    if (!filteredDataPeriod.value.length) {
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
            data: filteredDataPeriod.value.map((row) => row.date) // Берём даты из данных
        },
        yAxis: { type: "value" }, // Ось Y — числовая
        legend: { show: false }, // Показываем легенду (названия линий на графике)
        series: selectedColumns.value.map((key) => ({
                name: key, // Название линии в легенде
                type: "line", // График линейный
                data: filteredDataPeriod.value.map((row) => row[key] || 0), // Данные по оси Y
                smooth: true, // Делаем линии плавными
        })),
    };

    await nextTick(); // Ждем обновления реактивных данных
    chart.clear(); // Очищаем предыдущий график перед обновлением
    chart.setOption(option); // Устанавливаем новые данные
};
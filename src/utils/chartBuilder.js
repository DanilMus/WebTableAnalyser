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
 * @param {Object} [notify] - Объект уведомлений
 */
export const updateChart = async (chartRef, filteredDataPeriod, selectedColumns, notify) => {
    // Проверяем, есть ли данные и ссылка на элемент графика
    if (!chartRef.value) {
        console.error("chartRef не инициализирован.");
        return;
    }
    if (!filteredDataPeriod.value.length) {
        if (notify) notify.error("Данных нет, график не обновляется.");
        else console.log("Данных нет, график не обновляется.");
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


/**
 * Обновляет диаграмму сводки (min, avg, max) для выбранных столбцов
 * @param {HTMLElement} summaryChartRef - Ссылка на DOM-элемент для сводной диаграммы
 * @param {Array} filteredDataPeriod - Отфильтрованные данные для графика
 * @param {Array} selectedColumns - Выбранные столбцы для отображения
 * @param {Object} [notify] - Объект уведомлений
 */
export const updateSummaryChart = async (summaryChartRef, filteredDataPeriod, selectedColumns, notify) => {
    if (!summaryChartRef.value) {
        console.error("summaryChartRef не инициализирован.");
        return;
    }

    const stats = {};
    selectedColumns.value.forEach(col => {
        const values = filteredDataPeriod.value
            .map((row) => row[col])
            .filter((val) => typeof val === "number");

        if (values.length) {
            stats[col] = {
                min: Math.min(...values),
                max: Math.max(...values),
                avg: values.reduce((sum, v) => sum + v, 0) / values.length
            };
        }
    });

    const columns = Object.keys(stats);
    if (!columns.length) {
        if (notify) notify.error("Нет данных для сводной диаграммы.");
        else console.log("Нет данных для сводной диаграммы.");
        return;
    }

    const minValues = [];
    const avgValues = [];
    const maxValues = [];
    
    columns.forEach(col => {
        minValues.push(stats[col].min);
        avgValues.push(stats[col].avg);
        maxValues.push(stats[col].max);
    });
    
    const chart = echarts.init(summaryChartRef.value);
    
    const option = {
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" }
        },
        xAxis: {
            type: "category",
            data: columns,
            axisTick: { alignWithLabel: true }
        },
        yAxis: {
            type: "value"
        },
        series: [
            {
                name: "Min",
                type: "bar",
                data: minValues
            },
            {
                name: "Avg",
                type: "bar",
                data: avgValues
            },
            {
                name: "Max",
                type: "bar",
                data: maxValues
            }
        ]
    };
    
    await nextTick();
    chart.clear();
    chart.setOption(option);
};


/**
 * Обновляет диаграмму процентных изменений для выбранных столбцов.
 * Для каждого столбца вычисляется процентное изменение между последним и предпоследним значениями.
 * Если предыдущие данные равны 0 или отсутствуют, процентное изменение считается равным 0.
 * @param {HTMLElement} changeChartRef - Ссылка на DOM-элемент для диаграммы процентных изменений
 * @param {Array} filteredDataPeriod - Отфильтрованные данные для графика
 * @param {Array} selectedColumns - Выбранные столбцы для отображения
 * @param {Object} [notify] - Объект уведомлений
 */
export const updatePercentChangeChart = async (changeChartRef, filteredDataPeriod, selectedColumns, notify) => {
    if (!changeChartRef.value) {
        console.error("changeChartRef не инициализирован.");
        return;
    }

    if (filteredDataPeriod.value.length < 2) {
        if (notify) notify.error("Недостаточно данных для вычисления процентных изменений.");
        else console.log("Нет данных для вычисления процентных изменений.");
        return;
    }

    // Используем данные без сортировки (предполагается, что они уже хронологические)
    const data = filteredDataPeriod.value;
    const xData = data.slice(1).map(row => row.date); // Даты начиная со второй записи

    const series = selectedColumns.value.map(column => ({
        name: column,
        type: "line",
        data: data.slice(1).map((row, index) => {
            const prev = Number(data[index][column]) || 0;
            const curr = Number(row[column]) || 0;
            return prev !== 0 ? (curr / prev) * 100 : 0;
        }),
        smooth: true
    }));

    const chart = echarts.init(changeChartRef.value);
    const option = {
        tooltip: {
            trigger: "axis",
            formatter: function(params) {
                return params.map(p => `${p.seriesName}: ${p.value.toFixed(2)}%`).join("<br/>");
            }
        },
        xAxis: {
            type: "category",
            data: xData
        },
        yAxis: {
            type: "value",
            axisLabel: {
                formatter: "{value}%"
            }
        },
        series: series
    };

    await nextTick();
    chart.clear();
    chart.setOption(option);
};
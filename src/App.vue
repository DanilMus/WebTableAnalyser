<script setup>
import TableChart from './components/TableChart.vue';
import TableChart2 from './components/TableChart2.vue';
</script>

<template>
    <div>
        <h1> График данных (echarts)</h1>
        <TableChart />
    </div>
    <div>
        <h1>График данных (Chart.js)</h1>
        <TableChart2 />
    </div>
</template>






<!-- <template>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
    name: 'App',
    components: {
        HelloWorld
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style> -->

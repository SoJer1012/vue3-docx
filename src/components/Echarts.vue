<template>
  <div class="orderEcharts">
    <div ref="myChart" :style="{ width: '100%' }"></div>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  options: {
    type: Object,
    default: () => {},
  },
});
const { options } = toRefs(props);
let instance = null;
const myChart = ref();

const drawChart = () => {
  if (!options.value) return;
  // 基于准备好的dom，初始化echarts实例
  instance = echarts.init(myChart.value);
  // 绘制图表
  instance.setOption(options.value);
  //自适应
  window.addEventListener("resize", () => {
    instance.resize();
  });
};
// 获取图表base64图
const getChartImg = () => {
  return instance.getDataURL({
    pixelRatio: 2, // 解决模糊
    backgroundColor: "#fff",
  });
};

onMounted(() => {
  drawChart();
});

onBeforeUnmount(() => {
  if (instance?.id) {
    instance?.dispose();
  }
  window.removeEventListener("onresize", () => {
    instance.resize();
  });
});

watch(
  () => options.value,
  () => {
    if (!instance) {
      // 基于准备好的dom，初始化echarts实例
      instance = echarts.init(myChart.value);
    }
    // 绘制图表
    nextTick(() => {
      instance.setOption(options.value);
    });
  },
  {
    deep: true,
  }
);

defineExpose({
  getChartImg,
});
</script>

<style scoped>
.orderEcharts {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  color: black !important;
}
</style>

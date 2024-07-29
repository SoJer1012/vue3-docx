<template>
  <div id="app">
    <div class="chart-box">
      <Echart ref="chart" :options="options" />
    </div>
    <n-button type="primary" @click="exportWord">下载word</n-button>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import { NButton } from "naive-ui";
import {
  docxtemplater,
  PizZip,
  JSZipUtils,
  saveAs,
  ImageModule,
} from "@/utils";
import Echart from "@/components/Echarts.vue";

// 文档数据
const wordData = ref({
  projectName: "测试项目",
  type: "测试类型",
});
const table = ref([
  {
    i: 0,
    x: "测试",
    x1: "男",
    z: "测试",
    n: 18,
  },
  {
    i: 1,
    x: "测试2",
    x1: "女",
    z: "测试",
    n: 18,
  },
]);
const chart = ref();
const options = ref({});

// 导出文件名字
const exportFileName = "导出名字";
// 模版文件名字

// 导出echarts图片，格式转换
const base64DataURLToArrayBuffer = (dataURL) => {
  const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
  if (!base64Regex.test(dataURL)) {
    return false;
  }
  const stringBase64 = dataURL.replace(base64Regex, "");
  let binaryString;
  if (typeof window !== "undefined") {
    binaryString = window.atob(stringBase64);
  } else {
    binaryString = new Buffer(stringBase64, "base64").toString("binary");
  }
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes.buffer;
};

// 导出文档
const exportWord = () => {
  // 存放echarts 图表 base64图片数组
  const chartImg = [];
  // 读取并获得模板文件的二进制内容
  JSZipUtils.getBinaryContent("templateFile.docx", (error, content) => {
    if (error) {
      // 抛出异常
      throw error;
    }
    const zip = new PizZip(content); // 创建一个JSZip实例，内容为模板的内容
    const doc = new docxtemplater();
    doc.loadZip(zip); // 创建并加载docxtemplater实例对象
    chartImg.push({ image: chart.value.getChartImg() });
    // 图片处理
    const opts = {};
    opts.centered = true; // 图片居中，在word模板中定义方式为{%%image}
    opts.fileType = "docx";
    opts.getImage = (chartId) => {
      return base64DataURLToArrayBuffer(chartId);
    };
    opts.getSize = () => {
      return [600, 350];
    };
    const imageModule = new ImageModule(opts);
    doc.attachModule(imageModule);
    // 设置模板变量的值
    doc.setData({ ...wordData.value, chartImg, table: table.value });
    try {
      doc.render(); // 用模板变量的值替换所有模板变量
    } catch (error) {
      const e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
      };
      console.log(JSON.stringify({ error: e }));
      throw error; // 抛出异常
    }
    // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    // 将目标文件对象保存为目标类型的文件，并命名
    saveAs(out, `${exportFileName}.docx`);
  });
};

onMounted(() => {
  options.value = {
    title: {
      text: "2019年销售水量和主营业务收入对比",
      textStyle: {
        align: "center",
        color: "#fff",
        fontSize: 20,
      },
      top: "3%",
      left: "10%",
    },
    backgroundColor: "#0f375f",
    grid: {
      top: "25%",
      bottom: "10%", //也可设置left和right设置距离来控制图表的大小
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        label: {
          show: true,
        },
      },
    },
    legend: {
      data: ["销售水量", "主营业务"],
      top: "15%",
      textStyle: {
        color: "#ffffff",
      },
    },
    xAxis: {
      data: [
        "当年完成水量",
        "去年同期水量",
        "滚动目标值水量",
        "全年目标值水量",
        "当年完成金额",
        "去年同期金额",
        "滚动目标金额",
        "全年目标值",
      ],
      axisLine: {
        show: true, //隐藏X轴轴线
        lineStyle: {
          color: "#01FCE3",
        },
      },
      axisTick: {
        show: true, //隐藏X轴刻度
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: "#ebf8ac", //X轴文字颜色
        },
      },
    },
    yAxis: [
      {
        type: "value",
        name: "亿元",
        nameTextStyle: {
          color: "#ebf8ac",
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: true,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#FFFFFF",
          },
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#ebf8ac",
          },
        },
      },
      {
        type: "value",
        name: "同比",
        nameTextStyle: {
          color: "#ebf8ac",
        },
        position: "right",
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          formatter: "{value} %", //右侧Y轴文字显示
          textStyle: {
            color: "#ebf8ac",
          },
        },
      },
      {
        type: "value",
        gridIndex: 0,
        min: 50,
        max: 100,
        splitNumber: 8,
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ["rgba(250,250,250,0.0)", "rgba(250,250,250,0.05)"],
          },
        },
      },
    ],
    series: [
      {
        name: "销售水量",
        type: "line",
        yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
        smooth: true, //平滑曲线显示
        showAllSymbol: true, //显示所有图形。
        symbol: "circle", //标记的图形为实心圆
        symbolSize: 10, //标记的大小
        itemStyle: {
          //折线拐点标志的样式
          color: "#058cff",
        },
        lineStyle: {
          color: "#058cff",
        },
        areaStyle: {
          color: "rgba(5,140,255, 0.2)",
        },
        data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5],
      },
      {
        name: "主营业务",
        type: "bar",
        barWidth: 15,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#00FFE3",
              },
              {
                offset: 1,
                color: "#4693EC",
              },
            ]),
          },
        },
        data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5],
      },
    ],
  };
});
</script>
<style scoped>
#app {
  height: 100vh;
  background-color: #fff;
  text-align: center;
}
</style>

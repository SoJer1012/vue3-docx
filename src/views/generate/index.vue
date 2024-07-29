<template>
  <n-spin :show="loading" style="height: 100%">
    <div class="flex justify-center">
      <word-form />
    </div>
  </n-spin>
</template>
<script setup>
import { ref } from "vue";
import { NSpin } from "naive-ui";
import WordForm from "@/components/Word.vue";

const loading = ref(true);

// 模拟获取数据
const getContent = () => {
  // 模拟获取数据
  new Promise((resolve) => {
    resolve();
  }).then(() => {
    loading.value = false;
  });
};

getContent();
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverrides"
  >
    <app-provider>
      <router-view />
    </app-provider>
  </n-config-provider>
</template>
<script setup>
import { NConfigProvider, zhCN, dateZhCN } from "naive-ui";
import { AppProvider } from "@/components/Application";

const themeOverrides = {
  common: {
    primaryColor: "#2080f0",
    primaryColorHover: "#4098fc",
    primaryColorPressed: "#1060c9",
    primaryColorSuppl: "#4098fc",
  },
};
</script>
<style scoped>
.n-config-provider {
  width: 100%;
  height: 100%;
}
</style>

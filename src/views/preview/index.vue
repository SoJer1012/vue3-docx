<template>
  <document v-if="hasAuth" :id="reportId" @back="back" />
</template>
<script setup>
import { computed } from "vue";
import Document from "@/components/Document.vue";
import { usePermission } from "@/hooks/usePermission";

const { hasAuth, token, route, router } = usePermission();
const reportId = computed(() => route.query?.id ?? null);

// 跳转页面
const back = () => {
  if (!token.value) {
    window.$message.error("token不存在");
    return;
  }
  router.push({
    path: "/",
    query: {
      token: token.value,
    },
  });
};
</script>
<style scoped>
.history {
  margin-right: 10px;
  margin-top: 30px;
}
.history h2 {
  font-size: 24px;
  margin-bottom: 10px;
}
</style>

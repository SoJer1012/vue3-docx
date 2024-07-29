import router from "@/router";
export const baseUrl = "https://127.0.0.1:10086/api";

async function request(url, options = {}) {
  try {
    // 发送请求
    const response = await fetch(url, options);
    // 检查 HTTP 响应状态码
    if (!response.ok) {
      // 能够从响应中提取出错误信息
      let errorInfo;
      try {
        errorInfo = await response.json();
      } catch (e) {
        errorInfo = { message: response.statusText };
      }
      const error = new Error(`HTTP error: ${response.status}`);
      error.info = errorInfo.message;
      error.status = errorInfo.status;
      error.errorCode = errorInfo.errorCode;
      window.$message.warning(error.info);
      if (error.errorCode === "400203") {
        router.push("/403");
      }
      throw error;
    }
    // 将响应解析为 JSON
    const data = await response.json();
    return data;
  } catch (error) {
    // 捕获 `fetch` 或其他错误
    if (error.name === "AbortError") {
      // 处理请求被取消的情况
      console.error("Fetch request was aborted:", error);
      throw error;
    } else if (error.status) {
      // 处理 HTTP 错误
      console.error(`HTTP error: ${error.status}`, error.info);
    } else {
      // 处理网络错误或未捕获的异常
      console.error("Fetch error:", error);
    }
    throw error;
  }
}

export function reqGetContent(id, token) {
  return request(`${baseUrl}/${id}/content`, {
    method: "GET",
    headers: {
      Authorization: ` Bearer ${token}`,
    },
  });
}

export function reqGenerate(params, token) {
  return request(`${baseUrl}/generate`, {
    method: "POST",
    headers: {
      Authorization: ` Bearer ${token}`,
    },
    body: params,
  });
}

export function reqGet3DMapData(config) {
  return request(`${config.url}/mapdata`, {
    method: "post",
    headers: {
      Authorization: config?.token,
      "Content-Type": "application/json",
      mode: "no-cors",
    },
    body: JSON.stringify(config?.params),
  }).then((result) => {
    if (result && result.code === 0 && window.create3DGraph) {
      return result.data.data;
    }
  });
}

async function convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function reqGet3DMapImage(config) {
  return fetch(`${config.url}/map`, {
    method: "post",
    headers: {
      Authorization: config?.token,
      "Content-Type": "application/json",
      mode: "no-cors",
    },
    body: JSON.stringify(config?.params),
  }).then(async (response) => {
    const blob = await response.blob();
    const base64Image = await convertBlobToBase64(blob);
    return base64Image;
  });
}

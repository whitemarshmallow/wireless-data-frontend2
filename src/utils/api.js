import globalConfig from "../config/globalConfig";

/**
 * 获取 API URL
 * @param {string} endpoint - API 端点路径
 * @param {string|null} baseUrl - 可选的自定义基础 URL
 * @returns {string} - 完整的 API URL
 */
export function getApiUrl(endpoint, baseUrl = null) {
  // 使用传入的 baseUrl 或全局配置
  const effectiveBaseUrl = baseUrl || globalConfig.baseUrl;

  // 确保 endpoint 以 / 开头
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${effectiveBaseUrl}${normalizedEndpoint}`;
}

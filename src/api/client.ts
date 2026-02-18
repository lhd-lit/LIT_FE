import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://lit.io.kr:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: FormData를 사용하는 요청의 경우 Content-Type 헤더를 자동으로 제거
// axios가 FormData를 감지하여 multipart/form-data를 자동으로 설정하도록 함
apiClient.interceptors.request.use(
  (config) => {
    // FormData를 사용하는 경우 Content-Type 헤더 제거
    if (config.data instanceof FormData) {
      // 기본 헤더에서 Content-Type 제거
      if (config.headers) {
        // Content-Type 헤더를 명시적으로 제거하여 axios가 자동으로 multipart/form-data를 설정하도록 함
        delete config.headers['Content-Type'];
        // AxiosHeaders 타입에 대응
        const headers = config.headers as any;
        if (headers.common) {
          delete headers.common['Content-Type'];
        }
        if (headers.post) {
          delete headers.post['Content-Type'];
        }
        if (headers.put) {
          delete headers.put['Content-Type'];
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;


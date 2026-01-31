import axios from "axios";

const baseURL = "http://localhost:3000/api/v1";

export const StatusCode = {
  NotFound: 404,
  Forbidden: 403,
  BadRequest: 400,
  ManyRequest: 429,
  ServerError: 500,
  UnAuthorized: 401,
  Success: 200,
  Created: 201,
};

class AxiosInstance {
  _axiosInstance;

  constructor() {
    this._axiosInstance = axios.create({
      baseURL,
      timeout: 100000,
      withCredentials: true,
    });
    this._axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("lp");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
    this._axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        const originalRequest = error.config;
        if (originalRequest?.url?.includes("/users/refresh-token")) {
          return Promise.reject(error);
        }
        if (status === StatusCode.UnAuthorized && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await this._axiosInstance.post(
              "/users/refresh-token"
            );
            const { accessToken } = response.data.data;
            localStorage.setItem("lp", accessToken);
            return this._axiosInstance(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem("lp");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  fetch(url, config) {
    return this._axiosInstance.get(url, config);
  }

  post(url, data, config) {
    return this._axiosInstance.post(url, data, config);
  }

  put(url, data, config) {
    return this._axiosInstance.put(url, data, config);
  }

  patch(url, data, config) {
    return this._axiosInstance.patch(url, data, config);
  }

  delete(url, config) {
    return this._axiosInstance.delete(url, config);
  }
}

export const axiosInstanceClient = new AxiosInstance();


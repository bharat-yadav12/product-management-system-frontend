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
  Error: "error",
  NetworkError: "Network Error",
};

class AxiosInstance {
  _axiosInstance;

  constructor() {
    this._axiosInstance = axios.create({
      baseURL,
      timeout: 100000,
    });

    this._axiosInstance.interceptors.request.use(
        (config) => {
          config.headers = {
            ...config.headers,
            ...this.getHeader(),
          
          };
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
    );

    this._axiosInstance.interceptors.response.use(
        (response) => {
          return response;
        },
        async (err) => {
          const errCode = err?.response?.status;
          const originalConfig = err.config;

          if (
              errCode === StatusCode.UnAuthorized &&
              this.getToken() &&
              this.getRefreshToken() &&
              !originalConfig._retry
          ) {
            originalConfig._retry = true;
            return await this.handleRefreshToken(originalConfig);
          } else if (errCode === StatusCode.ManyRequest) {
            console.log("Many requests, try again after some minutes!");
          } else if (errCode === StatusCode.ServerError) {
            console.log("Something went wrong, try again after some minutes!");
          } else if (errCode === StatusCode.NetworkError) {
            console.log("Connection network error, Please check network!");
          }
          return Promise.reject(err);
        }
    );
  }
 
  fetch(url) {
    return this._axiosInstance.get(url);
  }

  post(url, payload) {
    return this._axiosInstance.post(url, payload);
  }

  put(url, payload) {
    return this._axiosInstance.put(url, payload);
  }

  patch(url, payload) {
    return this._axiosInstance.patch(url, payload);
  }

  delete(url, payload) {
    return this._axiosInstance.delete(url, payload);
  }


  getHeader() {
    const token = localStorage.getItem("lp");
  
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    } else {
      return {};
    }
  }
  

  getToken() {
    return localStorage.getItem("lp") || "";
  }

  getRefreshToken() {
    return localStorage.getItem("rlp") || "";
  }

  async handleRefreshToken(originalConfig) {
    try {
      const rs = await this._axiosInstance.post("/auth/refresh-token", {
        oldToken: this.getRefreshToken(),
      });

      const { access_token, refresh_token } = rs.data.data;
      localStorage.setItem("lp", access_token);
      localStorage.setItem("rlp", refresh_token);

      return this._axiosInstance(originalConfig);
    } catch (_error) {
      return Promise.reject(_error);
    }
  }
}

export const axiosInstanceClient = new AxiosInstance();

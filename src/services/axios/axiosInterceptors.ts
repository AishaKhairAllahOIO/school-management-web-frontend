import type { AxiosInstance } from "axios";

export function setupAxiosInterceptors(client: AxiosInstance) {

  client.interceptors.request.use((config) => {

  console.log("REQUEST:");
  console.log("URL:", config.url);
  console.log("METHOD:", config.method);
  console.log("DATA:", config.data);


    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization =
       `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(

   (response) => {

    console.log("RESPONSE:");
    console.log(response.data);

    return response;
  },    

   (error) => {

      console.log("AXIOS ERROR:");
      console.log(error.response?.data);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
      

       return Promise.reject(error);
    }
  );
}
 
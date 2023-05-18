import axios from "axios";
import { toast } from "react-hot-toast";

/**
 * The properties accepted by the fetcher function.
 *
 * @template Method The HTTP method type, either "GET" or "POST".
 */
type FetcherProps<Method extends "GET" | "POST" | "PATCH"> = {
  /** The URL to fetch from. */
  endpoint: string;
  /** The HTTP method to use. Defaults to "POST". */
  method?: Method;
  /** Whether or not to redirect the user after a successful fetch. */
  redirect?: boolean | string;
  /** The message to show while the fetch is in progress. */
  loading?: string;
  /** The message to show when the fetch is successful. */
  success?: string;
  /** The message to show when the fetch encounters an error. */
  error?: string;
  /** Whether or not to show a toast notification. Defaults to true. */
  notif?: boolean;
} & (Method extends "POST" ? { data: any } : { data?: any });

/**
 * Removes the "/api" prefix from the given URL, if present.
 *
 * @param {string} url - The URL to process.
 * @returns {string} - The URL without the "/api" prefix.
 */
function removeApiPrefix(url: string): string {
  const baseUrl = url.replace(/^\/api/, "");
  const path = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  return path;
}

/**
 * Fetches data from the specified endpoint using the specified HTTP method.
 */
const fetcher = async <Method extends "GET" | "POST" | "PATCH">({
  endpoint,
  data,
  method = "POST" as Method,
  redirect,
  loading = "Loading...",
  success = "Successfully 👍",
  error = "Something went wrong 😕",
  notif = true,
}: FetcherProps<Method>): Promise<void> => {
  try {
    if (method === "POST" && !data) {
      throw new Error("POST method requires data");
    }

    const requestConfig = { url: endpoint, method, data };
    const response = notif
      ? await toast.promise(axios.request(requestConfig), {
          loading,
          success: (res) => {
            return `${res.data.msg || success}${
              redirect ? "\nRedirecting..." : ""
            }`;
          },
          error: (err) => {
            return err.response.data.msg || error;
          },
        })
      : await axios.request(requestConfig);

    if (redirect) {
      const resultId = response.data.result.id;
      window.location.href = removeApiPrefix(endpoint) + resultId;
    }
  } catch (error) {
    console.error(error);
  }
};

export default fetcher;

// import axios from "axios";
// import { toast } from "react-hot-toast";

// /**
//  * The properties accepted by the fetcher function.
//  *
//  * @template Method The HTTP method type, either "GET" or "POST".
//  */
// type FetcherProps<Method extends "GET" | "POST" | "PATCH"> = {
//   /** The URL to fetch from. */
//   endpoint: string;
//   /** The HTTP method to use. Defaults to "POST". */
//   method?: Method;
//   /** Whether or not to redirect the user after a successful fetch. */
//   redirect?: boolean | string;
//   /** The message to show while the fetch is in progress. */
//   loading?: string;
//   /** Whether or not to show a toast notification. Defaults to true. */
//   showToast?: boolean;
// } & (Method extends "POST" ? { data: any } : { data?: any });

// const LOADING_MESSAGE = "Loading...";
// const SUCCESS_MESSAGE = "Success 👍";
// const ERROR_MESSAGE = "Something went wrong 😕";

// /**
//  * Removes the "/api" prefix from the given URL, if present.
//  *
//  * @param {string} url - The URL to process.
//  * @returns {string} - The URL without the "/api" prefix.
//  */
// export function removeApiPrefix(url: string): string {
//   const baseUrl = url.replace(/^\/api/, "");
//   const path = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
//   return path;
// }

// /**
//  * Fetches data from the specified endpoint using the specified HTTP method.
//  */
// const fetcher = async <Method extends "GET" | "POST" | "PATCH">({
//   endpoint,
//   data,
//   method = "POST" as Method,
//   redirect,
//   loading = LOADING_MESSAGE,
//   showToast = true,
// }: FetcherProps<Method>): Promise<any> => {
//   try {
//     if (method === "POST" && !data) {
//       throw new Error("POST method requires data");
//     }

//     const requestConfig = { url: endpoint, method, data };
//     const response = showToast
//       ? await toast.promise(axios.request(requestConfig), {
//           loading,
//           success: (res) => {
//             return `${res.data.msg || SUCCESS_MESSAGE}${
//               redirect ? "\nRedirecting..." : ""
//             }`;
//           },
//           error: (err) => {
//             return err.response.data.msg || ERROR_MESSAGE;
//           },
//         })
//       : await axios.request(requestConfig);

//     if (redirect) {
//       const resultId = response.data.result.id;
//       window.location.href = removeApiPrefix(endpoint) + resultId;
//     }

//     return response.data;
//   } catch (error: any) {
//     console.error(error);
//     throw new Error(error);
//   }
// };

// export default fetcher;

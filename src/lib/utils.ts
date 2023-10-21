export const getQSParamFromURL = (
  key: string,
  url: string | undefined
): string | null => {
  if (!url) return "";
  const search = new URL(url).search;
  const urlParams = new URLSearchParams(search);
  return urlParams.get(key);
};

interface Params {
  [key: string]: any;
}

export const getUrlWithQueryParams = (url: string, params: Params) => {
  const newUrl = url.endsWith("/") ? url : url + "/";
  return newUrl + "?" + new URLSearchParams(params);
};

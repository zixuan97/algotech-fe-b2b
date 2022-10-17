import { AxiosError } from 'axios';

type LoadingProps = {
  updateLoading: (loading: boolean) => void;
  delay?: number;
};

const asyncFetchCallback = async <T>(
  res: Promise<T>,
  successCallback: (value: T) => void,
  errorCallback?: (err: AxiosError) => void,
  loadingProps?: LoadingProps
) => {
  const setLoadingFalse = () =>
    setTimeout(() => {
      loadingProps?.updateLoading(false);
    }, loadingProps?.delay ?? 0);
  if (errorCallback) {
    res
      .then((res) => {
        successCallback(res);
        setLoadingFalse();
      })
      .catch((err: AxiosError) => {
        errorCallback(err);
        setLoadingFalse();
      });
  } else {
    res.then((res) => {
      successCallback(res);
      setLoadingFalse();
    });
  }
};

export default asyncFetchCallback;

import { Alert } from 'antd';
import * as React from 'react';
import { useLocation } from 'react-router';

export interface AxiosErrDataBody {
  message: string;
}

export interface AlertType {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  description?: string;
}

type AlertProps = {
  alert: AlertType | null;
  clearAlert: () => void;
  timeout?: number;
};

const TimeoutAlert = ({ alert, clearAlert, timeout = 3000 }: AlertProps) => {
  const location = useLocation();

  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout>();

  React.useEffect(() => {
    if (alert) {
      setTimeoutId(
        setTimeout(() => {
          clearAlert();
        }, timeout)
      );
    }
  }, [alert, clearAlert, timeout]);

  // clear timeout on component unmount
  React.useEffect(() => () => clearTimeout(timeoutId), [location, timeoutId]);

  if (!alert) return null;

  const { type, message, description } = alert;

  return (
    <Alert
      type={type}
      message={message}
      description={description}
      onClose={clearAlert}
      showIcon
    />
  );
};

export default TimeoutAlert;

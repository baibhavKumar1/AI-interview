import React, { createContext, useContext, useState } from 'react';
import Toast from './Toast';

interface ToastContextType {
  (type: "success" | "warning" | "error", message: string, duration?: number): void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastInfo, setToastInfo] = useState<{ type: "success" | "warning" | "error"; message: string } | null>(null);

  const showToast: ToastContextType = (type, message, duration = 3000) => {
    setToastInfo({ type, message });

    setTimeout(() => {
      setToastInfo(null);
    }, duration);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toastInfo && <Toast type={toastInfo.type} message={toastInfo.message} duration={3000} />}
    </ToastContext.Provider>
  );
};

export default ToastProvider;

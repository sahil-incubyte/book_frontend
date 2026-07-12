"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type NotificationType = "success" | "error";

type Notification = {
  id: number;
  message: string;
  type: NotificationType;
};

type NotificationContextValue = {
  notify: (message: string, type?: NotificationType) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback(
    (message: string, type: NotificationType = "success") => {
      const id = Date.now() + Math.random();
      setNotifications((current) => [...current, { id, message, type }]);
      setTimeout(() => {
        setNotifications((current) => current.filter((n) => n.id !== id));
      }, 3000);
    },
    [],
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <NotificationList notifications={notifications} />
    </NotificationContext.Provider>
  );
}

function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded px-4 py-2 text-sm text-white shadow ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}

export function useNotify() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotify must be used within a NotificationProvider");
  }
  return context.notify;
}

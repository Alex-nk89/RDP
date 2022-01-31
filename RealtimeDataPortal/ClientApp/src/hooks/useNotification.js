import { useNotifications } from "@mantine/notifications"

export const useNotification = () => {
    const notification = useNotifications();

    const show = (type, message) => {
        const attributes = setAttributes(type, message);

        function setAttributes(type, message) {
            switch (type) {
                case 'success':
                    return {
                        color: 'teal'
                    };
                case 'warning':
                    return {
                        color: 'orange'
                    };
                case 'error':
                    return {
                        color: 'red'
                    };
                default:
                    return {
                        color: 'blue'
                    };
            }
        }

        notification.showNotification({ message: message, ...attributes });
    }

    return { show };
}
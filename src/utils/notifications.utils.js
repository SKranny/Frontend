export function getRouteByNotification(notification) {
  switch (notification.notification_type) {
    case 'MESSAGE':
      return { name: 'Im', params: { id: notification.author.id } };
    default:
      return {
        name: 'ProfileId',
        params: { id: notification.author.id },
      };
  }
}

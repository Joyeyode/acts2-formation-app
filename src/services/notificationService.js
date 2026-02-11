// Notification Service for daily formation reminders
// Uses Web Notifications API and Service Worker

const NOTIFICATION_PREF_KEY = 'acts2_notificationPrefs';
const DEFAULT_PREFS = {
  enabled: false,
  time: '08:00', // 8 AM
  days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
};

export const getNotificationPrefs = () => {
  const saved = localStorage.getItem(NOTIFICATION_PREF_KEY);
  return saved ? JSON.parse(saved) : DEFAULT_PREFS;
};

export const saveNotificationPrefs = (prefs) => {
  localStorage.setItem(NOTIFICATION_PREF_KEY, JSON.stringify(prefs));
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    console.log('Notification permission already granted');
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  return false;
};

export const sendNotification = (title, options = {}) => {
  if (!('Notification' in window)) return false;

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/images/col-logo.png',
        badge: '/images/col-logo.png',
        ...options
      });
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  return false;
};

export const scheduleReminder = (currentWeek, currentDay) => {
  const prefs = getNotificationPrefs();
  
  if (!prefs.enabled) return;

  const [hours, minutes] = prefs.time.split(':').map(Number);
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(hours, minutes, 0, 0);

  // If the reminder time has passed today, schedule for tomorrow
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const timeUntilReminder = reminderTime - now;

  // Schedule the notification
  setTimeout(() => {
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    if (prefs.days.includes(dayName)) {
      sendNotification('Acts 2 Formation', {
        body: `Start today's formation activities for Week ${currentWeek}`,
        tag: 'formation-reminder',
        requireInteraction: true
      });
    }

    // Schedule again for tomorrow
    scheduleReminder(currentWeek, currentDay);
  }, timeUntilReminder);
};

export const isNotificationSupported = () => {
  return 'Notification' in window;
};

export const getNotificationPermission = () => {
  if (!('Notification' in window)) return null;
  return Notification.permission;
};

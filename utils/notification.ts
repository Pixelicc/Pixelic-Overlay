const shownRef = ref(false);
const iconRef = ref("");
const textRef = ref("");
const colorRef = ref("");
const variantRef = ref("outlined");
const durationRef = ref(1000);

export const NotificationContext = {
  shown: shownRef,
  icon: iconRef,
  text: textRef,
  color: colorRef,
  variant: variantRef,
  duration: durationRef,
};

class NotificationQueue {
  private queue: Array<{
    func: () => Promise<void>;
    resolve: (value?: any) => void;
  }>;
  private running: boolean;

  public constructor() {
    this.queue = [];
    this.running = false;
  }

  public async enqueue(func: () => Promise<any>): Promise<any> {
    return new Promise((resolve) => {
      this.queue.push({ func, resolve });
      this.runQueue();
    });
  }

  private async runQueue(): Promise<void> {
    if (this.running) return;
    this.running = true;

    while (this.queue.length > 0) {
      const { func, resolve } = this.queue.shift()!;
      resolve(await func());
    }

    this.running = false;
  }
}

const notificationQueue = new NotificationQueue();

export const sendNotification = ({ icon, text, color, variant, duration }: { icon?: string; text: string; color: string; variant?: string; duration?: number }) => {
  notificationQueue.enqueue(async (): Promise<void> => {
    return new Promise((resolve) => {
      iconRef.value = icon || "";
      textRef.value = text;
      colorRef.value = color;
      variantRef.value = variant || "outlined";
      durationRef.value = duration || 1000;

      shownRef.value = true;
      setTimeout(() => {
        shownRef.value = false;
        resolve();
      }, duration || 1000);
    });
  });
};

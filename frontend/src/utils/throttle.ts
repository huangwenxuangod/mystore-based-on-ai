/**
 * 节流函数
 * @param fn 需要节流的函数
 * @param delay 节流时间间隔(毫秒)
 * @returns 包装后的节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let lastCallTime: number = 0;
  let timer: number | null = null;

  return function(this: any, ...args: Parameters<T>): void {
    const now = Date.now();
    const remaining = delay - (now - lastCallTime);

    if (remaining <= 0) {
      // 如果超过间隔时间，立即执行
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCallTime = now;
      fn.apply(this, args);
    } else if (!timer) {
      // 如果未超过间隔时间，且没有定时器，设置定时器
      timer = setTimeout(() => {
        lastCallTime = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining) as unknown as number;
    }
  };
};

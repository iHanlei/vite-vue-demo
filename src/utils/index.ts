import BigNumber from 'bignumber.js'

/**
 * 时间格式化
 * @param {Date | number | string} time - 需要格式化的时间
 * @param {string} fmt - 格式化模板，如 "yyyy-MM-dd" 或 "yyyy-MM-dd HH:mm:ss"
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(
  time: Date | number | string,
  fmt: "yyyy-MM-dd" | "yyyy-MM-dd HH:mm:ss" | string = "yyyy-MM-dd HH:mm:ss"
): string {
  if (!time) return "";

  // 统一处理时间对象
  const date = new Date(time);
  if (isNaN(date.getTime())) {
    console.error("Invalid time input");
    return "";
  }

  // 格式化映射对象
  const formatTokens: Record<string, number | string> = {
    "y+": date.getFullYear(), // 年
    "M+": date.getMonth() + 1, // 月
    "d+": date.getDate(), // 日
    "H+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分钟
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };

  // 替换年份
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      String(formatTokens["y+"]).slice(4 - RegExp.$1.length)
    );
  }

  // 替换其他时间标记
  for (const token in formatTokens) {
    if (new RegExp(`(${token})`).test(fmt)) {
      const value = formatTokens[token];
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? String(value) : `00${value}`.slice(-RegExp.$1.length)
      );
    }
  }

  return fmt;
}

/**
 * 相乘
 */
export const toMultiplied = (
  target: string | number,
  multiplier: string | number,
  precision = 2,
  bigNumberType: BigNumber.RoundingMode = BigNumber.ROUND_DOWN
): string => {
  return new BigNumber(target)
    .multipliedBy(multiplier)
    .decimalPlaces(precision, bigNumberType)
    .toFixed()
}

/**
 * 相除
 */
export const toDivided = (
  target: string | number,
  divisor: string | number,
  precision = 2,
  bigNumberType: BigNumber.RoundingMode = BigNumber.ROUND_DOWN
): string => {
  if (new BigNumber(divisor).isZero()) throw new Error('Divisor cannot be zero')
  return new BigNumber(target).dividedBy(divisor).decimalPlaces(precision, bigNumberType).toFixed()
}

/**
 * 相加
 */
export const toPlus = (
  target: string | number,
  addend: string | number,
  precision = 2,
  bigNumberType: BigNumber.RoundingMode = BigNumber.ROUND_DOWN
): string => {
  return new BigNumber(target).plus(addend).decimalPlaces(precision, bigNumberType).toFixed()
}

/**
 * 相减
 */
export const toMinus = (
  target: string | number,
  subtrahend: string | number,
  precision = 2,
  bigNumberType: BigNumber.RoundingMode = BigNumber.ROUND_DOWN
): string => {
  return new BigNumber(target).minus(subtrahend).decimalPlaces(precision, bigNumberType).toFixed()
}

/**
 * 判断大小
 */
export const isGreaterThan = (number1: string | number, number2: string | number): boolean => {
  return new BigNumber(number1).isGreaterThan(number2)
}
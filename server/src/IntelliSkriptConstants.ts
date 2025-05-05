
export const IsDebugMode = true;//!__dirname.includes('johnheikens.intelliskript');
export const LineTerminatorRegExp = /(?<=\r\n|\r(?!\n)|\n)/g;
/**exactly the same as the above regexp, but it consumes charachters */
export const consumingLineTerminatorRegexp = /(\r\n|\r(?!\n)|\n)/g;
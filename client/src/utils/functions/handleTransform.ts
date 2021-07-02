  // Parses time to 12-hour
  export const handleParseTime = (time: any): string | void => {
    const timeArr: [number, string] = time.split(":");
    let hours: number = timeArr[0];
    let minutes: any = timeArr[1];
    const ampm: string = hours >= 12 ? "pm" : "am"
    hours = hours % 12;
    hours = hours ? hours : 12
    minutes = minutes < 10 ? "0" + minutes.slice(-1) : minutes;
    const timeStr: string = `${hours}:${minutes}${ampm}`
    return timeStr
  };
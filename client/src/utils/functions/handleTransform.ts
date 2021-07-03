// Parse time to 24-hour to store in db
export const handleDbTime = (time: string): string => {
  const timeArr1: Array<string> = time.split(":");
  const timeArr2: Array<string> = [
    timeArr1[1].slice(0, 2),
    timeArr1[1].slice(2),
  ];
  const hh: string =
    timeArr2[1] === "pm"
      ? JSON.stringify(JSON.parse(timeArr1[0]) + 12)
      : timeArr1[0];
  if (hh.length === 1) {
    const dbTime: string = `0${hh}:${timeArr2[0]}`;
    return dbTime;
  } else {
    const dbTime: string = `${hh}:${timeArr2[0]}`;
    return dbTime;
  }
};

// Parses time to 12-hour
export const handleParseTime = (time: any): string | void => {
  const timeArr: [number, string] = time.split(":");
  let hours: number = timeArr[0];
  let minutes: any = timeArr[1];
  const ampm: string = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes.slice(-1) : minutes;
  const timeStr: string = `${hours}:${minutes}${ampm}`;
  return timeStr;
};
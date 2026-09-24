export function isInsidePlayWindow(time, start, end) {
  const toMinutes = (value) => {
    const [h, m] = value.split(":").map(Number);
    return h * 60 + m;
  };

  const now = toMinutes(time);
  const a = toMinutes(start);
  const b = toMinutes(end);

  if (a === b) return true;

  if (a < b) {
    return now >= a && now < b;
  }

  return now >= a || now < b;
}

export function getSchedule(config) {
  return {
    timezone: config.astra.timezone,
    playStart: config.astra.playStart,
    playEnd: config.astra.playEnd
  };
}

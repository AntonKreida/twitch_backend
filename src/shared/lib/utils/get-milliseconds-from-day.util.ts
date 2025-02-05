export const getMillisecondsFromDay = (countDays: number): number => {
  const currentServerDateFromMilliseconds = new Date().getMilliseconds();

  const millisecondsFromDay = new Date().setDate(
    new Date().getDate() + countDays,
  );

  return millisecondsFromDay - currentServerDateFromMilliseconds;
};

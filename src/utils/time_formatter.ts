import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

function utcTimeToTaipeiTime(timestamp: Date) {
  if (!timestamp) {
    return null;
  }
  return dayjs(timestamp).tz("Asia/Taipei").format("YYYY-MM-DDTHH:mm:ssZ");
}

export { utcTimeToTaipeiTime };

import moment from "moment";

const mergeDateAndTime = (date, time) => {
  const datePart = moment(date).format("YYYY-MM-DD");
  const dateTimeString = `${datePart}T${time}Z`;
  const dateTime = new Date(dateTimeString);
  return dateTime.toISOString();
};
module.exports = mergeDateAndTime;

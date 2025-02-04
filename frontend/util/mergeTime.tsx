import moment from "moment";

const mergeDateAndTime = (date: string | Date, time: string): string => {
  const datePart = moment(date).format("YYYY-MM-DD"); // Extract the date part
  const dateTimeString = `${datePart}T${time}Z`; // Combine date and time
  const dateTime = new Date(dateTimeString); // Create a Date object
  return dateTime.toISOString(); // Return the ISO string
};

export default mergeDateAndTime;
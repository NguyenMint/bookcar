const statusMapping = {
  1: {
    text: "Lịch đặt đang chờ duyệt",
    color: "#FFBF00", // Gray
  },
  2: {
    text: "Lịch đã được nhận",
    color: "#17a2b8", // Blue
  },
  3: {
    text: "Hoàn thành",
    color: "#28a745", // Green
  },
  4: {
    text: "Hủy/ Trễ hẹn",
    color: "#dc3545", // Red
  },
};
module.exports = statusMapping;

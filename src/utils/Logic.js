const IsVietNamPhoneNumber = phone => {
  return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone);
};

let weekdays = [];
let weekday = ['Sun', 'Mon', 'Tue', 'Wes', 'Thu', 'Fri', 'Sat'];
const date = new Date();
for (let i = 0; i < 7; i++) {
  let temDate = {
    date: `${new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate()}/${
      new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getUTCMonth() + 1
    }`,
    weekday:
      weekday[new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()],
  };
  weekdays.push(temDate);
}

export {IsVietNamPhoneNumber, weekdays};

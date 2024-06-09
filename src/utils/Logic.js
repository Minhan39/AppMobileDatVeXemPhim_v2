const IsEmail = email => {
  return String(email)
    .toLowerCase()
    .match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
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
const convertDate = date => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
const convertTime = time => {
  return time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });
};
const convertTime2 = time => {
  const time_arr = time.split(':');
  return (
    (time_arr[0] % 12) +
    ':' +
    time_arr[1] +
    ' ' +
    (time_arr[0] > 12 ? 'PM' : 'AM')
  );
};

export {IsEmail, weekdays, convertDate, convertTime, convertTime2};

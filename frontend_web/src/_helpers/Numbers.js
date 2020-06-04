let numOr0 = (n) => (isNaN(n) ? 0 : parseFloat(n));

const Numbers = {
  random: (min = 1, max = 2) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  fmt: (num) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
  sum: (nums) => nums.reduce((a, b) => numOr0(a) + numOr0(b), 0),
  guid: () => {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    let res =
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4();
    return res;
  },
};
export default Numbers;

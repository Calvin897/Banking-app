'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-04-04T14:11:59.604Z',
    '2021-04-05T17:01:17.194Z',
    '2021-04-05T23:36:17.929Z',
    '2021-04-07T10:51:36.790Z'
  ],
  currency: 'ZAR',
  locale: 'en-SA' // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z'
  ],
  currency: 'USD',
  locale: 'en-US'
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Calvin Tribelhorn',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111
// };

// const account2 = {
//   owner: 'Byron Tribelhorn',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222
// };

// const account3 = {
//   owner: 'Elizabeth Tribelhorn',
//   movements: [200, 200, 340, 3000, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333
// };

// const account4 = {
//   owner: 'Guy Tribelhorn',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444
// };

// const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// FORMAT DATES -------------------------------------
const formatMovementDate = function(date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
    // const day = `${date.getDate()}`.padStart(2, '0');
    // const month = `${date.getMonth() + 1}`.padStart(2, '0');
    // const year = date.getFullYear();

    // return `${day}/${month}/${year}`;
  }
};

//FORMATTING CURRENCY -------------------------------------

const formatCur = function(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
};

// DISPLAY LIST OF TRANSACTIONS -----------------------
const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
     <div class="movements">
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i +
      1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// console.log(calcDisplaySummary(account1.movements));

const createUserNames = function(accs) {
  accs.forEach(function(acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

const updateUI = function(acc) {
  //DISPLAY MOVEMENTS
  displayMovements(acc);
  //     //DISPLAY BALANCE
  calcDisplayBalance(acc);
  //     //DISPLAY SUMMARY
  calcDisplaySummary(acc);
};

const startLogOutTimer = function() {
  const tick = function() {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  //set time to 5 minutes
  let time = 120;
  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// ////EVENT HANDLER ///////////////////////////////////////
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN(fortesting purposes)
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//day/month/year

// LOGIN FUNCTION //////////////////////////////////////////////////
btnLogin.addEventListener('click', function(e) {
  //prevent form from submitting/refreshing
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  //     //DISPLAY UI AND WELCOME MESSAGE
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `welcome back ${
      currentAccount.owner.split(' ')[0]
    }.`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
      // weekday: 'long'
    };

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // CREATE CURRENT DATE AND TIME
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, '0');
    // const month = `${now.getMonth() + 1}`.padStart(2, '0');
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, '0');
    // const min = `${now.getMinutes()}`.padStart(2, '0');
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //CLEAR INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc.userName !== currentAccount.userName
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    //RESET TIMER
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// LOAN TRANSFER FUNCTIONS:
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function() {
      currentAccount.movements.push(Math.floor(amount));
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    // delete account
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//----------------LOOPING MAPS FOR EACH ------------------------

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling']
// ]);
// currencies.forEach(function(value, key, map) {
//   console.log(`${key}: ${value}`);
// });
// //--------------LOOP SETS WITH FOR EACH ----------------------

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

// console.log(currenciesUnique);

// currenciesUnique.forEach(function(value, key, set) {
//   console.log(`${key}: ${value}`);
// });

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// //for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`movement ${i + 1} you deposited ${movement} `);
//   } else {
//     console.log(`movement ${i + 1} you withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log(`------------FOR EACH---------------`);
// movements.forEach(function(movement, i, arr) {
//   if (movement > 0) {
//     console.log(`movement ${i + 1} you deposited ${movement} `);
//   } else {
//     console.log(`movement ${i + 1} you withdrew ${Math.abs(movement)}`);
//   }
// });

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE - does not mutate the original array
// arr.slice(2);
// console.log(arr.slice(2));

// console.log(arr.slice(-1));
// console.log(arr.slice());

// //SPLICE - mutates the original array
// console.log(arr.splice(2));

// const arr2 = arr.slice(1, 3);
// // arr.splice();
// console.log(arr2);

// //REVERSE - DOES MUTATE THE ORIGINAL ARRAY
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'j', 'f'];

// console.log(arr2.reverse());

// //CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //JOIN
// console.log(letters.join('--'));

//---------------CODING CHALLENGE ----------------------------

// const checkDogs = function(arr1, arr2) {
//   let newArrJulia = [...arr1];
//   const newArrJulia2 = newArrJulia.slice(1, 3);
//   const dogAges = [...newArrJulia2, ...arr2];

//   dogAges.forEach(function(age, i) {
//     if (age >= 3) {
//       console.log(`dog number ${i + 1} is an adult, and is ${age} years old `);
//     } else {
//       console.log(`dog number ${i + 1} is still a puppy`);
//     }
//   });

//   console.log(dogAges);
// };

// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

//------------CODING CHALLENGE 2 -------------------------

// const dogAge = [5, 2, 4, 1, 15, 8, 3];

// const calcAverageHumanAge = dogAge.map(function(age) {
//   if (age > 2) {
//     return 16 + age * 4;
//   } else {
//     return age * 2;
//   }
// });

// console.log(calcAverageHumanAge);

// const calcAverageHumanAge2 = function(arr) {
//   arr.map(function(age) {
//     if (age > 2) {
//       return 16 + age * 4;
//     } else {
//       return age * 2;
//     }
//   });
// };

// const calcAverageHumanAge = function(arr) {
//   const humanAge = arr.map(age => {
//     if (age > 2) return 16 + age * 4;
//     else return age * 2;
//   });
//   console.log(humanAge);

//   const adultDogs = humanAge.filter(function(age) {
//     if (age > 18) return age;
//   });
//   console.log(adultDogs);
//   console.log(adultDogs.length);

//   const avgAge =
//     adultDogs.reduce(function(acc, age, i) {
//       return acc + age;
//     }) / adultDogs.length;

//   const avgAge1 = avgAge / adultDogs.length;
//   console.log(avgAge);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// // THE MAP METHOD ----------------------------------//

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToUsd = 1.1;

// const movementUsd = movements.map(function(mov) {
//   return mov * euroToUsd;
// });

// const movementUsd = movements.map(mov => mov * euroToUsd);

// console.log(movements);

// console.log(movementUsd);

// let euroConversion = [];
// for (const [i, mov] of movements.entries()) {
//   [euroConversion[i]] = [mov * euroToUsd];
// }
// console.log(euroConversion);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `movement ${i + 1}: you ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// //   }
// console.log(movementsDescriptions);

// const deposits = movements.filter(function(mov) {
//   return mov > 0;
// });
// console.log(deposits);

// const withdrawals = movements.filter(function(mov) {
//   return mov < 0;
// });
// console.log(withdrawals);

// console.log(movements);

// const balance = movements.reduce(function(acc, cur, i, arr) {
//   console.log(`iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);

// console.log(balance);

// // maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// });
// console.log(max);

// PIPELINE
// const totalDepositsUsd = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * 1.1)
//   .reduce((acc, mov) => acc + mov);

// const calcAverageHumanAge2 = function(arr) {
//   const humanAge = arr
//     .map(age => (age > 2 ? 16 + age * 4 : age * 2))
//     .filter(age => age > 18)
//     .reduce((acc, mov, i, array) => acc + mov / array.length, 0);
//   console.log(humanAge);
// };

// calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]);

// const firstWithdrawal = movements.find(mov => mov < 0);

// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner == 'Calvin Tribelhorn');

// console.log(account);

// let account = {};
// for (const [i, element] of accounts.entries()) {
//   account = accounts[1];
// }
// console.log(account);

//EQUALITY
// console.log(movements);
// console.log(movements.includes(-130));

// //INCLUDES SPECIFIED CONDITION: SOME
// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// EVERY ONLY RETURN TRUE ONY IF ALL ELEMENTS IN ARRAY FIT CONDITION

// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// const arr = [[1, 2, 3], [4, [12, 13, [77, 78], 14], 5, 6], 8, 9];
// console.log(arr.flat(3));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// const accountMovements = accounts.flatMap(acc => acc.movements);
// console.log(accountMovements);

// //SORT WITH STRINGS ( MUTATES ORIGINAL ARRAY)
// const owners = ['calvin', 'jonas', 'amy', 'josh', 'don'];
// console.log(owners.sort());

// //NUMBERS
// console.log(movements);

// // Ascending
// //return < 0, A, B (keep order)
// //return > 0, B, A (switch order)
// movements.sort((a, b) => a - b);

// // Descending
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (b > a) return 1;
// // });
// console.log(movements);
//EMPTY ARRAYS FILL METHOD
// const x = new Array(7);

// x.fill(1);
// x.fill(2, 3, 5);
// console.log(x);

// //ARRAY.FROM
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (curr, i) => i + 1);
// console.log(z);

// const c = Array.from({ length: 100 }, (_, i) =>
//   Math.trunc(Math.random() * 6 + 1)
// );
// console.log(c);

// labelBalance.addEventListener('click', function() {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('$', ''))
//   );
//   console.log(movementsUI);
// });

// //ARRAY METHODS PRACTICE

// // 1
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, mov) => acc + mov);
// console.log(bankDepositSum);

// // //2.
// // const numberDeposits1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(mov => mov > 1000).length;

// const numberDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

// console.log(numberDeposits1000);

// //3.

// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(deposits, withdrawals);

// //4.
// const converTitleCase = function(title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exeptions = ['a', 'am', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exeptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return titleCase;
// };
// console.log(
//   converTitleCase('and this is a nice title, but it is not too LONG - i hope')
// );
// ---------------------CODING CHALLANGE NO4. ----------------------

// const createUserNames = function(accs) {
//   accs.forEach(function(acc) {
//     acc.userName = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(name => name[0])
//       .join('');
//   });
// };

// createUserNames(accounts);

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] }
// ];

// // 1.
// const createRecommendedFood = function(dogs) {
//   dogs.forEach(dogs => (dogs.recommendedFood = dogs.weight ** 0.75 * 28));
// };

// createRecommendedFood(dogs);

// console.log(dogs);

// // 2.

// const dogEats = function(dogs) {
//   const findDoggo = dogs.find(dog => dog.owners.includes('Sarah'));
//   // const [findDoggo] = dogs.filter(dogs => dogs.owners[0] === 'Sarah');
//   // console.log(findDoggo.weight);
//   if (findDoggo.curFood > findDoggo.recommendedFood) {
//     return `your dog is eating too much`;
//   } else {
//     return `your dog is eating to little`;
//   }
// };

// console.log(dogEats(dogs));

// //3.
// const ownersEatTooMuch = dogs
//   .filter(dogs => dogs.curFood > dogs.recommendedFood)
//   .map(dogs => dogs.owners)
//   .flat();

// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter(dogs => dogs.curFood < dogs.recommendedFood)
//   .map(dogs => dogs.owners)
//   .flat();

// console.log(ownersEatTooLittle);

// // 4
// const eatToMuch = function() {
//   const dogsDiet = dogs
//     .filter(dogs => dogs.curFood > dogs.recommendedFood)
//     .map(dogs => dogs.owners)
//     .flat();
//   console.log(
//     `${ownersEatTooMuch[0]}, and ${ownersEatTooMuch[1]}, and ${ownersEatTooMuch[2]}'s dog eat too much`
//   );
// };

// eatToMuch(dogs);

// const eatTooLittle = function() {
//   const dogsDiet = dogs
//     .filter(dogs => dogs.curFood < dogs.recommendedFood)
//     .map(dogs => dogs.owners)
//     .flat();
//   console.log(
//     `${ownersEatTooLittle[0]}, and ${ownersEatTooLittle[1]}, and ${ownersEatTooLittle[2]}'s dog eat too little`
//   );
// };

// eatTooLittle(dogs);
// //5.
// dogs.some(dogs => dogs.curFood === dogs.recommendedFood);

// const dogsEatExactAmount = dogs.some(
//   dogs => dogs.curFood === dogs.recommendedFood
// );

// console.log(dogsEatExactAmount);
// //6
// const dogEatsOkAmount = dogs.some(
//   dogs =>
//     dogs.curFood <= dogs.recommendedFood * 1.1 &&
//     dogs.curFood >= dogs.recommendedFood * 0.9
// );

// console.log(dogEatsOkAmount);
// //7
// const dogEatsOkAmountArray = dogs.filter(
//   dogs =>
//     dogs.curFood <= dogs.recommendedFood * 1.1 &&
//     dogs.curFood >= dogs.recommendedFood * 0.9
// );
// console.log(dogEatsOkAmountArray);

// const dogsCopy = function(dogs) {
//   const dogs2 = [...dogs];
//   const sorted = dogs2.sort((a, b) => a.recommendedFood - b.recommendedFood);
//   console.log(sorted);
// };

// dogsCopy(dogs);

//CONVERTING NUMBERS = NUMBERS DATES AND TIMERS
// console.log(0.1 + 0.2);

// console.log(+'23');
// console.log(Number('23'));

// // PARSING = READING A NUMBER OUT OF A STRING.
// console.log(Number.parseInt('30px', 10));

// console.log(Number.parseFloat('2.5rem'));
// console.log(Number.parseInt('3.3px', 10));

// console.log(Number.isNaN('3.3px', 10));
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));

// //MATH AND ROUNDING
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(5, 18, 23, 11, 2));

// // calculate the area of a circle with the following radius
// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);

// // how to generate a random number between two ints
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));

// //ROUNDING INTERGERS
// console.log(Math.round(23.3));
// console.log(Math.round(23.6));
// console.log(Math.trunc(23.33));

// console.log(Math.ceil(23.9));

// //FLOOR WORKS THE SAME AS TRUNC BUT WORK WITH NEGATIVE NUMBERS ALSO
// console.log(Math.floor(23.3));

// //ROUNDING DECIMALS
// console.log((2.7).toFixed(3));
// console.log((2.7).toFixed(0));
// console.log(+(2.7).toFixed(2));

//THE REMAINDER OPERATOR -------------------------
// console.log(5 % 2);
// console.log(8 % 3);

// console.log(6 % 2);
// console.log(9 % 2);

// labelBalance.addEventListener('click', function() {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) row.style.backgroundColor = 'blue';
//     if (i % 3 === 0) row.style.backgroundColor = 'green';
//   });
// });

// //BIGINT -----------------------------------------
// console.log(2 ** 53 - 1);
// console.log(4792834737648234723984729347293n);

// //operations
// console.log(10000n + 10000n);
// console.log(37461384798347198347134n * 1423412341341243n);

//CREATING DATES

// const now = new Date();
// console.log(now);

// console.log(new Date('Apr 06 2021 12:26:11'));
// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 19, 16, 23, 5));

// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// console.log(new Date(0));

// WORKING WITH DATES

// const future = new Date(2037, 10, 19, 16, 23, 5);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(Date.now());
// console.log(new Date(1617705436964));

//INTERNATIONALIZING DATES AND TIMES ACCORDING TO BROWSER LOCALE --------------------

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));

// const days1 = calcDaysPassed(
//   new Date(2037, 3, 4),
//   new Date(2037, 3, 24, 10, 8)
// );

// console.log(days1);

//INTERNATIONALIZING NUMBERS CURRENCIES ------------------------------
// const num = 36534.34;
// const optionsCurrency = {
//   style: 'currency',
//   unit: 'celsius',
//   currency: 'EUR'
// };

// console.log('US:', new Intl.NumberFormat('en-US', optionsCurrency).format(num));
// console.log(
//   'Germany:',
//   new Intl.NumberFormat('de-DE', optionsCurrency).format(num)
// );
// console.log('SA:', new Intl.NumberFormat('en-SA', optionsCurrency).format(num));
// console.log(
//   'browser:',
//   new Intl.NumberFormat(navigator.language, optionsCurrency).format(num)
// );

//SET TIME-OUT ///////////////////////////////////////////////////
// setTimeout(
//   (ing1, ing2) => console.log(`here is your pizza with ${ing1} and ${ing2}`),
//   3000,
//   'olives',
//   'artichokes'
// );

// console.log('waiting...');

//SETINTERVAL ///////////////////////////////////////////
// setInterval(() => {
//   const now = new Date();
//   console.log(now);
// }, 1000);

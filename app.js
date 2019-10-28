//ДОП. ЗАДАНИЕ №1
//Вт 9.07.19
//На основе массива map и массива users собрать новый массив объектов где в
//каждом объекте будут только те свойства которые перечислены в массиве map

const map = ["_id", "name", "isActive", "balance"];
const users = [
  {
    _id: "5d220b10e8265cc978e2586b",
    isActive: true,
    balance: 2853.33,
    age: 20,
    name: "Buckner Osborne",
    gender: "male",
    company: "EMPIRICA",
    email: "bucknerosborne@empirica.com",
    phone: "+1 (850) 411-2997",
    registered: "2018-08-13T04:28:45 -03:00",
    nestedField: { total: 300 }
  },
  {
    _id: "5d220b10144ef972f6c2b332",
    isActive: true,
    balance: 1464.63,
    age: 38,
    name: "Rosalie Smith",
    gender: "female",
    company: "KATAKANA",
    email: "rosaliesmith@katakana.com",
    phone: "+1 (943) 463-2496",
    registered: "2016-12-09T05:15:34 -02:00",
    nestedField: { total: 400 }
  },
  {
    _id: "5d220b1083a0494655cdecf6",
    isActive: false,
    balance: 2823.39,
    age: 40,
    name: "Estrada Davenport",
    gender: "male",
    company: "EBIDCO",
    email: "estradadavenport@ebidco.com",
    phone: "+1 (890) 461-2088",
    registered: "2016-03-04T03:36:38 -02:00",
    nestedField: { total: 200 }
  }
];

const simpleUsersArray = users.map(user =>
  map.reduce((acc, key) => {
    acc[key] = user[key];
    return acc;
  }, {})
);

console.log(simpleUsersArray);

//ДОП. ЗАДАНИЕ №2
//Вт 9.07.19
//Написать функцию сортировки которая принимает массив объектов который хотим
//сортировать, поле по которому хотим сортировать, и в каком порядке сортировать
//по возрастанию asc или по убыванию desc.
//Условия:
// - сортировка может быть как по числу так и по строке, т.е поле по которому
//   мы хотим сортировать может содержать как строку так и число.
// - передаваемый массив не должен изменяться
// - нужно проверять что передан массив и поле по которому сортировать.
//*Условие со звездочкой. Иметь возможность сортировать по вложенному полю.
//Пример вызова:
// functionSort(users, "balance", "desc");
//Пример вызова с вложенным полем
// functionSort(users, "nestedField.total", "desc");

function getDeepFieldValue(obj, field) {
  const arrFields = field.split(".");
  if (!obj.hasOwnProperty(arrFields[0])) return undefined;
  if (arrFields.length === 1) return obj[arrFields[0]];

  return getDeepFieldValue(obj[arrFields[0]], arrFields.slice(1).join("."));
}

function functionSort(arrayObj, field, typeSort = "asc") {
  if (!Array.isArray(arrayObj))
    return console.error("functionSort(): first argument is note array.");
  if (
    arrayObj.some(obj => typeof getDeepFieldValue(obj, field) === "undefined")
  )
    return console.error(
      "functionSort(): Field of some array objects is undefined."
    );

  const resArr = arrayObj.slice().sort((objA, objB) => {
    const valA = getDeepFieldValue(objA, field);
    const valB = getDeepFieldValue(objB, field);
    //Множитель для направления сортировки, что бы не плодить лишние проверки
    let valR = 0;
    switch (typeSort) {
      case "asc":
        valR = 1;
        break;
      case "desc":
        valR = -1;
        break;
    }
    //Если значения сортируемого поля имеют разные типы,
    //и одно из значений число, то по алфавиту располагаем его выше.
    if (typeof valA !== typeof valB) {
      if (typeof valA === "number") return -1 * valR;
      if (typeof valB === "number") return 1 * valR;
    }
    //Если значения сортируемого поля имеют один тип. Или разный тип, но среди
    //этих значений нет числового, то для сортировки используем общий принцип:
    //оба числа сравниваются, как числа; если сортируются не числа, то
    //сравниваются как строки.
    return (valA < valB ? -1 : +1) * valR;
  });

  return resArr;
}

console.log(functionSort(users, "balance", "desc"));
console.log(functionSort(users, "nestedField.total", "desc"));

//ДОП. ЗАДАНИЕ №3
//Ср 10.07.19
//Написать функцию debounce, она принимает функцию которую нужно вызвать и
//время через которое эта функция должна быть вызвана и возвращает функцию,
//которая сработает только один раз через N миллисекунд после последнего
//вызова.
//«Лишние» вызовы перезаписывают предыдущие отложенные задания. Все аргументы
//и контекст – передаются.

//*для решения задачи вам понадобится setTimeout и clearTimeout про них можете прочитать на mdn

// const debouncedFunc = debounce(function (a, b){
//  console.log(a + b);
//  return a + b
// }, 2000);

// debouncedFunc(2, 3); // вызов отложен на 2000 мс
// debouncedFunc(3, 3); // предыдущий отложенный вызов игнорируется, текущий откладывается на 2000 мс

//Упрощённо можно сказать, что debounce возвращает вариант функции,
//срабатывающий не чаще чем раз в ms миллисекунд.
//*Условие со звездочкой, debounce должна возвращать метод cancel при вызове
//которого отложенная функция не будет выполнятся.

const debounce = (function() {
  let idTimer;
  return function(fn, timeOut) {
    if (typeof fn !== "function")
      return function() {
        clearTimeout(idTimer);
      };
    idTimer = clearTimeout(idTimer);
    idTimer = setTimeout(fn, timeOut);
    return idTimer;
  };
})();

const debouncedFunc = (a, b) =>
  debounce(function() {
    console.log(a + b);
    return a + b;
  }, 2000);

debouncedFunc(2, 3); // вызов отложен на 2000 мс
debouncedFunc(3, 3); // предыдущий отложенный вызов игнорируется, текущий откладывается на 2000 мс

//ПРОВЕРКА * debounce возвращет метод cancel при вызове которого отложенная функция не будет выполнятся.
const cancel = debounce();
cancel();

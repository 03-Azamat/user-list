const mainBlock = document.querySelector(".main--block");
const listUsers = document.querySelector(".user--lists");
const selectSort = document.querySelector("select");
const inputFilter = document.querySelector("input");
const textPust = document.querySelector(".pust");

// Пока что сократил как мог если у вас есть варианты предлагайте ;)

document.addEventListener("DOMContentLoaded", async () => {
  let dataUsersList = []; // для immputable
  let filteredUsersSorted = []; // для filter | sort список людей

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    dataUsersList = await response.json();

    renderUser(dataUsersList);

    inputFilter.addEventListener("input", () => {
      const valueInput = inputFilter.value.toLowerCase().trim();
      const filteredUser = dataUsersList.filter((user) => {
        return user.name.toLowerCase().includes(valueInput);
      });
      renderUser(filteredUser);
      filteredUsersSorted = [...filteredUser];
      selectSort.value = "default";
    });

    selectSort.addEventListener("change", () => {
      let sorted;

      if (filteredUsersSorted.length) {
        sorted = [...filteredUsersSorted];
      } else {
        sorted = [...dataUsersList];
      }

      switch (selectSort.value) {
        case "desc":
          sorted.sort((a, b) => (a.name < b.name ? 1 : -1));
          break;
        case "abs":
          sorted.sort((a, b) => (a.name > b.name ? 1 : -1));
          break;
      }

      filteredUsersSorted = [...sorted];

      renderUser(sorted);
    });

    dataUsersList.length && textPust.remove();
  } catch (error) {
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("error");

    errorMessage.innerHTML = `Произошла ошибка: ${error}`;
    textPust.remove();
    mainBlock.appendChild(errorMessage);
  }
});

function renderUser(users) {
  listUsers.innerHTML = "";
  return users.forEach((user) => createElement(user));
}

function createElement(user) {
  let classNames = ["name", "email", "address"];

  const list = document.createElement("li");
  const phone = document.createElement("p");

  list.classList.add("user--lists__list");

  const listStart = createDetailElement(user, classNames);

  list.appendChild(listStart);

  phone.classList.add("user--lists__list--phone");
  phone.innerHTML = user.phone.split("x")[0];
  list.appendChild(phone);

  listUsers.appendChild(list);
}

function createDetailElement(user, classNames) {
  const listStart = document.createElement("div");
  classNames.forEach((item) => {
    const element = document.createElement("p");

    element.classList.add(`user--lists__list--${item}`);

    element.innerHTML = user[item]?.city
      ? ` city:${user[item]?.city} , street:${user[item].street} , ${user[item].suite}`
      : user[item];

    listStart.appendChild(element);
  });

  return listStart;
}

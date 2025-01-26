window.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("scroll", updateActiveLink);

  const btn = document.querySelectorAll(".buy__btn"),
    modal = document.querySelector(".modal"),
    modalClose = document.querySelector(".modal__close"),
    listItems = document.querySelector(".grid"),
    dbUrl =
      "https://brandstestowy.smallhost.pl/api/random?pageNumber=3&pageSize=50", // w mailu był link do api  https://brandstestowy.smallhost.pl/api/random ale tam są tylko 20 itemów, w api który jest wykorzystany są 50 itemów
    modalText = document.querySelector(".modal__text-name"),
    modalId = document.querySelector(".modal__text-id"),
    modalToBuy = document.querySelector(".modal-form__to__buy"),
    modalToBuyClose = document.querySelector(".modal-form__close");

  btn.forEach((item) => {
    item.addEventListener("click", async () => {
      controlModal(modalToBuy, "show", "hide", "hidden");
    });
  });

  modalToBuyClose.addEventListener("click", () => {
    controlModal(modalToBuy, "hide", "show", "");
  });

  modalClose.addEventListener("click", () => {
    controlModal(modal, "hide", "show", "");
  });

  loadTask();

  function controlModal(
    item,
    addClass,
    deleteClass,
    overflow,
    dataText,
    dataId
  ) {
    item.classList.add(addClass);
    item.classList.remove(deleteClass);
    document.body.style.overflow = `${overflow}`;

    modalText.textContent = `Nazwa : ${dataText}`;
    modalId.textContent = `ID : ${dataId}`;
  }

  // get data

  async function getData(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Loading error:", error);
      throw error;
    }
  }

  // event delegation

  listItems.addEventListener("click", (event) => {
    event.preventDefault();

    if (event.target.classList.contains("grid-item")) {
      const dataText = event.target.dataset.text;
      const dataId = event.target.dataset.id;

      controlModal(modal, "show", "hide", "hidden", dataText, dataId);
      console.log(event.target.dataset);
    }
  });

  // show elements

  class Cards {
    constructor(id, text) {
      this.id = id;
      this.text = text;
    }

    render() {
      const div = document.createElement("div");

      div.innerHTML = `
        <div data-text="${this.text}" data-id="${this.id}" class="grid-item item-${this.id}">ID: ${this.id}</div>
        `;
      listItems.append(div);
    }
  }

  async function loadTask(limit) {
    const productsMessage = document.querySelector(".products__message");

    controlModal(productsMessage, "show", "hide");

    listItems.innerHTML = "";

    try {
      const data = await getData(dbUrl);

      generateItems(data.data, limit);
    } catch (error) {
      console.error(error);
    } finally {
      controlModal(productsMessage, "hide", "show");
    }
  }

  function generateItems(arr, limit = 5) {
    const showArr = arr.slice(0, limit);

    showArr.forEach((item) => {
      new Cards(item.id, item.text).render();
    });
  }

  // show current section in header

  const sections = document.querySelectorAll("section"),
    navLinks = document.querySelectorAll(".nav__link");

  function updateActiveLink() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop,
        sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop - window.innerHeight / 2 &&
        window.scrollY < sectionTop + sectionHeight - window.innerHeight / 2
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(currentSection)) {
        link.classList.add("active");
      }
    });
  }

  // current of items

  const currentItem = document.querySelector("#products-count");

  currentItem.addEventListener("change", () => {
    const currentItemValue = currentItem.value;
    console.log(currentItemValue);
    loadTask(currentItemValue);
  });

  // burger menu

  const burgerButton = document.querySelector(".burger-button"),
    burgerNav = document.querySelector(".burger-nav"),
    closeButton = document.querySelector(".close__button"),
    burgerItem = document.querySelectorAll(".burger__menu-item");

  burgerButton.addEventListener("click", () => {
    burgerNav.classList.toggle("open");
    document.body.style.overflow = `hidden`;
    document.body.style.background = "#fff";
  });

  closeButton.addEventListener("click", () => {
    burgerNav.classList.toggle("open");
    document.body.style.overflow = ``;
  });

  burgerItem.forEach((item) => {
    item.addEventListener("click", () => {
      burgerNav.classList.toggle("open");
      document.body.style.overflow = `hidden`;
      document.body.style.background = "#fff";
    });
  });
});

// Modal to buy -  w razie potrzeby mogę dodać taką funkcjonalność, malutkie ządanie POST do serwera(localStorage albo JSON server) i wszystko :)

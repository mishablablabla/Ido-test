window.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("scroll", updateActiveLink);

  const btn = document.querySelectorAll(".buy__btn"),
    modal = document.querySelector(".modal"),
    modalClose = document.querySelector(".modal__close"),
    listItems = document.querySelector(".grid"),
    modalText = document.querySelector(".modal__text-name"),
    modalId = document.querySelector(".modal__text-id"),
    modalToBuy = document.querySelector(".modal-form__to__buy"),
    modalToBuyClose = document.querySelector(".modal-form__close"),
    currentItem = document.querySelector("#products-count");

  let currentPage = 1,
    totalPages = null,
    pageSize = parseInt(currentItem.value);

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

  async function getData(pageNumber, pageSize) {
    const dbUrl = `https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    try {
      const response = await fetch(dbUrl);

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

  async function loadTask() {
    const productsMessage = document.querySelector(".products__message");

    controlModal(productsMessage, "show", "hide");
    if (totalPages && currentPage > totalPages) return;

    try {
      const data = await getData(currentPage, pageSize);

      totalPages = data.totalPage;
      generateItems(data.data);

      currentPage++;
    } catch (error) {
      console.error(error);
    } finally {
      controlModal(productsMessage, "hide", "show");
    }
  }

  function generateItems(items) {
    items.forEach((item) => {
      new Cards(item.id, item.text).render();
    });
  }

  function resetData() {
    listItems.innerHTML = "";
    currentPage = 1;
    totalPages = null;
    loadTask();
  }

  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      (!totalPages || currentPage <= totalPages)
    ) {
      loadTask();
    }
  });

  loadTask();

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

  currentItem.addEventListener("change", () => {
    pageSize = parseInt(currentItem.value);
    resetData();
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
      document.body.style.overflow = ``;
    });
  });
});

// Modal to buy -  w razie potrzeby mogę dodać taką funkcjonalność, malutkie ządanie POST do serwera(localStorage albo JSON server) i wszystko :)

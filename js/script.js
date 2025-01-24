window.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelectorAll(".buy__btn"),
    modal = document.querySelector(".modal"),
    modalClose = document.querySelector(".modal__close"),
    listItems = document.querySelector(".grid"),
    dbUrl = "https://brandstestowy.smallhost.pl/api/random",
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

      loadTask();
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
    listItems.innerHTML = "";

    try {
      const data = await getData(dbUrl);

      generateItems(data.data);
    } catch (error) {
      console.error(error);
    }
  }

  function generateItems(arr) {
    arr.forEach((item) => {
      const newItem = new Cards(item.id, item.text).render();
    });
  }
});

// Modal to buy -  w razie potrzeby mogę dodać taką funkcjonalność, malutkie ządanie POST do serwera(localStorage albo JSON server) i wszystko :)

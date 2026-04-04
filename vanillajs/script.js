const API_BASE = "http:127.0.0.1:3000";

async function getBoards() {
  const url = API_BASE + "/api/boards";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result.boards;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

async function getBoards() {
  const url = API_BASE + "/api/boards";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result.boards;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

async function createBoard(board) {
  const url = API_BASE + "/api/boards";
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(board),
      headers: {
        "content-type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);

    clearBoards();
    loadBoards();
  } catch (error) {
    console.error(error.message);
  }
}

async function setupButtons() {
  const modal = document.getElementById("add-modal");

  {
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
      modal.style.display = "none";
    };
  }

  document.querySelector("#create").addEventListener("click", () => {
    modal.style.display = "block";
  });

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  document.querySelector("#submitBoard").addEventListener("click", () => {
    createBoard({
      name: document.querySelector("#createName").value,
      description: document.querySelector("#createDescription").value,
    });
  });
}

async function clearBoards() {
  document.querySelector("#boards").innerHTML = "";

  document.remo;
}

async function loadBoards() {
  const d = document.querySelector("#boards");

  const boards = await getBoards();
  for (b of boards) {
    console.log(b);

    const s = document.createElement("section");
    d.appendChild(s);

    s.setAttribute("id", "board." + b.id);

    {
      const header = document.createElement("header");
      s.appendChild(header);

      {
        const el = document.createElement("h2");
        el.textContent = b.name;
        header.appendChild(el);
      }

      {
        const el = document.createElement("dv");
        el.textContent = b.description;
        header.appendChild(el);
      }
    }

    {
      const footer = document.createElement("footer");
      s.appendChild(footer);

      {
        const el = document.createElement("p");
        el.textContent = "ID: " + b.id;
        footer.appendChild(el);
      }

      {
        const el = document.createElement("p");
        el.textContent = "Updated: " + b.updated_at;
        footer.appendChild(el);
      }
    }
  }
}

setupButtons();
loadBoards();

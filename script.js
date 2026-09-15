/* =====================================================
   FREIPOST
   JAVASCRIPT
===================================================== */


/* =====================================================
   ELEMENTOS
===================================================== */

const feed = document.getElementById("feed");

const postInput =
  document.getElementById("postInput");

const publishButton =
  document.getElementById("publishButton");



/* =====================================================
   TOAST
===================================================== */

function toast(message) {

  const oldToast =
    document.querySelector(".toast");

  if (oldToast) {
    oldToast.remove();
  }

  const element =
    document.createElement("div");

  element.className = "toast";

  element.textContent = message;

  element.style.cssText = `
    position: fixed;
    left: 50%;
    bottom: 90px;
    transform: translateX(-50%);

    background: #17171d;
    color: white;

    padding: 12px 18px;

    border-radius: 14px;

    font-size: 13px;
    font-weight: 600;

    z-index: 9999;

    box-shadow: 0 8px 30px rgba(0,0,0,.2);

    transition: opacity .2s ease;
  `;

  document.body.appendChild(element);

  setTimeout(() => {

    element.style.opacity = "0";

    setTimeout(() => {
      element.remove();
    }, 200);

  }, 1800);
}



/* =====================================================
   CURTIR
===================================================== */

function setupLikes() {

  document
    .querySelectorAll(".like-button")
    .forEach(button => {

      button.addEventListener("click", () => {

        const post =
          button.closest(".post");

        const count =
          post.querySelector(".like-count");

        let likes =
          parseInt(count.textContent) || 0;


        if (button.classList.contains("liked")) {

          likes--;

          button.classList.remove("liked");

        } else {

          likes++;

          button.classList.add("liked");

        }

        count.textContent = likes;


        button.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.25)" },
            { transform: "scale(1)" }
          ],
          {
            duration: 220
          }
        );

      });

    });

}



/* =====================================================
   SALVAR
===================================================== */

function setupSaveButtons() {

  document
    .querySelectorAll(".save-button")
    .forEach(button => {

      button.addEventListener("click", () => {

        button.classList.toggle("saved");

        if (button.classList.contains("saved")) {

          toast("Publicação salva");

        } else {

          toast("Publicação removida dos salvos");

        }

      });

    });

}



/* =====================================================
   COMPARTILHAR
===================================================== */

function setupShareButtons() {

  document
    .querySelectorAll(".share-button")
    .forEach(button => {

      button.addEventListener("click", async () => {

        const post =
          button.closest(".post");

        const username =
          post
            .querySelector(".post-user-info strong")
            ?.textContent || "FreiPost";


        const text =
          `Confira esta publicação de ${username} no FreiPost!`;


        if (navigator.share) {

          try {

            await navigator.share({
              title: "FreiPost",
              text
            });

          } catch (error) {
            // usuário cancelou
          }

        } else {

          try {

            await navigator.clipboard.writeText(text);

            toast("Publicação copiada!");

          } catch (error) {

            toast("Não foi possível compartilhar.");

          }

        }

      });

    });

}



/* =====================================================
   COMENTÁRIOS
===================================================== */

function setupComments() {

  document
    .querySelectorAll(".comment-button, .comments")
    .forEach(element => {

      element.addEventListener("click", () => {

        const post =
          element.closest(".post");

        openComments(post);

      });

    });

}


function openComments(post) {

  const modal =
    document.createElement("div");

  modal.className = "comments-modal";

  modal.innerHTML = `

    <div class="comments-box">

      <div class="comments-title">

        <strong>
          Comentários
        </strong>

        <button class="close-button">
          ✕
        </button>

      </div>


      <div class="comment-list">

        <div class="comment">
          <strong>maria</strong>
          Que publicação linda! 💜
        </div>

        <div class="comment">
          <strong>joao</strong>
          Muito bom!
        </div>

        <div class="comment">
          <strong>bia</strong>
          Adorei essa foto.
        </div>

      </div>


      <form class="comment-form">

        <input
          type="text"
          placeholder="Adicione um comentário..."
          maxlength="200"
        >

        <button>
          Enviar
        </button>

      </form>

    </div>

  `;


  document.body.appendChild(modal);


  modal
    .querySelector(".close-button")
    .addEventListener("click", () => {
      modal.remove();
    });


  modal
    .querySelector(".comment-form")
    .addEventListener("submit", event => {

      event.preventDefault();

      const input =
        modal.querySelector("input");

      const text =
        input.value.trim();

      if (!text) {
        return;
      }


      const comment =
        document.createElement("div");

      comment.className = "comment";

      comment.innerHTML = `
        <strong>você</strong>
        ${escapeHTML(text)}
      `;


      modal
        .querySelector(".comment-list")
        .appendChild(comment);

      input.value = "";

      toast("Comentário publicado!");

    });

}



/* =====================================================
   PROTEGER TEXTO
===================================================== */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}



/* =====================================================
   PUBLICAR
===================================================== */

publishButton.addEventListener(
  "click",
  publishPost
);


function publishPost() {

  const text =
    postInput.value.trim();


  if (!text) {

    toast(
      "Escreva algo antes de publicar."
    );

    postInput.focus();

    return;
  }


  const post =
    document.createElement("article");

  post.className = "post";


  post.innerHTML = `

    <div class="post-header">

      <div class="post-user">

        <img
          class="post-avatar"
          src="https://i.pravatar.cc/200?img=12"
          alt="Você"
        >

        <div class="post-user-info">

          <strong>
            você
          </strong>

          <span class="post-location">
            Agora mesmo
          </span>

        </div>

      </div>

      <button class="more-button">
        •••
      </button>

    </div>


    <div class="new-post-text">
      ${escapeHTML(text)}
    </div>


    <div class="post-content">

      <div class="post-actions">

        <div class="post-left-actions">

          <button class="action-button like-button">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >

              <path
                d="M20.8 8.7c0 5.4-8.8 10.1-8.8 10.1S3.2 14.1 3.2 8.7C3.2 6 5.1 4 7.6 4c1.7 0 3.3.9 4.4 2.3C13.1 4.9 14.7 4 16.4 4c2.5 0 4.4 2 4.4 4.7z"
              />

            </svg>

          </button>


          <button class="action-button comment-button">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >

              <path
                d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3.8-.9L4 20l1.3-3.5A7.4 7.4 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5z"
              />

            </svg>

          </button>


          <button class="action-button share-button">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >

              <path d="M5 19L19 5"/>
              <path d="M10 5h9v9"/>

            </svg>

          </button>

        </div>


        <button class="action-button save-button">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >

            <path
              d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4V4.5z"
            />

          </svg>

        </button>

      </div>


      <div class="likes">

        <span class="like-count">
          0
        </span>

        reações

      </div>


      <div class="caption">

        <strong>
          você
        </strong>

        ${escapeHTML(text)}

      </div>


      <div class="comments">
        Adicione um comentário
      </div>

    </div>

  `;


  const createPost =
    document.querySelector(".create-post");


  createPost.after(post);


  postInput.value = "";


  setupNewPost(post);


  toast(
    "Publicação criada com sucesso!"
  );

}



/* =====================================================
   POST NOVO
===================================================== */

function setupNewPost(post) {

  const like =
    post.querySelector(".like-button");

  const save =
    post.querySelector(".save-button");

  const share =
    post.querySelector(".share-button");

  const comment =
    post.querySelector(".comment-button");

  const comments =
    post.querySelector(".comments");

  const more =
    post.querySelector(".more-button");


  like.addEventListener("click", () => {

    const count =
      post.querySelector(".like-count");

    let likes =
      parseInt(count.textContent) || 0;


    if (like.classList.contains("liked")) {

      likes--;

      like.classList.remove("liked");

    } else {

      likes++;

      like.classList.add("liked");

    }

    count.textContent = likes;

  });


  save.addEventListener("click", () => {

    save.classList.toggle("saved");

    toast(
      save.classList.contains("saved")
        ? "Publicação salva"
        : "Publicação removida dos salvos"
    );

  });


  share.addEventListener("click", () => {

    toast("Publicação compartilhada!");

  });


  comment.addEventListener("click", () => {

    openComments(post);

  });


  comments.addEventListener("click", () => {

    openComments(post);

  });


  more.addEventListener("click", () => {

    openPostMenu(post);

  });

}



/* =====================================================
   MENU DOS POSTS
===================================================== */

function setupMoreButtons() {

  document
    .querySelectorAll(".more-button")
    .forEach(button => {

      button.addEventListener("click", () => {

        const post =
          button.closest(".post");

        openPostMenu(post);

      });

    });

}


function openPostMenu(post) {

  const menu =
    document.createElement("div");

  menu.className = "post-menu";


  menu.innerHTML = `

    <div class="post-menu-content">

      <button class="menu-option">
        🔖 Salvar publicação
      </button>

      <button class="menu-option">
        🔗 Copiar publicação
      </button>

      <button class="menu-option">
        🔕 Silenciar usuário
      </button>

      <button class="menu-option menu-danger">
        ⚠️ Denunciar publicação
      </button>

      <button class="menu-option">
        Cancelar
      </button>

    </div>

  `;


  document.body.appendChild(menu);


  menu.addEventListener("click", event => {

    if (event.target === menu) {
      menu.remove();
    }

  });


  menu
    .querySelectorAll(".menu-option")
    .forEach(option => {

      option.addEventListener("click", () => {

        const text =
          option.textContent.trim();


        if (text.includes("Salvar")) {
          toast("Publicação salva!");
        }

        else if (text.includes("Copiar")) {
          toast("Publicação copiada!");
        }

        else if (text.includes("Silenciar")) {
          toast("Usuário silenciado.");
        }

        else if (text.includes("Denunciar")) {
          toast("Obrigado pelo feedback.");
        }


        menu.remove();

      });

    });

}



/* =====================================================
   STORIES
===================================================== */

function setupStories() {

  document
    .querySelectorAll(".story:not(.create-story)")
    .forEach(story => {

      story.addEventListener("click", () => {

        const name =
          story.dataset.name;

        const image =
          story.dataset.image;

        openStory(name, image);

      });

    });


  document
    .querySelector(".create-story")
    .addEventListener("click", () => {

      toast("Criador de momentos aberto!");

    });

}


function openStory(name, image) {

  const viewer =
    document.createElement("div");


  viewer.className = "story-viewer";


  viewer.innerHTML = `

    <img src="${image}" alt="${escapeHTML(name)}">


    <div class="story-viewer-header">

      <strong>
        ${escapeHTML(name)}
      </strong>

      <button class="story-close">
        ✕
      </button>

    </div>

  `;


  document.body.appendChild(viewer);


  viewer
    .querySelector(".story-close")
    .addEventListener("click", () => {

      viewer.remove();

    });

}



/* =====================================================
   NAVEGAÇÃO
===================================================== */

function setupNavigation() {

  document
    .querySelectorAll(".nav-button")
    .forEach(button => {

      button.addEventListener("click", () => {

        const page =
          button.dataset.page;


        document
          .querySelectorAll(".nav-button")
          .forEach(item => {

            item.classList.remove("active");

          });


        button.classList.add("active");


        switch (page) {

          case "home":

            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });

            break;


          case "explore":

            toast("Explorar em breve 🔎");

            break;


          case "create":

            postInput.focus();

            postInput.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

            break;


          case "notifications":

            toast(
              "Você não possui novas atividades."
            );

            break;


          case "profile":

            toast(
              "Perfil em desenvolvimento 👤"
            );

            break;

        }

      });

    });

}



/* =====================================================
   BUSCA
===================================================== */

document
  .getElementById("searchButton")
  .addEventListener("click", () => {

    const search =
      prompt(
        "O que você deseja encontrar no FreiPost?"
      );


    if (search && search.trim()) {

      toast(
        `Pesquisando por "${search.trim()}"`
      );

    }

  });



/* =====================================================
   MENSAGENS
===================================================== */

document
  .getElementById("messageButton")
  .addEventListener("click", () => {

    toast(
      "Você não possui novas mensagens."
    );

  });



/* =====================================================
   BOTÕES DE FOTO / VÍDEO / LOCAL
===================================================== */

document
  .querySelectorAll(".create-action")
  .forEach(button => {

    button.addEventListener("click", () => {

      const text =
        button.textContent.trim();


      if (text.includes("Foto")) {
        toast("Seleção de foto em breve 📷");
      }

      else if (text.includes("Vídeo")) {
        toast("Seleção de vídeo em breve 🎥");
      }

      else if (text.includes("Local")) {
        toast("Seleção de localização em breve 📍");
      }

    });

  });



/* =====================================================
   ENTER PARA PUBLICAR
===================================================== */

postInput.addEventListener("keydown", event => {

  if (event.key === "Enter") {

    event.preventDefault();

    publishPost();

  }

});



/* =====================================================
   ESC
===================================================== */

document.addEventListener("keydown", event => {

  if (event.key !== "Escape") {
    return;
  }


  document
    .querySelectorAll(
      ".post-menu, .comments-modal, .story-viewer"
    )
    .forEach(element => {

      element.remove();

    });

});



/* =====================================================
   INICIALIZAÇÃO
===================================================== */

setupLikes();

setupSaveButtons();

setupShareButtons();

setupComments();

setupMoreButtons();

setupStories();

setupNavigation();


console.log(
  "FreiPost carregado com sucesso 🚀"
);
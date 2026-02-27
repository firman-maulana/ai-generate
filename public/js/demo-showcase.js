const DEMO_SHOWCASE_API =
  "https://nextsaas-api.vercel.app/api/html?query=homepage";

const demoShowcaseAnimation = {
  init(demoShowcaseList) {
    const demoShowcase = document.querySelector("#demo-showcase");
    const demoShowcaseClose = document.querySelector("#demo-showcase-close");
    const openDemoShowcase = document.querySelector("#open-demo-showcase");
    const demoShowcaseListContainer =
      document.querySelector("#demo-showcase-list");

    const count = (demoShowcaseList && demoShowcaseList.length) || 0;
    document.querySelectorAll(".demo-showcase-count").forEach((el) => {
      el.textContent = count;
    });

    if (
      demoShowcaseListContainer &&
      demoShowcaseList &&
      demoShowcaseList.length > 0
    ) {
      demoShowcaseListContainer.innerHTML = demoShowcaseList
        .map(
          (item, index) => `
            <div class="col-span-12 md:col-span-6 xl:col-span-4">
              <a href="${item.href}" data-card-index="${index}"
                class="demo-card block border cursor-pointer border-stroke-3 group hover:border-primary-400 transition-all duration-300 ease-in-out max-w-[500px] mx-auto rounded-[36px] p-2">
                <div class="p-2 bg-white rounded-[28px] shadow transition-all">
                  <figure class="max-h-[351px] rounded-[20px] overflow-hidden">
                    <img src="${item.image}" alt="Demo Showcase" class="w-full h-full object-cover"/>
                  </figure>
                  <h2 class="text-lg text-center font-medium text-secondary flex items-center justify-center gap-2 py-4">
                    ${item.title}
                    ${
                      item.newRelease
                        ? '<span class="bg-ns-green rounded-full px-5 py-[5px] text-tagline-2">New</span>'
                        : ""
                    }
                  </h2>
                </div>
              </a>
            </div>
          `,
        )
        .join("");

      const setActiveCard = (card) => {
        demoShowcaseListContainer
          .querySelectorAll(".demo-card")
          .forEach((c) => {
            c.classList.remove(
              "active",
              "border-primary-500",
              "border-2",
            );
            c.classList.add("border-stroke-3");
          });

        if (card) {
          card.classList.add("active", "border-primary-500", "border-2");
          card.classList.remove("border-stroke-3");
        }
      };

      const activeCardHref = localStorage.getItem("activeDemoCard");
      const activeCard = activeCardHref
        ? demoShowcaseListContainer.querySelector(
            `.demo-card[href="${activeCardHref}"]`,
          )
        : null;

      setActiveCard(
        activeCard ||
          demoShowcaseListContainer.querySelector(".demo-card"),
      );

      demoShowcaseListContainer
        .querySelectorAll(".demo-card")
        .forEach((card) => {
          card.addEventListener("click", () => {
            localStorage.setItem(
              "activeDemoCard",
              card.getAttribute("href"),
            );
            setActiveCard(card);
          });
        });
    }

    openDemoShowcase?.addEventListener("click", () => {
      demoShowcase.classList.remove("demo-showcase-closed");
      requestAnimationFrame(() =>
        demoShowcase.classList.add("demo-showcase-open"),
      );
      document.body.style.overflow = "hidden";
    });

    demoShowcaseClose?.addEventListener("click", () => {
      demoShowcase.classList.remove("demo-showcase-open");
      requestAnimationFrame(() =>
        demoShowcase.classList.add("demo-showcase-closed"),
      );
      document.body.style.overflow = "auto";
    });
  },
};

fetch(DEMO_SHOWCASE_API)
  .then((res) => res.json())
  .then((data) =>
    demoShowcaseAnimation.init(
      (Array.isArray(data) ? data : []).map((item) => ({
        title: item.title,
        image: item.image,
        newRelease: !!item.newRelease,
        href: item.url || item.href || "#",
      })),
    ),
  )
  .catch(() => demoShowcaseAnimation.init([]));
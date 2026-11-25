// --- Posts data ---
// Order: newest first (pinned) → oldest last. Colors mirror the Figma grid tiles.
const posts = [
  {
    pinned: true,
    caption: "관리는 꾸준히",
    hashtags: ["#일상", "#private_care", "#model"],
    likedBy: "jangphotogood",
    date: "2027년 6월 25일",
    photos: [
      { bg: "#c9d3e3", size: "1080×1440" },
      { bg: "#b5c0d4", size: "1080×1440" },
      { bg: "#9fadc2", size: "1080×1440" },
    ],
  },
  {
    hashtags: ["#따뜻한하루", "#카페", "#데일리"],
    likedBy: "cafelover_",
    date: "2027년 1월 28일",
    photos: [
      { bg: "#e6d5c3", size: "1080×1440" },
      { bg: "#d8c3a9", size: "1080×1440" },
      { bg: "#c9b393", size: "1080×1440" },
    ],
  },
  {
    hashtags: ["#산책", "#자연", "#초록"],
    likedBy: "greenwalk",
    date: "2027년 1월 20일",
    photos: [
      { bg: "#b9cbbf", size: "1080×1440" },
      { bg: "#a5bdb0", size: "1080×1440" },
      { bg: "#91ab9b", size: "1080×1440" },
    ],
  },
  {
    caption: "거울 셀카❤",
    hashtags: ["#관리하는모델", "#relax"],
    likedBy: "jangphotogood",
    date: "2027년 6월 5일",
    photos: [
      { bg: "#a9b7cc", size: "1080×1440" },
      { bg: "#8e9db3", size: "1080×1440" },
    ],
  },
  {
    hashtags: [
      "#슬램므", "#밀라노패션위크", "#사랑하는_직원들이랑♥",
      "#퍼컬렉션", "#모피사랑", "#모피는", "#slamme",
    ],
    tagged: ["@legendary_celeb_", "@design_1zzang", "@hottt_model", "@kangstar00700"],
    likedBy: "jangphotogood",
    date: "2027년 2월 1일",
    photos: [
      { bg: "#e3dccb", size: "1080×1440" },
      { bg: "#d1c7af", size: "1080×1440" },
      { bg: "#baa88e", size: "1080×1440" },
    ],
  },
];

// --- DOM ---
const grid = document.getElementById("post-grid");
const modal = document.getElementById("modal");
const mediaTrack = document.getElementById("media-track");
const dots = document.getElementById("dots");
const prevPhotoBtn = document.getElementById("prev-photo");
const nextPhotoBtn = document.getElementById("next-photo");
const prevPostBtn = document.getElementById("prev-post");
const nextPostBtn = document.getElementById("next-post");
const captionText = document.getElementById("caption-text");
const likesEl = document.getElementById("likes");
const dateEl = document.getElementById("date");
const tagBubbles = document.getElementById("tag-bubbles");

// --- Markup helpers ---

function placeholderSVG() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="4" width="19" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="8" cy="10" r="1.8" fill="currentColor"/>
      <path d="m4 18 5-6 4 4 3-3 4 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    </svg>`;
}

// --- Render grid ---
posts.forEach((post, i) => {
  const tile = document.createElement("button");
  tile.className = "tile";
  tile.setAttribute("aria-label", `게시물 ${i + 1} 열기`);
  tile.style.background = post.photos[0].bg;
  tile.dataset.index = String(i);

  if (post.pinned) {
    tile.insertAdjacentHTML(
      "beforeend",
      `<span class="pin" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M16 3 9 10l-4 1 4 4-5 5 1 1 5-5 4 4 1-4 7-7-6-6Z" fill="currentColor"/></svg></span>`,
    );
  }
  if (post.photos.length > 1) {
    tile.insertAdjacentHTML(
      "beforeend",
      `<span class="multi" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="7" y="3" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="7" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></span>`,
    );
  }

  tile.addEventListener("click", () => openModal(i));
  grid.appendChild(tile);
});

// --- Modal state ---
let currentPost = 0;
let currentPhoto = 0;

function openModal(postIndex) {
  currentPost = postIndex;
  currentPhoto = 0;
  renderModal();
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function renderModal() {
  const post = posts[currentPost];

  // Slides — each slide uses the Figma placeholder style.
  mediaTrack.innerHTML = post.photos
    .map(
      (p) => `
      <div class="slide" style="background:${p.bg}">
        <div class="slide-placeholder">
          ${placeholderSVG()}
          <span>게시물 이미지 · ${p.size}</span>
        </div>
      </div>`,
    )
    .join("");

  // Dots
  if (post.photos.length > 1) {
    dots.innerHTML = post.photos
      .map((_, i) => `<span class="dot${i === currentPhoto ? " is-active" : ""}"></span>`)
      .join("");
  } else {
    dots.innerHTML = "";
  }

  // Inner photo arrows
  const multi = post.photos.length > 1;
  prevPhotoBtn.hidden = !multi || currentPhoto === 0;
  nextPhotoBtn.hidden = !multi || currentPhoto === post.photos.length - 1;

  mediaTrack.style.transform = `translateX(-${currentPhoto * 100}%)`;

  // Outer post arrows
  prevPostBtn.disabled = currentPost === 0;
  nextPostBtn.disabled = currentPost === posts.length - 1;

  // Tag bubbles (only on the first photo, like Instagram)
  if (post.tagged && post.tagged.length && currentPhoto === 0) {
    tagBubbles.innerHTML = post.tagged
      .map((name) => `<span class="tag-bubble">${name}</span>`)
      .join("");
    tagBubbles.hidden = false;
  } else {
    tagBubbles.innerHTML = "";
    tagBubbles.hidden = true;
  }

  // Caption: optional body text, then hashtags rendered in blue
  const hashtags = (post.hashtags || [])
    .map((tag) => `<span class="hashtag">${tag}</span>`)
    .join(" ");
  const body = post.caption ? `<div class="caption-body">${post.caption}</div>` : "";
  captionText.innerHTML = body + hashtags;

  // Likes line: "jangphotogood 님 외 여러 명 이 좋아합니다."
  likesEl.innerHTML = `<b>${post.likedBy}</b> 님 외 <b>여러 명</b> 이 좋아합니다.`;

  // Date
  dateEl.textContent = post.date;
}

function showPhoto(delta) {
  const post = posts[currentPost];
  const next = currentPhoto + delta;
  if (next < 0 || next >= post.photos.length) return;
  currentPhoto = next;
  renderModal();
}

function showPost(delta) {
  const next = currentPost + delta;
  if (next < 0 || next >= posts.length) return;
  currentPost = next;
  currentPhoto = 0;
  renderModal();
}

// --- Events ---
prevPhotoBtn.addEventListener("click", () => showPhoto(-1));
nextPhotoBtn.addEventListener("click", () => showPhoto(1));
prevPostBtn.addEventListener("click", () => showPost(-1));
nextPostBtn.addEventListener("click", () => showPost(1));

modal.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (e) => {
  if (modal.hidden) return;
  if (e.key === "Escape") closeModal();
  else if (e.key === "ArrowLeft") {
    const post = posts[currentPost];
    if (post.photos.length > 1 && currentPhoto > 0) showPhoto(-1);
    else if (currentPost > 0) showPost(-1);
  } else if (e.key === "ArrowRight") {
    const post = posts[currentPost];
    if (post.photos.length > 1 && currentPhoto < post.photos.length - 1) showPhoto(1);
    else if (currentPost < posts.length - 1) showPost(1);
  }
});

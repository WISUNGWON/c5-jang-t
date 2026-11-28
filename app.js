// --- Posts data ---
// Six tiles in reading order (top-left → bottom-right). The first slot is
// intentionally blank to match the Figma frame.
const posts = [
  {
    caption: "SOL",
    comments: [
      { user: "solo_baam", text: "?? 진짜 김솔?" },
      { user: "tnwl_090", text: "김솔의 재발견 ㄷㄷ" },
      { user: "alswn._", text: "김솔.. 모델 인정!!" },
    ],
    likesCount: "100.3만",
    commentsCount: "130",
    sharesCount: "160",
    likedBy: "kimsol_slamme",
    date: "2027년 1월 2일",
    photos: [{ bg: "#ffffff", hidePlaceholder: true }],
  },
  {
    hashtags: ["#플로럴", "#원피스", "#데일리룩"],
    likedBy: "jangphotogood",
    date: "2027년 6월 20일",
    photos: [{ bg: "#efe7f2", hidePlaceholder: true }],
  },
  {
    hashtags: ["#블랙미니", "#슬립드레스", "#파티룩"],
    likedBy: "jangphotogood",
    date: "2027년 6월 10일",
    photos: [{ bg: "#b9cbbf", hidePlaceholder: true }],
  },
  {
    hashtags: ["#레더", "#투피스", "#스튜디오"],
    likedBy: "jangphotogood",
    date: "2027년 5월 28일",
    photos: [{ bg: "#dbdbdb", hidePlaceholder: true }],
  },
  {
    hashtags: ["#시퀸스커트", "#스트릿", "#패션위크"],
    likedBy: "jangphotogood",
    date: "2027년 5월 12일",
    photos: [{ bg: "#e6d5c3", hidePlaceholder: true }],
  },
  {
    hashtags: ["#블랙드레스", "#미니멀", "#쇼룸"],
    likedBy: "jangphotogood",
    date: "2027년 4월 30일",
    photos: [{ bg: "#a9b7cc", hidePlaceholder: true }],
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
const commentsEl = document.getElementById("comments");
const countLikes = document.getElementById("count-likes");
const countComments = document.getElementById("count-comments");
const countShares = document.getElementById("count-shares");

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
  const first = post.photos[0];

  const tile = document.createElement("button");
  tile.className = "tile";
  tile.setAttribute("aria-label", `게시물 ${i + 1} 열기`);
  tile.style.background = first.bg;
  if (first.img) {
    tile.style.backgroundImage = `url("${first.img}")`;
    tile.style.backgroundSize = "cover";
    tile.style.backgroundPosition = "center";
  }
  tile.dataset.index = String(i);

  if (post.photos.length > 1) {
    tile.insertAdjacentHTML(
      "beforeend",
      `<span class="multi" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="7" y="3" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="7" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></span>`,
    );
  }

  if (i === 0) {
    tile.addEventListener("click", () => openModal(i));
  } else {
    tile.disabled = true;
    tile.setAttribute("aria-disabled", "true");
    tile.tabIndex = -1;
  }
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

  // Slides — real image, blank, or Figma placeholder.
  mediaTrack.innerHTML = post.photos
    .map((p) => {
      if (p.img) {
        return `
      <div class="slide" style="background:${p.bg};background-image:url('${p.img}');background-size:cover;background-position:center"></div>`;
      }
      if (p.hidePlaceholder) {
        return `<div class="slide" style="background:${p.bg}"></div>`;
      }
      return `
      <div class="slide" style="background:${p.bg}">
        <div class="slide-placeholder">
          ${placeholderSVG()}
          <span>게시물 이미지 · ${p.size}</span>
        </div>
      </div>`;
    })
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

  // Outer post arrows — only the first post is clickable, so hide both.
  prevPostBtn.disabled = true;
  nextPostBtn.disabled = true;

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

  // Caption: username + optional caption + hashtags, all inline on one row.
  const hashtags = (post.hashtags || [])
    .map((tag) => `<span class="hashtag">${tag}</span>`)
    .join(" ");
  const body = post.caption ? ` <span class="caption-body">${post.caption}</span>` : "";
  const sep = hashtags ? " " : "";
  captionText.innerHTML = `<b class="caption-user">jangphotogood</b>${body}${sep}${hashtags}`;

  // Comments (shown under the caption, same visual treatment as Figma)
  commentsEl.innerHTML = (post.comments || [])
    .map(
      (c) => `
      <li class="comment">
        <div class="avatar avatar--sm" aria-hidden="true"></div>
        <div class="comment-text"><b>${c.user}</b> ${c.text}</div>
      </li>`,
    )
    .join("");

  // Action counts
  countLikes.textContent = post.likesCount || "";
  countComments.textContent = post.commentsCount || "";
  countShares.textContent = post.sharesCount || "";

  // Likes line: "kimsol_slamme 님 외 여러 명 이 좋아합니다."
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

let timerComment;

window.onload = function () {
  timerComment = setInterval(comment, 3000); // 3秒ごとに更新
}

const commentList = [
  "初めまして！<br>苓北町の魅力、も〜〜っと伝えるばい！",
  "苓北町は、海も山もあって自然がいっぱい！",
  "地元は苓北たい！<br>あたは？",
  "頭のは海藻じゃないけん！<br>苓北のだごうまかレタスたい！",
  "地元の人たちも優しいけん<br>温かい雰囲気が最高たい！",
  "新鮮な海の幸に美味しいレタスやみかん！食べ物も最高ばい！",
  "苓北には観光スポットもたくさんあるけん、ぜひ遊びに来てみらんね！"
];

const comment = () => {
  const el = document.getElementById("rei-comment");
  let num = Math.floor(Math.random() * commentList.length);

  // フェードアウト
  el.classList.add("fade-out");

  // 少し待ってから内容変更 → フェードイン
  setTimeout(() => {
    el.innerHTML = commentList[num];
    el.classList.remove("fade-out");
  }, 300); // CSSのtransitionと合わせる
}

const showComment = () => {
  clearInterval(timerComment);
  comment();
  timerComment = setInterval(comment, 6000);
}


const circles = document.querySelectorAll(".circle");

const overlay = document.querySelector(".overlay");

circles.forEach(circle => {
  circle.addEventListener("click", () => {
    const target = circle.dataset.target;


    document.querySelectorAll(".modal").forEach(m => {
      m.classList.remove("active");
    });

    document.getElementById(target).classList.add("active");
    overlay.classList.add("active");

    document.body.style.paddingRight = scrollbarWidth + "px";
    document.body.classList.add("no-scroll");
  });
});

overlay.addEventListener("click", () => {
  document.querySelectorAll(".modal").forEach(m => {
    m.classList.remove("active");
  });
  overlay.classList.remove("active");
  document.body.style.paddingRight = "";
  document.body.classList.remove("no-scroll");
});

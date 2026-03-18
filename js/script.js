
window.onload = function () { 
  timerComment();
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
  let num = Math.floor(Math.random() * 5);

  // フェードアウト
  el.classList.add("fade-out");

  // 少し待ってから内容変更 → フェードイン
  setTimeout(() => {
    el.innerHTML = commentList[num];
    el.classList.remove("fade-out");
  }, 300); // CSSのtransitionと合わせる
}

const timerComment=()=>{
  setInterval(comment, 6000);
}

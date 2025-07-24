const zoomImg = document.createElement("img");
zoomImg.id = "hover-zoom-img";
document.body.appendChild(zoomImg);

document.addEventListener("mousemove", (e) => {
  const target = e.target;

  if (target.tagName === "IMG" && target.src) {
    let src = target.currentSrc || target.src;

    // YouTube thumbnail high-res replacement
    if (src.includes("i.ytimg.com")) {
      src = src.replace(/(hqdefault|mqdefault|default|sddefault)\.jpg/, "maxresdefault.jpg");
    }

    zoomImg.src = src;
    zoomImg.style.display = "block";
    zoomImg.style.top = `${e.pageY + 20}px`;
    zoomImg.style.left = `${e.pageX + 20}px`;

    // Optional: scale image to fit screen
    zoomImg.onload = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      zoomImg.style.width = zoomImg.naturalWidth > vw ? `${vw * 0.9}px` : `${zoomImg.naturalWidth}px`;
      zoomImg.style.height = zoomImg.naturalHeight > vh ? `${vh * 0.9}px` : `${zoomImg.naturalHeight}px`;
    };
  } else {
    zoomImg.style.display = "none";
  }
});

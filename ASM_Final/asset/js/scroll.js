const scrollToTopBtn = document.getElementById('btn-scroll-top')
window.onscroll = () => {
    if (window.pageYOffset >= 200) {
        scrollToTopBtn.classList.remove('d-none')
    } else {
        scrollToTopBtn.classList.add('d-none')
    }
}
scrollToTopBtn.onclick = () => {
    window.scroll(0, 0)
}
const sidebarTriggerBtn = document.querySelector(".sidebar-button");
const topMenuTriggerBtn = document.querySelector(".top-menu-button");

sidebarTriggerBtn.addEventListener('click', function(){
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("sidebar--open");
})

topMenuTriggerBtn.addEventListener('click', function(){
    const topMenuPane = document.getElementById("top-menu-pane-pc");
    topMenuPane.classList.toggle("top-menu-pane--open");
})





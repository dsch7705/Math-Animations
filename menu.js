const element = document.querySelector("#projects");

class project_dropdown
{
    constructor()
    {
        this.open = false;
        this.items = [];
        this.div = document.createElement('div');
        this.div.id = "dropdown";
        this.div.style.zIndex = 9999;

        element.appendChild(this.div);
    }


}

// Event listeners
let dd = new project_dropdown();
element.addEventListener('mouseenter', () => {
    dd.open = true;
    dd.div.style.height = '40vw';
});
element.addEventListener('mouseleave', () => {
    dd.open = false;
    dd.div.style.height = 0;
});

//window.onload(new project_dropdown())
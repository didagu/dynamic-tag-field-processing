class Utils {

    constructor(){
        this.tags = []
    }

    clearFields() {
        const fields = document.getElementsByClassName("tag-result")

        Array.prototype.forEach.call(fields, (field) => {
            field.style.display = 'none'
        })
    }

    clearInput() {
        document.getElementById('tag-input').value=''
        this.clearFields()
    }

    underlineSearchedString(searched_string){
        const fields = document.getElementsByClassName("tag-alternative-name")

        Array.prototype.forEach.call(fields, (field) => {
            // console.log(field)   
        })
    }

    stripHtmlTags(html) {
        var tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText;
    }

    contains(arr, value){
        return arr.some((arr_value) => {
            return arr_value.toLowerCase().includes(value)
        })
    }

    attachClickListener(){
        const tags = document.getElementById("tags")
        const userSelection = document.getElementsByClassName('tag-result');

        Array.prototype.forEach.call(userSelection, (item, index) => {
            
            item.addEventListener("click", () => {
                if(this.tags.indexOf(index) < 0){

                    let tag_span = document.createElement('span')
                    tag_span.setAttribute("class", "tag")
                    tag_span.setAttribute("data-index", index)
                    tag_span.innerHTML = `&nbsp;&nbsp;${tagList[index].Title}`

                    let remove_span = document.createElement('span')
                    remove_span.setAttribute("class", "selection-remove")
                    remove_span.innerText = 'x'

                    remove_span.addEventListener("click", () => this.removeTag(tag_span))

                    tag_span.insertAdjacentElement('afterbegin', remove_span)

                    tags.appendChild(tag_span)
                    this.clearInput()

                    this.tags.push(index)
                } else {
                    alert('You have already added that tag')
                    this.clearInput()
                }
            })
        })

    }

    removeTag(tag_span) {
        tag_span.remove()
        const position = this.tags.indexOf(Number(tag_span.dataset.index))
        if (position > -1) {
            this.tags.splice(position, 1)
        }
    }
    


}
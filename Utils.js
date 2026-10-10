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

    createTagResult(tag) {
        const result = document.createElement('div')
        result.className = 'tag-result'
        result.id = tag.Id

        const title = document.createElement('span')
        title.className = 'tag-title'
        title.textContent = tag.Title
        const bold = document.createElement('b')
        bold.appendChild(title)

        const description = document.createElement('p')
        description.className = 'tag-description'
        description.textContent = tag.Description

        const alternativeNames = document.createElement('div')
        alternativeNames.className = 'tag-alternative-names'
        tag.AlternativeNames.forEach(alternative_name => {
            const name = document.createElement('div')
            name.className = 'tag-alternative-name'
            name.textContent = alternative_name
            alternativeNames.appendChild(name)
        })

        result.append(bold, description, alternativeNames)
        return result
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
                    tag_span.textContent = `\u00a0\u00a0${tagList[index].Title}`

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
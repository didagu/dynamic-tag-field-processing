class Utils {

    constructor(){
        this.tags = []
    }

    clearFields() {
        const fields = document.getElementsByClassName("tag-result")

        Array.prototype.forEach.call(fields, (field) => {
            field.style.display = 'none'
        })
        this.setActive(null)
        document.getElementById('tag-input').setAttribute('aria-expanded', 'false')
    }

    clearInput() {
        const input = document.getElementById('tag-input')
        input.value=''
        input.focus()
        this.clearFields()
    }

    visibleResults() {
        return Array.prototype.filter.call(document.getElementsByClassName('tag-result'), (result) => {
            return result.style.display === 'block'
        })
    }

    moveActive(step) {
        const results = this.visibleResults()
        if (results.length === 0) {
            return
        }

        const current = results.findIndex((result) => result.classList.contains('active'))
        const next = current < 0
            ? (step > 0 ? 0 : results.length - 1)
            : (current + step + results.length) % results.length
        this.setActive(results[next])
    }

    setActive(result) {
        const input = document.getElementById('tag-input')
        const previous = document.querySelector('.tag-result.active')
        if (previous) {
            previous.classList.remove('active')
            previous.setAttribute('aria-selected', 'false')
        }

        if (result) {
            result.classList.add('active')
            result.setAttribute('aria-selected', 'true')
            input.setAttribute('aria-activedescendant', result.id)
            result.scrollIntoView({ block: 'nearest' })
        } else {
            input.removeAttribute('aria-activedescendant')
        }
    }

    underlineSearchedString(result, searched_string){
        const fields = result.querySelectorAll('.tag-title, .tag-alternative-name')

        Array.prototype.forEach.call(fields, (field) => {
            const text = field.textContent
            const start = text.toLowerCase().indexOf(searched_string)
            if (start < 0) {
                field.textContent = text
                return
            }

            const match = document.createElement('span')
            match.className = 'underline'
            match.textContent = text.slice(start, start + searched_string.length)
            field.replaceChildren(text.slice(0, start), match, text.slice(start + searched_string.length))
        })
    }

    createTagResult(tag) {
        const result = document.createElement('div')
        result.className = 'tag-result'
        result.id = tag.Id
        result.setAttribute('role', 'option')
        result.setAttribute('aria-selected', 'false')

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

                    let remove_span = document.createElement('button')
                    remove_span.setAttribute("type", "button")
                    remove_span.setAttribute("class", "selection-remove")
                    remove_span.setAttribute("aria-label", `Remove ${tagList[index].Title}`)
                    remove_span.textContent = 'x'

                    remove_span.addEventListener("click", () => this.removeTag(tag_span))

                    tag_span.insertAdjacentElement('afterbegin', remove_span)

                    tags.appendChild(tag_span)
                    this.clearInput()

                    this.tags.push(index)
                }
            })
        })

    }

    removeTag(tag_span) {
        tag_span.remove()
        document.getElementById('tag-input').focus()
        const position = this.tags.indexOf(Number(tag_span.dataset.index))
        if (position > -1) {
            this.tags.splice(position, 1)
        }
    }
}

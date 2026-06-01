function  validateTitle (title: string):boolean {
    return title.trim().length>=2
}

function  validateDescription (description: string):boolean {
    return description.trim().length>=10
}

export function getValidationErros(field: string, value: string): string |null {
    if (field === 'title' && !validateTitle(value)) {
         return 'Title must be at least 2 characters long'
    }
    if (field === 'description' && !validateDescription(value)) {
         return 'Description must be at least 10 characters long'
    }
    return null
}


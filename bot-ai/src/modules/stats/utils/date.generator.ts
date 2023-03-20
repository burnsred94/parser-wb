

export class DateGenerator {
   date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`

    async generateDateMouth(){
        const dateArray = []
        const currentDate = this.date.split('-')
        for (let i = 1; i < 32; i++) {
            const date = currentDate[0] + '-' + currentDate[1] + '-' + i
            dateArray.push(date)
        }

        return dateArray
    }
}
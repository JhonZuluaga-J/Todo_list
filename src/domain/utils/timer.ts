export function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);

    // usamos % para sacar el resto de seconds asi descuntar el tiempo de la hora
    // y luego dividirlo por 60 para obtener los minutos
    const minutes = Math.floor((seconds % 3600) / 60);
    
    // aca tambien lo usamos para obtener el resto de seconds
    const secondsPart = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secondsPart.toString().padStart(2, '0')}` 
}

export function parseTiem(timeString: string):number {
    const [hours, minutes, secondsPart] = timeString.split(":").map(Number)
    return hours * 3600 + minutes * 60 + secondsPart
}

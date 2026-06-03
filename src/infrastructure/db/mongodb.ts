import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if(!MONGODB_URI){
    throw new Error('MONGODB_URI is not defined in emvironment variables')
}

interface MongooseCache {
    conn: typeof mongoose |null // aca este indica si ya tenemos una conexion con mongoose 
    promise: Promise<typeof mongoose> |null //  y este la promesa que esta en proceso en ese momneto 
}

declare global {
    var _mongooseCache: MongooseCache     // Declaramos _mongooseCache como variable global para mantener una única conexión
    // a la base de datos en todo el proyecto. Usamos 'var' para que esta variable
    // sea accesible y modificable desde cualquier módulo.
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null,
     promise: null}
global._mongooseCache =cached// aca nos aseguramos que el cache siempre tenga la estructura correta ya qu ese puede cambiar desde cualquier parte y si no exita conexion lo pone como nul


export async function connectDB(): Promise<typeof mongoose> {
    if(cached.conn)return cached.conn //aca si la conecion ya exite devolvemo para ser utilizada

    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI!, {
            bufferCommands: false,
        })
    }

    cached.conn = await cached.promise
    return cached.conn
}
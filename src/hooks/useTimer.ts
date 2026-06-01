"use client"

//importamos los hooks de react como useState y useEffect
// ya que este trabaja por estados y usamso estos para dacir este es el estado original 
// esta es la acion que se ejecuta cuando el estado cambia
// asi react sabe que hacer cuando el estado cambia y renderiza el componente
// esto ya qu eno hay memoria entre  renderizaciones
// ya que react no deja el objetos vivos en memoria ocupando espacio
// si no que los recrea cada vez y amenos de que guardemos el estado en un hook
// como useState o useEffect este no tendra recuerdos de como era este solo ejecuta la funcion del 
//hook cada vez y renderiza es omponente nuevamente 
//import { useState, useEffect } from "react";

import {useEffect, useState } from 'react'
import { formatTime } from "@/domain/utils/timer"

// esto aca es simple lo usamos para poder avisar de un cambio como tal sin tod sestos datos el objeto seria una caja vacia y react seria dificil decirle que cambio algo 
// esto es como si quiere usar este hook puede si quires agregar ua funcion  con estos parametros 
interface TimerCallbacks {
    onToggle?: (id: string, isRunning: boolean, seconds: number) => void
}




interface UseTimersReturn {
    timers: Record<string, {seconds: number; isRunning: boolean}>;
    toggle: (id: string ) => void;
    getFormattedTime: (id: string) => string;
    getSeconds: (id: string) => number;
}

// creamos nuestro hook personalizado donde utilizamos el callback 
// que cremaos naterios mente como paramentro opcional y asi si no dan una funion a esta funcion como parametro 
// nos dal un callback con los paramentro que necesitamos 
export function useTimers( callbacks?: TimerCallbacks): UseTimersReturn {
    // aca vamos a hacer un dicionario practicamnete para bucar mas ficil como decimos que es un dicionraio con el recod
    // y al final las llaves en el parentecis le dicen i nicia como un objeto vacio 
    const [timers, setTimers] = useState<Record<string, {seconds: number; isRunning: boolean}>>({})

    // cuando accionamos el interruptor est recive como parametro el id 
    // luego revisa los estado previo de este id bucandolo
    // esto se hace para no generar conflictos de estados por que una tarea tenga dos estados  distintos
    // y si la tare no se encunetar es que nunca se habia iniciado y se genra el estado inicial
    const toggle = (id: string) => {
        setTimers(prev => {
            const current = prev[id] ||{seconds: 0, isRunning: false};
            //ahora hacemos una funcion que haga que el estado actual sea de running s einvierta }
            //  si esta false lo vuelve true y viceversa
            const newIsRunning = !current.isRunning;

            //aca ya ejecutamos la funion de mi hook el objetivo depues de buscar los dato 
            //mira hay un callbak agrgegado opcional para que no rompa . ahora ejecucta toggle? 
            // y si cuanod me mandaste los datos no escribiste el toggle bien o no lo hcicite es ocional 
            callbacks?.onToggle?.(id, newIsRunning, current.seconds )

            return{
                ...prev,
                [id]: {
                    seconds: current.seconds,
                    isRunning: newIsRunning
                }
            }
        })
    }
    const getFormattedTime = (id:string) =>{
        return formatTime(timers[id]?.seconds || 0)
    }

    const getSeconds = (id:string) => {
        return timers[id]?.seconds || 0
    }


    // ahora abrimos un ciclo de vida de react dond el edecimos escucha los cambios 
    // en las depedencia que te voy a mandar y ejecuta esto ys qu ees un efecto secundario  
    useEffect(() => {

        //aca le deicimos con record que es un dicionario y su clave es type number
        // y que su valor es el la clave del un objeto en el dicionario de setinterval 
        //porque setinterval y no interval porque  set interval guada cada dato corriendo individualmente
        // y  que cambia cosntantemente y modifica interval  
        const intervals: Record<string, ReturnType<typeof setInterval>> = {}

        // object.entries permite covertir el dicionario en una array para poder forquearlo y saber si la tarea esta en running esi saber los datos de esta 
        // para que tener la facilidad de buscar en un dicionario y el recorrido de una array 
        // usamos id y timer para decir la clave del ubjeto va ser nuestro id y el timer todo el valor toda la data de este 
        Object.entries(timers).forEach(([id, timer]) => {
            // ahora para que hacemos esto este es el conometro asi que vamos validar si esta inRunning para empesar a ejecutar 
            if(timer.isRunning) {
                // ahora creamos el proceso asyncrono y ponemos id timpo number ya que si te acuerdas arriba lo comvertimos en string
                intervals[String(id)] = setInterval(() =>{
                    // aca vamos a abrir settimer hacemso spreed opertor par traer todas las tares 
                    // lueg abrimos la qu etiene el id correcto y copiamos todo lo que hay en esta con otro spree opertion asi tramemos es
                    // todo el objeto modificado de la funcion toggle anterior 
                    // y por ultimo  cambiamos el valor de sencods agregando un segundo mas 
                    setTimers(prev => ({
                        ...prev,
                        [String(id)]:{
                        ...prev[String(id)],
                        seconds: prev[String(id)].seconds + 1
                        }
                    }))
                }, 1000)
            }
        })
        return () => {
            Object.values(intervals).forEach(clearInterval)
        }
    }, [timers])
    return{
        timers,
        toggle,
        getFormattedTime,
        getSeconds,
    }
}



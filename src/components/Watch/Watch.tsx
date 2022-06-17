import React, { FC, useState, useEffect, useCallback } from 'react'
import { ITimezones } from './../consts/timezones'
import tz from './../../timezones.json'
import './index.css'

type clock = number | string 

const Watch:FC = () => {
    const [seconds, setSeconds] = useState<number>(0)
    const [minutes, setMinutes] = useState<number>(0)
    const [hours, setHours] = useState<number>(0)
    const [clock, setClock] = useState<string>(' ')
    const [timezone, setTimezone] = useState<number>(0)
    const [timezones, setTimezones] = useState<ITimezones[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const timer = setTimeout(()=>{
        const day = new Date();
        let h: clock =  getHours(day)
        let m: clock = day.getMinutes()
        let s: clock = day.getSeconds()
        setHours(h * 30 + 180)
        setMinutes(m * 6 + 180)
        setSeconds(s * 6 + 180)
        if(h< 10) h = "0" + h
        if(m< 10) m = "0" + m
        if(s< 10) s = "0" + s
        setClock(h + ':' + m + ':' + s)
    },1000)

    useEffect(()=>{
        return clearTimeout(timer)
    },[])

    useEffect(()=>{
        if(timezones.length<1) setIsLoading(true)
        else setIsLoading(false)
        // imitation HTTP-request
        setTimeout(()=>{
            setTimezones(tz)
            setTimezone(2)
        },1000)
        
    },[timezones])
   
    const getHours = useCallback((day:Date) : number => {
        const curTimezone = day.getTimezoneOffset()/60 + timezone
        const h: clock = day.getHours() + curTimezone
        return h
    }, [timezone, hours, minutes])

    function timezoneHandler(e:any) {
        setTimezone(Number(e?.target?.value))
    }
    
    return (
        <div className='watch'>
            <div className="clock">
                <div className="hour">
                    <div className="hr" style={{transform: `rotateZ(${hours + minutes/12}deg)`}}/>
                    <div className="mn" style={{transform: `rotateZ(${minutes}deg)`}}/>
                    <div className="sc" style={{transform: `rotateZ(${seconds}deg)`}}/>
                </div>
            </div> 
            <span className='digitClock'>{clock}</span>
            {
                isLoading 
                ? <span>идет загрузка...</span> 
                :  <select onChange={timezoneHandler}>
                     <option value={timezones[0]?.timezone || 0}>{timezones[0]?.name ?? ''}</option>
                        { timezones.map((el:ITimezones)=> (
                            <option 
                                key = {el.name} 
                                value={el.timezone} 
                            >
                                {el.name}
                            </option>
                        ))}
                    </select>
            }
        </div>
       
    )
}

export default Watch
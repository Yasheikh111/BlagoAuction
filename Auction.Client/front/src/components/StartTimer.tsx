import React, { useEffect, useState } from 'react';

interface TimerProps {
    startDate: Date;
}

const StartTimer: React.FC<TimerProps> = ({ startDate }) => {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    const updateTime = () => {
        console.log(startDate)
        const currentTime = new Date().getTime();
        const remainingTime = startDate.getTime() - currentTime;

        setTimeRemaining(remainingTime);
    }


    useEffect(() => {
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [startDate]);

    const formatTime = (time: number): string => {
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / 1000 / 60) % 60);
        const hours = Math.floor((time / 1000 / 60 / 60));

        return `${Math.max(hours,0) }:${Math.max(minutes,0) }:${Math.max(seconds,0) }`;
    };

    return (<div className={"text-" + (timeRemaining > 5000 ? "default" : "primary shadow shadow-blue-200")}>{formatTime(timeRemaining)}</div>);
};

export default StartTimer;
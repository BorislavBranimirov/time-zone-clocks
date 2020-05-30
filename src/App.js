import React, { useEffect, useState, useRef } from 'react';
import Menu from './components/Menu';
import Clock from './components/Clock';
import moment from 'moment-timezone';
import shortid from 'shortid';
import './style.scss';

const App = () => {
    const [time, setTime] = useState(null);
    const [clocks, setClocks] = useState([]);
    const [meridiem, setMeridiem] = useState(false);
    const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
    const draggedClockId = useRef(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(moment());
        }, 1000);

        setMeridiem(localStorage.getItem('meridiem') === 'true');

        setDateFormat(localStorage.getItem('dateFormat') || 'DD/MM/YYYY');

        const localStorageClocks = JSON.parse(localStorage.getItem('clocks')) || [];
        if (localStorageClocks.length === 0) {
            addClock('Local', 'silver');
        } else {
            setClocks(localStorageClocks);
        }

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    const addClock = (timezone, backgroundColor) => {
        const newClock = { id: shortid.generate(), timezone, backgroundColor };
        const newClocks = [...clocks, newClock];
        setClocks(newClocks);
        localStorage.setItem('clocks', JSON.stringify(newClocks));
    };

    const removeClock = (id) => {
        const newClocks = clocks.filter((clock) => clock.id !== id);
        setClocks(newClocks);
        localStorage.setItem('clocks', JSON.stringify(newClocks));
    };

    const changeColorClock = (id, color) => {
        const newClocks = clocks.map((clock) => {
            let newClock = { ...clock };
            if (newClock.id === id) {
                newClock.backgroundColor = color;
            }
            return newClock;
        });
        setClocks(newClocks);
        localStorage.setItem('clocks', JSON.stringify(newClocks));
    };

    const handleDragStart = (e) => {
        draggedClockId.current = e.target.id;
    };

    const handleDragEnd = (e) => {
        draggedClockId.current = null;
    };

    const handleDragEnter = (e) => {
        const el = e.target.closest('.clock');
        if (el.id === draggedClockId.current) {
            return;
        }

        let oldClockObj = null;
        let newIndex = null;
        let newClocks = clocks.filter((clock, index) => {
            if (clock.id === draggedClockId.current) {
                oldClockObj = clock;
            }
            if (clock.id === el.id) {
                newIndex = index;
            }
            return clock.id !== draggedClockId.current;
        });

        newClocks.splice(newIndex, 0, oldClockObj);
        setClocks(newClocks);
    };

    let clockList = clocks.map((clock) => {
        return (<Clock
            key={clock.id}
            id={clock.id}
            time={time}
            timezone={clock.timezone}
            backgroundColor={clock.backgroundColor}
            handleRemove={removeClock}
            handleColorChange={changeColorClock}
            dateFormat={dateFormat}
            meridiem={meridiem}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleDragEnter={handleDragEnter}
            clocksCount={clocks.length}
        />);
    });

    return (
        <React.Fragment>
            <Menu
                addClockHandler={addClock}
                meridiem={meridiem}
                setMeridiem={setMeridiem}
                dateFormat={dateFormat}
                setDateFormat={setDateFormat}
            />
            <div className="clocks-container">
                {clockList}
            </div>
        </React.Fragment>
    );
};

export default App;
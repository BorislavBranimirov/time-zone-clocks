import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment-timezone';

const Menu = (props) => {
    const [hideMenu, setHideMenu] = useState(true);
    const menuRef = useRef(null);
    const [timezone, setTimezone] = useState('Local');
    const [color, setColor] = useState('silver');
    const [hideColorPicker, setHideColorPicker] = useState(true);
    const colors = useRef([
        'silver',
        'orange',
        'lightblue',
        'darkolivegreen',
        'lightsalmon',
        'indianred',
        'lightsteelblue',
        'thistle',
        'wheat',
        'teal',
        'mediumpurple',
        'lightslategrey',
    ]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setHideMenu(true);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    const handleClick = (e) => {
        if (!moment.tz.zone(timezone) && timezone !== 'Local') {
            alert('Invalid timezone');
            return;
        }
        props.addClockHandler(timezone, color);
    };

    const timezoneOptions = moment.tz.names().map((z) => {
        return <option key={z} value={z} />;
    });

    const colorOptions = colors.current.map((c) => {
        return (
            <span
                key={c}
                className="color-picker-option"
                style={{ backgroundColor: c }}
                onClick={(e) => setColor(e.target.style.backgroundColor)}
            ></span>
        );
    });

    return (
        <div>
            {hideMenu ? (
                <button
                    className="reveal-menu-btn"
                    onClick={() => setHideMenu(false)}
                >
                    <i className="fas fa-angle-right fa-3x"></i>
                </button>
            ) : (
                <div className="menu" ref={menuRef}>
                    <button
                        className="reveal-menu-btn"
                        onClick={() => setHideMenu(true)}
                    >
                        <i className="fas fa-angle-left fa-3x"></i>
                    </button>
                    <div className="global-settings-form">
                        <label htmlFor="date-format">Date format:</label>
                        <select
                            id="date-format"
                            value={props.dateFormat}
                            onChange={(e) => {
                                localStorage.setItem(
                                    'dateFormat',
                                    e.target.value
                                );
                                props.setDateFormat(e.target.value);
                            }}
                        >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                        </select>
                        <div className="meridiem">
                            <label htmlFor="meridiem">
                                12-hour clock:
                                <input
                                    type="checkbox"
                                    id="meridiem"
                                    checked={props.meridiem}
                                    onChange={() => {
                                        localStorage.setItem(
                                            'meridiem',
                                            !props.meridiem
                                        );
                                        props.setMeridiem(!props.meridiem);
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="create-clock-form">
                        <label htmlFor="timezone-input">Time zone:</label>
                        <input
                            type="text"
                            id="timezone-input"
                            list="timezonesdl"
                            onChange={(e) => setTimezone(e.target.value)}
                            value={timezone}
                        />
                        <datalist id="timezonesdl">
                            <option key="Local" value="Local" />
                            {timezoneOptions}
                        </datalist>
                        <label htmlFor="color">Background color:</label>
                        <button
                            id="color"
                            className="color-picker"
                            style={{ backgroundColor: color }}
                            onClick={() => setHideColorPicker(!hideColorPicker)}
                        ></button>
                        {!hideColorPicker && (
                            <div className="color-picker-menu">
                                {colorOptions}
                            </div>
                        )}
                        <button
                            className="create-clock-btn"
                            onClick={handleClick}
                        >
                            Create Clock
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;

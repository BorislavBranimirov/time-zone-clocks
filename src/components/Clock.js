import React, { useEffect, useState, useRef } from 'react';

const Clock = (props) => {
    const [time, setTime] = useState(null);
    const [title, setTitle] = useState(null);
    const [backgroundColor, setbackgroundColor] = useState(null);
    const [timeFormat, setTimeFormat] = useState(null);
    const [hideColorMenu, setHideColorMenu] = useState(true);
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
    const originalColor = useRef(null);

    useEffect(() => {
        let title = props.timezone || 'Local';
        // for time zones where cities are listed together with country or continent, keep only the city's name
        if (title.indexOf('/') >= 0) {
            let tempArr = title.split('/');
            title = tempArr[tempArr.length - 1];
        }
        // replace any underscores with spaces
        if (title.indexOf('_') >= 0) {
            title = title.replace(/_/g, ' ');
        }
        setTitle(title);

        setbackgroundColor(props.backgroundColor);

        setTimeFormat(timeFormat);
    }, []);

    useEffect(() => {
        if (!props.time) return;

        const time =
            props.timezone && props.timezone !== 'Local'
                ? props.time.clone().tz(props.timezone)
                : props.time.clone();
        setTime(time);
    }, [props.time]);

    const handleRemove = () => {
        props.handleRemove(props.id);
    };

    const handleColorHover = (e) => {
        // save the current background color in a separate variable
        originalColor.current = backgroundColor;
        // change the background color to the hovered one
        setbackgroundColor(e.target.style.backgroundColor);
    };

    const handleColorExitHover = (e) => {
        if (originalColor.current !== null) {
            // retrieve the original pre-hover color and set the background color to it
            setbackgroundColor(originalColor.current);
            // clear the original color variable
            originalColor.current = null;
        }
    };

    const handleColorClick = (e) => {
        // set the background color to the clicked one
        setbackgroundColor(e.target.style.backgroundColor);
        props.handleColorChange(props.id, e.target.style.backgroundColor);
        // remove the original color variable, so when you stop hovering the exit hover handler doesn't run
        originalColor.current = null;
        setHideColorMenu(true);
    };

    const colorOptions = colors.current.map((c) => {
        return (
            <span
                key={c}
                className="clock-color-picker-option"
                style={{ backgroundColor: c }}
                onMouseEnter={handleColorHover}
                onMouseLeave={handleColorExitHover}
                onClick={handleColorClick}
            ></span>
        );
    });

    let clocksFontClass = 'defaultClockFont';
    if (props.clocksCount === 1) clocksFontClass = 'oneClockFont';
    if (props.clocksCount === 2) clocksFontClass = 'twoClockFont';

    return (
        <div
            className="clock"
            id={props.id}
            style={{ backgroundColor }}
            onDragStart={props.handleDragStart}
            onDragEnd={props.handleDragEnd}
            onDragEnter={props.handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            draggable
        >
            {time ? (
                <React.Fragment>
                    <button className="clock-delete-btn" onClick={handleRemove}>
                        <i className="fas fa-times fa-3x"></i>
                    </button>
                    <button
                        className="clock-color-picker"
                        onClick={() => setHideColorMenu(!hideColorMenu)}
                    >
                        <i className="fas fa-tint fa-2x"></i>
                    </button>
                    {hideColorMenu ? (
                        <div className={`clock-text ${clocksFontClass}`}>
                            <p className="clock-name">{title}</p>
                            <p className="clock-day">{time.format('dddd')}</p>
                            <p className="clock-date">
                                {time.format(props.dateFormat || 'DD/MM/YYYY')}
                            </p>
                            <p className="clock-time">
                                {time.format(
                                    props.meridiem ? 'hh:mm:ss A' : 'HH:mm:ss'
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="clock-color-picker-menu">
                            {colorOptions}
                        </div>
                    )}
                </React.Fragment>
            ) : (
                <div className={clocksFontClass}>Loading...</div>
            )}
        </div>
    );
};

export default Clock;

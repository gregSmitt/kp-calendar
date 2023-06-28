import './index.scss'
import { ReactComponent as DecreaseIcon } from 'assets/images/Icon_decrease.svg';
import { ReactComponent as DecreaseIconDisabled } from 'assets/images/Icon_decrease_disabled.svg';
import { ReactComponent as IncreaseIconDisabled } from 'assets/images/Icon_increase_disabled.svg';
import { ReactComponent as IncreaseIcon } from 'assets/images/Icon_increase.svg';
import { useState } from 'react';

const Counter = ({title, desc, onChange, minCount=0, defaultValue=0, onIncrease, onDecrease, maxCount=Infinity})=>{
    const [counter, setCounter] = useState(defaultValue)
    const changeHandler = (counter) =>{
        if(onChange) onChange(counter)
    }
    const increase=()=>{
        if (counter < maxCount) {
            const newCounter = counter + 1
            setCounter(newCounter)
            changeHandler(newCounter)
            if (onIncrease) onIncrease(newCounter)
        }
    }
    const decrease=()=>{
        if (counter > minCount) {
            const newCounter = counter - 1
            setCounter(newCounter)
            changeHandler(newCounter)
            if (onDecrease) onDecrease(newCounter)
        }
    }
    return(
        <div className='kp-select-hotel__counter kp-counter'>
            <div className='kp-counter__col'>
                <p className='kp-counter__title kp-text-crusader'>{title}</p>
                {desc && <p className='kp-counter__desc kp-text-ranger'>{desc}</p>}
            </div>
            <div className='kp-counter__row'>
                <button type='button' className={`kp-counter__decrease${counter <= minCount ? ' disable' : ''}`} onClick={decrease}>
                    {counter <= minCount ? <DecreaseIconDisabled/>:<DecreaseIcon />}
                </button>
                <p className='kp-counter__value kp-text-boomboom'>{counter}</p>
                <button type='button' className={`kp-counter__increase${counter >= maxCount ? ' disable' : ''}`} onClick={increase}>
                    {counter >= maxCount ? <IncreaseIconDisabled/>:<IncreaseIcon />}
                </button>
            </div>
        </div>
    )
}

export default Counter
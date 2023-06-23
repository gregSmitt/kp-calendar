import './index.scss'

const ButtonSelect = ({title, text, isActive, onClick, classMarker=''}) =>{
    const activeClass = isActive? ' active': ''
    return(
        <div className={`kp-button-select${activeClass} ${classMarker}`} onClick={onClick}>
            <span className={`kp-button-select__title kp-text-ranger ${classMarker}`}>{title}</span>
            <p className={`kp-button-select__value kp-text-spark ${classMarker}`}>{text}</p>
        </div>
    )
}

export default ButtonSelect
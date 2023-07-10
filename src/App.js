import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.scss";
import ru from "date-fns/locale/ru";
import KPDatePicker from "Components/KPDatePicker";
import { useState } from "react";
import Counter from "Components/Counter";
import useOnClickOutside from "Components/hooks";
import { useRef } from "react";
import { declOfNum } from "helpers";
import { useEffect } from "react";
import Select from "Components/select";
registerLocale("ru", ru);
/*global maxDate*/
/*global baseUrl*/

function App() {  
  const [adultsCount, setAdultsCount] = useState(2);
  const [children, setChildren] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestsPanelOpen, setIsGuestsPanelOpen] = useState(false);
  const closeCalendar = () => setIsCalendarOpen(false);
  const openCalendar = () => setIsCalendarOpen(true);
  const closeGuestsPanel = () => setIsGuestsPanelOpen(false);
  const openGuestsPanel = () => setIsGuestsPanelOpen(true);

  const [firstDate, setFirstDate] = useState(new Date());
  const [secondDate, setSecondDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    )
  );
  useEffect(()=>{
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.adults) {
        setAdultsCount(params.adults)
    } 
    if (params['children-age']) {
        setChildren(params['children-age'].split(';'))
    } 
    if (params.date) {
        const dateInArr = params.date.split('-')
        setFirstDate(new Date(dateInArr[0], dateInArr[1]-1, dateInArr[2]))
    }
    if (params.date_out) {
        const dateOutArr = params.date_out.split('-')
        setSecondDate(new Date(dateOutArr[0], dateOutArr[1]-1, dateOutArr[2]))
    }
  }, [])
  const setDates = (firstDate, secondDate = null) => {
    setFirstDate(firstDate);
    setSecondDate(secondDate);
  };
  const addZeroToDate = (str) =>{
    if(`${str}`.length===1) return `0${str}`
    return str
  }
  const firstDateStr = firstDate
    ? `${addZeroToDate(firstDate.getDate())}.${addZeroToDate(firstDate.getMonth()+1)}.${firstDate.getFullYear()}`
    : "...";
  const secondDateStr = secondDate
    ? `${addZeroToDate(secondDate.getDate())}.${addZeroToDate(secondDate.getMonth()+1)}.${secondDate.getFullYear()}`
    : "...";
    
  const adultString =
    adultsCount +
    " " +
    declOfNum(adultsCount, ["взрослый", "взрослых", "взрослых"]);
  const childrenString = children.length
    ? children.length +
      " " +
      declOfNum(children.length, ["ребенок", "ребенка", "детей"])
    : "";
    const guestsString = children.length ? `${adultString}, ${childrenString}` : adultString

  const firstDateHref = firstDate
    ? `${firstDate.getFullYear()}-${
        addZeroToDate(firstDate.getMonth() + 1)
      }-${addZeroToDate(firstDate.getDate())}`
    : "";
  const secondDateHref = secondDate
    ? `${secondDate.getFullYear()}-${
        addZeroToDate(secondDate.getMonth() + 1)
      }-${addZeroToDate(secondDate.getDate())}`
    : "";
  const childrenHref = children.length
    ? `&children-age=${children.join(";")}`
    : "";
  const adultsHref = `&adults=${adultsCount}`;
  const nights = Math.floor((secondDate - firstDate) / (1000 * 60 * 60 * 24));
  const nightsHref = `&nights=${nights > 0 ? nights : 0}`;
  const href = baseUrl + `hotels/?date=${firstDateHref}&date_out=${secondDateHref}${nightsHref}${adultsHref}${childrenHref}`;

  return (
    <form method="GET" action="/hotels/" test="hotels" className="js-booking-form searchHotel">
        <div className="searchHotel__header">
            <div className="searchHotel__header-icon"></div>
            <div className="searchHotel__header-details">
                <div className="searchHotel__header-title">Подберите отель</div>
                <div className="searchHotel__header-description">Бронируйте номер по выгодной цене</div>
            </div>
        </div>
        {/* <div className="relative flex searchHotel__wrapper" style={{flexWrap: 'wrap'}}> */}
            <div className="searchHotel__body">
                <div className="searchHotel__body-item kp-calendar-marker" onClick={openCalendar}>
                    <span className="searchHotel__body-label kp-calendar-marker pointer">Прибытие</span> 
                    <p className="searchHotel__body-input pointer kp-calendar-marker">{firstDateStr}</p>
                    {isCalendarOpen && <KPDatePicker 
                        isOpen={isCalendarOpen}
                        close={closeCalendar}
                        setDates={setDates}
                        startDate={firstDate}
                        endDate={secondDate}
                        maxDate={maxDate}
                        // маркер нужен для предотвращения конфликта при открытии календаря:
                        // без него при нажатии на кнопку календарь сначала закрывается, а потом сразу открывается,
                        // так как он должен закрываться при нажатии мимо и открываться при нажатии на кнопку, при этом кнопка = мимо
                        classMarker = {'kp-calendar-marker'}
                    />}
                </div>
                <div className="searchHotel__body-item kp-calendar-marker" onClick={openCalendar}>
                    <span className="searchHotel__body-label kp-calendar-marker pointer">Выезд</span> 
                    <p className="searchHotel__body-input kp-calendar-marker pointer">{secondDateStr}</p>
                </div>
                <div className="searchHotel__body-item" onClick={openGuestsPanel}>
                    <div className="booking-form-section booking-form-section_guests">
                        <div className="booking-form-section__container pointer">
                            <div className="booking-form-section__title pointer">Гости</div>
                            <div className="booking-form-section__value"> 
                                <p className="searchHotel__body-text">{guestsString}</p>
                            </div>
                        </div>
                    </div>
                    {isGuestsPanelOpen && <Guests 
                        closeFunction={closeGuestsPanel}
                        classMarker = {'kp-guests-panel-marker'}
                        childrenAges={children}
                        setAdultsCount={setAdultsCount}
                        setChildrenAges={setChildren}
                    />}
                </div>
            </div>
        {/* </div> */}
        <button className="searchHotel__body-btn" type="button" onClick={()=>{window.location.replace(href)}}> Подобрать </button> 
    </form>
  );
}


const Guests = ({
  closeFunction,
  classMarker,
  setAdultsCount,
  setChildrenAges,
  childrenAges,
}) => {
  const missClickHandle = (e) => {
    if (e.target.classList.contains(classMarker)) return;
    closeFunction();
  };
  const panelRef = useRef(null);
  useOnClickOutside(panelRef, missClickHandle);
  const changeAdultsCount = (count) => {
    setAdultsCount(count);
  };
  
  let ageOptions = [
    { value: 0, label: "до 1 года" },
    { value: 1, label: "1 год" },
    { value: 2, label: "2 года" },
    { value: 3, label: "3 года" },
    { value: 4, label: "4 года" },
  ];

  for (var i = 5; i <= 17; i++) {
      ageOptions.push({ value: i, label: i + " лет" });
  }

  return (
    <div className="kp-select-hotel__guests" ref={panelRef}>
      <Counter title={"Взрослые"} minCount={1} onChange={changeAdultsCount} defaultValue={2} />      
      <Select
        childCount={childrenAges}
        ageOptions={ageOptions}
        onChildChange={(id, val) => {
          const newAges = [...childrenAges];
          newAges[id] = val.value;
          setChildrenAges(newAges);
        }}
        onChildRemove={(idx) => {
          console.log(idx)
          const arr = [...childrenAges];
          arr.splice(idx, 1);
          setChildrenAges(arr);
        }}
      />
    </div>
  );
};

export default App;
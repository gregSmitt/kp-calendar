import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.scss";
import ru from "date-fns/locale/ru";
import KPDatePicker from "Components/KPDatePicker";
import { useState, useEffect } from "react";
import Counter from "Components/Counter";
import useOnClickOutside from "Components/hooks";
import { useRef } from "react";
import { declOfNum } from "helpers";
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
  }, []);
  useEffect(()=>{
    if (secondDate) {
      closeCalendar()
    }
  }, [secondDate])
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
        firstDate.getMonth() + 1
      }-${firstDate.getDate()}`
    : "";
  const secondDateHref = secondDate
    ? `${secondDate.getFullYear()}-${
        secondDate.getMonth() + 1
      }-${secondDate.getDate()}`
    : "";
  const childrenHref = children.length
    ? `&children-age=${children.join(";")}`
    : "";
  const adultsHref = `&adults=${adultsCount}`;
  const nights = Math.floor((secondDate - firstDate) / (1000 * 60 * 60 * 24));
  const nightsHref = `&nights=${nights > 0 ? nights : 0}`;
  const href = baseUrl + `hotels/?date=${firstDateHref}&date_out=${secondDateHref}${nightsHref}${adultsHref}${childrenHref}`;

  return (
    <form
        method="GET"
        action="/hotels/"
        test="index"
        className="js-booking-form searchHotel"
    >
      <div className="searchHotel__header">
        <div className="searchHotel__header-icon"></div>
        <div className="searchHotel__header-details">
          <div className="searchHotel__header-title">Подберите отель</div>
          <div className="searchHotel__header-description">
            Бронируйте номер по выгодной цене
          </div>
        </div>
      </div>
      <div className="searchHotel__body relative">
        <div className="searchHotel__wrapper relative">
          <div className="searchHotel__body-item pointer kp-calendar-marker" onClick={openCalendar}>
              <span className="searchHotel__body-label kp-calendar-marker">Прибытие</span>
              <div
                  className="searchHotel__body-input kp-calendar-marker"
              >{firstDateStr}</div>
          </div>
          <div className="searchHotel__body-item pointer kp-calendar-marker" onClick={openCalendar}>
            <span className="searchHotel__body-label kp-calendar-marker">Выезд</span>
            <div
              className="searchHotel__body-input kp-calendar-marker"
            >{secondDateStr}</div>
          </div>
          <div className="searchHotel__body-item pointer kp-guests-panel-marker" onClick={openGuestsPanel}>
            <div className="booking-form-section booking-form-section_guests kp-guests-panel-marker">
              <div className="booking-form-section__container kp-guests-panel-marker">
                <div className="booking-form-section__title kp-guests-panel-marker">Гости</div>
                <div className="booking-form-section__value kp-guests-panel-marker">
                  <div className="booking-form-section__value kp-guests-panel-marker">{guestsString}</div>
                </div>
              </div>
            </div>
          </div>
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
          {isGuestsPanelOpen && <Guests 
                closeFunction={closeGuestsPanel}
                classMarker = {'kp-guests-panel-marker'}
                childrenAges={children}
                setAdultsCount={setAdultsCount}
                setChildrenAges={setChildren}
            />}
        </div>
        <a className="searchHotel__body-btn" href={href} type="submit">
          Подобрать
        </a>
      </div>
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
  const decreaseChildrenCount = (count) => {
    const newAges = [...childrenAges];
    newAges.pop();
    setChildrenAges(newAges);
  };
  const increaseChildrenCount = (count) => {
    const newAges = [...childrenAges];
    newAges.push(0);
    setChildrenAges(newAges);
  };
  const changeAdultsCount = (count) => {
    setAdultsCount(count);
  };

  const childrenCounters = Array.from(Array(childrenAges.length).keys()).map(
    (num) => {
      return (
        <Counter
          key={num}
          title={`Возраст ${num + 1} ребенка`}
          desc={"До 17 лет"}
          maxCount={17}
          onChange={(age) => {
            const newAges = [...childrenAges];
            newAges[num] = age;
            setChildrenAges(newAges);
          }}
        />
      );
    }
  );

  return (
    <div className="kp-select-hotel__guests" ref={panelRef}>
      <Counter
            title={"Взрослые"}
            minCount={1} 
            onChange={changeAdultsCount}
            defaultCount={2}
         />
      <Counter
        title={"Дети"}
        desc={"До 17 лет"}
        onIncrease={increaseChildrenCount}
        onDecrease={decreaseChildrenCount}
      />
      {childrenCounters.length ? childrenCounters : null}
    </div>
  );
};

export default App;
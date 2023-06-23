import logo from "assets/images/Logo.svg";
import ButtonSelect from "Components/ButtonSelect";
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
  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };
  const closeGuestsPanel = () => setIsGuestsPanelOpen(false);
  const openGuestsPanel = () => setIsGuestsPanelOpen(true);

  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  const [firstDate, setFirstDate] = useState(new Date());
  const [secondDate, setSecondDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    )
  );
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
      <div className="searchHotel__body">
        <div className="searchHotel__body-item kp-calendar-marker" onClick={openCalendar}>
            <span className="searchHotel__body-label kp-calendar-marker">Прибытие</span>
            <div
                className="searchHotel__body-input kp-calendar-marker"
            >{firstDateStr}</div>
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
          <span className="searchHotel__body-label kp-calendar-marker">Выезд</span>
          <div
            className="searchHotel__body-input kp-calendar-marker"
          >{secondDateStr}</div>
        </div>
        <div className="searchHotel__body-item kp-guests-panel-marker" onClick={openGuestsPanel}>
          <div className="booking-form-section booking-form-section_guests kp-guests-panel-marker">
            <div className="booking-form-section__container kp-guests-panel-marker">
              <div className="booking-form-section__title kp-guests-panel-marker">Гости</div>
              <div className="booking-form-section__value kp-guests-panel-marker">
                <div className="booking-form-section__value kp-guests-panel-marker">{guestsString}</div>
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
      <Counter title={"Взрослые"} minCount={1} onChange={changeAdultsCount} />
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

            {/* <div className="booking-form-section__dropdown">
              <div className="booking-form-section__dropdown-head">
                <div className="booking-form-section__dropdown-title">Гости</div>
                <div className="booking-form-section__dropdown-close">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.3 5.70999C18.1131 5.52273 17.8595 5.4175 17.595 5.4175C17.3305 5.4175 17.0768 5.52273 16.89 5.70999L12 10.59L7.10997 5.69999C6.92314 5.51273 6.66949 5.4075 6.40497 5.4075C6.14045 5.4075 5.8868 5.51273 5.69997 5.69999C5.30997 6.08999 5.30997 6.71999 5.69997 7.10999L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10999C18.68 6.72999 18.68 6.08999 18.3 5.70999Z"
                      fill="#01BAC6"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="booking-form-section__dropdown-footer">
                {" "}
                <button className="booking-form-section__dropdown-submit btn btn_size_s btn_color_red">
                  {" "}
                  Применить{" "}
                </button>{" "}
              </div>
              <div className="booking-form__guests-container">
                <div className="booking-form__guests-section booking-form__guests-section_adults">
                  <div className="booking-form__guests-section-title">Взрослые</div>
                  <div className="booking-form__guests-section-content">
                    <div className="counter">
                      <div className="counter__control js-booking-minus counter__control_minus"></div>
                      <div className="counter__info">
                        <input
                          type="number"
                          className="js-booking-counter counter__value"
                          value="2"
                          min="1"
                          max="10"
                        ></input>
                      </div>
                      <div className="counter__control js-booking-plus counter__control_plus"></div>
                    </div>
                  </div>
                </div>
                <div className="booking-form__guests-section booking-form__guests-section_childs">
                  <div className="booking-form__guests-section-title">Дети</div>
                  <div className="booking-form__guests-section-content js-booking-select-group">
                    <div className="booking-form__guests-select active">
                      <select className="searchHotel__body-select js-booking-select">
                        <option disabled="" selected="" value="">
                          Добавить ребенка
                        </option>
                        <option value="0">до 1 года</option>
                        <option value="1">1 год</option>
                        <option value="2">2 года</option>
                        <option value="3">3 года</option>
                        <option value="4">4 года</option>
                        <option value="5">5 лет</option>
                        <option value="6">6 лет</option>
                        <option value="7">7 лет</option>
                        <option value="8">8 лет</option>
                        <option value="9">9 лет</option>
                        <option value="10">10 лет</option>
                        <option value="11">11 лет</option>
                        <option value="12">12 лет</option>
                        <option value="13">13 лет</option>
                        <option value="14">14 лет</option>
                        <option value="15">15 лет</option>
                        <option value="16">16 лет</option>
                        <option value="17">17 лет</option>
                      </select>
                      <div className="booking-form__guests-select-delete"></div>
                    </div>
                    <div className="booking-form__guests-select">
                      <select className="searchHotel__body-select js-booking-select">
                        <option disabled="" selected="" value="">
                          Добавить ребенка
                        </option>
                        <option value="0">до 1 года</option>
                        <option value="1">1 год</option>
                        <option value="2">2 года</option>
                        <option value="3">3 года</option>
                        <option value="4">4 года</option>
                        <option value="5">5 лет</option>
                        <option value="6">6 лет</option>
                        <option value="7">7 лет</option>
                        <option value="8">8 лет</option>
                        <option value="9">9 лет</option>
                        <option value="10">10 лет</option>
                        <option value="11">11 лет</option>
                        <option value="12">12 лет</option>
                        <option value="13">13 лет</option>
                        <option value="14">14 лет</option>
                        <option value="15">15 лет</option>
                        <option value="16">16 лет</option>
                        <option value="17">17 лет</option>
                      </select>
                      <div className="booking-form__guests-select-delete"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
import DatePicker from "react-datepicker";
import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import { ReactComponent as ArrowLeft } from 'assets/images/ChevronLeft.svg';
import { ReactComponent as ArrowRight } from 'assets/images/ChevronRight.svg';

const KPDatePicker = ({ close, classMarker, setDates, startDate, endDate, maxDate, isTwoMounthsShow }) => {
	const datePickerRef = useRef(null)
	const missClickHandle = (e) => {
		if (e.target.classList.contains(classMarker)) return
		close()
	}
	useEffect(() => {
		markLastMounthDayInRange()
	}, [])
	function markLastMounthDayInRange() {
		const componentNode = datePickerRef?.current?.calendar?.componentNode
		if (componentNode) {
			const emptyElementsInRange = Array.from(componentNode.querySelectorAll('.react-datepicker__day--weekend.react-datepicker__day--outside-month'))
			if (emptyElementsInRange.length) {
				emptyElementsInRange.forEach(el => {
					const prevEl = el.previousSibling
					if (prevEl && !prevEl.classList.contains('react-datepicker__day--outside-month')) {
						prevEl.classList.add('kp-last-mounth-day-in-range')
					}
				})
			}
		}
	}



	const renderDayContents = (day, date) => {
		return <span>{date.getDate()}</span>;
	};


	const onChange = (dates) => {
		const [start, end] = dates;
		setDates(start, end);
	};

	return (
		<div className="kp-datepicker">
			{isTwoMounthsShow ?
				<DatePicker
					onClickOutside={missClickHandle}
					onMonthChange={markLastMounthDayInRange}
					onDayMouseEnter={markLastMounthDayInRange}
					renderDayContents={renderDayContents}
					renderCustomHeader={({
						date,
						changeYear,
						changeMonth,
						decreaseMonth,
						increaseMonth,
						prevMonthButtonDisabled,
						nextMonthButtonDisabled,
						customHeaderCount,
						monthDate
					}) => <Header maxDate={maxDate} pickerProps={{
						date,
						changeYear,
						changeMonth,
						decreaseMonth,
						increaseMonth,
						prevMonthButtonDisabled,
						nextMonthButtonDisabled,
						customHeaderCount,
						monthDate
					}} />}
					classNameName="ggwp"
					// selected={props.startDate}
					dateFormat="dd.MM.yyyy"
					// renderDayContents={renderDayContents}
					// includeDates={availableDates}
					selectsDisabledDaysInRange
					selectsRange
					onChange={(dates) => {
						onChange(dates)
						setTimeout(() => markLastMounthDayInRange())
					}}
					maxDate={maxDate}
					startDate={startDate}
					endDate={endDate}
					minDate={new Date()}
					locale="ru"

					monthsShown={1}
					inline
					ref={datePickerRef}
				/> :
				<DatePicker
					onClickOutside={missClickHandle}
					onMonthChange={markLastMounthDayInRange}
					onDayMouseEnter={markLastMounthDayInRange}
					renderDayContents={renderDayContents}
					renderCustomHeader={({
						date,
						changeYear,
						changeMonth,
						decreaseMonth,
						increaseMonth,
						prevMonthButtonDisabled,
						nextMonthButtonDisabled,
						customHeaderCount,
						monthDate
					}) => <Header maxDate={maxDate} pickerProps={{
						date,
						changeYear,
						changeMonth,
						decreaseMonth,
						increaseMonth,
						prevMonthButtonDisabled,
						nextMonthButtonDisabled,
						customHeaderCount,
						monthDate
					}} />}
					classNameName="ggwp"
					// selected={props.startDate}
					dateFormat="dd.MM.yyyy"
					// renderDayContents={renderDayContents}
					// includeDates={availableDates}
					selectsDisabledDaysInRange
					selectsRange
					onChange={(dates) => {
						onChange(dates)
						setTimeout(() => markLastMounthDayInRange())
					}}
					maxDate={maxDate}
					startDate={startDate}
					endDate={endDate}
					minDate={new Date()}
					locale="ru"

					monthsShown={2}
					inline
					ref={datePickerRef}
				/>
			}
		</div>
	)
}


const Header = ({ pickerProps, maxDate }) => {
	const selectRef = useRef(null)

	const currentYear = new Date().getFullYear()
	const maxYear = maxDate.getFullYear()
	const years = [];
	for (let i = currentYear; i <= maxYear; i++) {
		years.push(i);
	}

	useEffect(() => {
		if (selectRef.current) {
			selectRef.current.value = '';
		}
	}, [])

	const months = [
		"Январь",
		"Февраль",
		"Март",
		"Апрель",
		"Май",
		"Июнь",
		"Июль",
		"Август",
		"Сентябрь",
		"Октябрь",
		"Ноябрь",
		"Декабрь",
	];
	const {
		changeYear,
		changeMonth,
		decreaseMonth,
		increaseMonth,
		prevMonthButtonDisabled,
		nextMonthButtonDisabled,
		customHeaderCount,
		monthDate
	} = pickerProps
	return (
		<>
			<button
				aria-label="Previous Month"
				type="button"
				disabled={prevMonthButtonDisabled}
				className={
					"kp-datepicker__navigation kp-datepicker__navigation--previous"
				}
				style={customHeaderCount === 1 ? { display: "none" } : null}
				onClick={(e) => {
					console.log(e)
					decreaseMonth()
				}}
			>
				<ArrowLeft />
			</button>
			<button
				type="button"
				aria-label="Next Month"
				disabled={nextMonthButtonDisabled}
				className={
					"kp-datepicker__navigation kp-datepicker__navigation--next"
				}
				style={customHeaderCount === 1 ? { display: "none" } : null}
				onClick={increaseMonth}
			>
				<ArrowRight />
			</button>
			<div className='kp-datepicker__select-month'>
				<p>{`${months[monthDate.getMonth()]} – ${monthDate.getFullYear()}`}</p>
				<select
					ref={selectRef}
					onChange={(e) => {
						const value = e.target.value;
						e.preventDefault()
						changeMonth(`${new Date(Number(value)).getMonth()}`)
						changeYear(`${new Date(Number(value)).getFullYear()}`)
						e.target.value = ''
					}}
				>
					{years.map((option) => (
						<React.Fragment key={`${customHeaderCount}${option}`}>
							<option disabled value={option}>
								{option}
							</option>
							{
								months.map((mounth, i) => {
									if (new Date() > new Date(option, i + 1) || new Date(option, i) > new Date(maxDate.getFullYear(), maxDate.getMonth())) {
										return null
									}
									return (
										<option
											key={`${customHeaderCount}${option}${mounth}`}
											value={new Date(option, i).getTime()}
										>
											{mounth}
										</option>
									)
								})
							}
						</React.Fragment>
					))}
				</select>
			</div>
			<p className="kp-datepicker__current-month">
				{months[monthDate.getMonth()]}
				<span>{monthDate.getFullYear()}</span>
			</p>
		</>
	)
}

export default KPDatePicker
import React from "react";
import Select, { components } from "react-select";
import { ReactComponent as IncreaseIcon } from 'assets/images/Icon_increase.svg';
import { useRef } from "react";

const colorStyles = {
  control: (styles) => {
    return {
      ...styles,
      backgroundColor: "white",
      borderColor: "#E8E8E8",
      "&:hover": { borderColor: "#1f1f1f" },
      "&:focus": { borderColor: "#1f1f1f" },
      boxShadow: 'none'
    };
  },
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? "rgba(222,33,11,.1)"
        : isFocused
        ? "rgba(222,33,11,.1)"
        : null,
      color: "#000",
      cursor: "default",
      ":active": {
        ...styles[":active"],
        backgroundColor: "#fff",
      },
    };
  },
  input: (styles) => ({ ...styles }),
  indicatorSeparator: (styles) => {
    return { ...styles, width: 0 };
  },
  dropdownIndicator: (styles) => {
    return { ...styles };
  },
  placeholder: (styles) => ({ ...styles, color: "#1f1f1f" }),
  singleValue: (styles) => ({ ...styles, color: "#1f1f1f" }),
  container: (styles) => {
    return {
      ...styles,
      display: "inline-block",
      minWidth: "200px",
      verticalAlign: "middle",
      width: '100%'
    };
  },
  menuList: (styles) => {
    return { ...styles, maxHeight: "185px" };
  },
  menu: (styles) => {
    return {
      ...styles,
      borderRadius: "0 0 8px 8px",
      marginTop: 0,
      boxShadow: "0 8px 24px rgba(0, 0, 0, .2)",
    };
  },
};

const dropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <div className="dropdown_indicator"></div>
    </components.DropdownIndicator>
  );
};

export default (props) => {
  const handleChange = (id, newValue) => {
    if (id === -1) {
      props.onChildChange(props.childCount.length, newValue);
    } else {
      props.onChildChange(id, newValue);
    }
  };

  const selects =  props.childCount.map((value, i) => (
    <div className="dropdown_item active" key={i}>
      <Select
        components={{ dropdownIndicator }}
        options={props.ageOptions}
        placeholder="Добавить ребенка"
        styles={colorStyles}
        value={props.ageOptions[value]}
        onChange={(e) => handleChange(i, e)}
      />
      <div
        className="search-form__guests-select-delete"
        onClick={() => props.onChildRemove(i)}
      >
        <IncreaseIcon/>
      </div>
    </div>
  ));
    const selectRef = useRef(null)

  return (
    <div className="dropdown_wrapper">
      {selects}
      <div className="dropdown_item">
        <Select
            openMenuOnFocus={true}
          placeholder="Добавить ребенка"
          components={{ dropdownIndicator }}
          options={props.ageOptions}
          styles={colorStyles}
          value=""
          onChange={(e) => handleChange(-1, e)}
          ref={selectRef}
          isSearchable={false}
        />
        <div onClick={()=> selectRef.current.focus()} className="search-form__guests-select-add">
            <IncreaseIcon/>
        </div>
      </div>
    </div>
  );
};

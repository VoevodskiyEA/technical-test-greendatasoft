import { useState } from "react";
import { useAlert } from "react-alert";
import { DatePicker, Radio, Input, Button, Checkbox, Select } from "antd";
import { DataType } from "../../App";
import employee from "../../store/employee";
import { observer } from "mobx-react-lite";

interface Props {
  display: boolean;
}

interface ValidType {
  surname: string;
  name: string;
  position: string;
  birthDay: any;
  gender: string;
  employmentDate: any;
  rights: Array<number>;
  [key: string]: any;
}

const NewRow = observer(({ display }: Props) => {
  let defaultValue: DataType = {
    key: employee.getLastKey(),
    surname: "",
    name: "",
    patronymic: "",
    position: "",
    birthDay: "",
    gender: "male",
    employmentDate: "",
    dismissalDate: "",
    rights: [],
    collegues: [],
  };
  let NewRowData: DataType = defaultValue;
  let validNewRowData: ValidType = {
    surname: "",
    name: "",
    position: "",
    birthDay: "",
    gender: "",
    employmentDate: "",
    rights: [],
  };
  const alert = useAlert();
  const [surname, setSurname] = useState(NewRowData.surname);
  const [name, setName] = useState(NewRowData.name);
  const [patronomic, setPatronomic] = useState(NewRowData.patronymic);
  const [position, setPosition] = useState(NewRowData.position);
  const [birthDay, setBirthDay] = useState(NewRowData.birthDay);
  const [gender, setGender] = useState(NewRowData.gender);
  const [employmentDate, setEmploymentDate] = useState(
    NewRowData.employmentDate
  );
  const [dismissalDate, setDismissalDate] = useState(NewRowData.dismissalDate);
  const [rights, setRights] = useState(NewRowData.rights);
  const [collegues, setCollegues] = useState([]);

  const options = [
    { label: "Admin", value: 1 },
    { label: "User", value: 0 },
  ];

  function updateValue() {
    let colleguesArr = [];
    NewRowData.surname = surname;
    NewRowData.name = name;
    NewRowData.patronymic = patronomic;
    NewRowData.position = position;
    NewRowData.birthDay = birthDay;
    NewRowData.gender = gender;
    NewRowData.employmentDate = employmentDate;
    NewRowData.dismissalDate = dismissalDate;
    NewRowData.rights =
      rights.length === 2 ? [rights[0] + ", " + rights[1]] : [rights[0]];
    for (let i: number = 0; i < collegues.length; i++) {
      if (i + 1 !== collegues.length) {
        colleguesArr[i] =
          JSON.parse(collegues[i]).surname +
          " " +
          JSON.parse(collegues[i]).name +
          ", ";
      } else {
        colleguesArr[i] =
          JSON.parse(collegues[i]).surname +
          " " +
          JSON.parse(collegues[i]).name;
      }
    }
    NewRowData.collegues = colleguesArr;

    if (NewRowData.dismissalDate === "") {
      NewRowData.dismissalDate = "Employed until the present";
    }
  }

  function updateValid() {
    validNewRowData.surname = NewRowData.surname;
    validNewRowData.name = NewRowData.name;
    validNewRowData.position = NewRowData.position;
    validNewRowData.birthDay = NewRowData.birthDay;
    validNewRowData.gender = NewRowData.gender;
    validNewRowData.employmentDate = NewRowData.employmentDate;
    validNewRowData.dismissalDate = NewRowData.dismissalDate;
    validNewRowData.rights = NewRowData.rights;
  }

  function validateRequired(e: any) {
    let result;
    function haveFalsy(e: any) {
      if (e.toString() === "") {
        return true;
      } else {
        return false;
      }
    }
    const arrayValues = Object.values(e);
    for (let i: number = 0; i < arrayValues.length; i++) {
      result = haveFalsy(arrayValues[i]);
      if (result) {
        break;
      }
    }
    return result;
  }

  function checkBirthDay(birth: any, employment: any) {
    const [birthYear, birthMonth, birthlDay] = birth.split("-");
    const [employmentYear, employmentMonth, employmentDay] = employment.split(
      "-"
    );

    if (+employmentYear - +birthYear > 16) {
      return true;
    } else if (+employmentYear - +birthYear === 16) {
      if (+employmentMonth > +birthMonth) {
        return true;
      } else if (+employmentMonth === +birthMonth) {
        if (+employmentDay >= +birthlDay) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function handleDate(employment: any, dismissal: any) {
    const [employmentYear, employmentMonth, employmentDay] = employment.split(
      "-"
    );
    const [dismissalYear, dismissalMonth, dismissalDay] = dismissal.split("-");

    if (+employmentYear > +dismissalYear) {
      return false;
    } else if (+employmentYear === +dismissalYear) {
      if (+employmentMonth > +dismissalMonth) {
        return false;
      } else if (+employmentMonth === +dismissalMonth) {
        if (+employmentDay > +dismissalDay) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  function handleUpload() {
    updateValue();
    updateValid();
    const required = validateRequired(validNewRowData);
    const dateDiff = handleDate(
      NewRowData.employmentDate,
      NewRowData.dismissalDate
    );
    const birthDay = checkBirthDay(
      NewRowData.birthDay,
      NewRowData.employmentDate
    );

    if (!required && dateDiff && birthDay) {
      employee.addEmployee(NewRowData);
      alert.success("New employee added");
    } else if (required) {
      alert.error("Fill all fields");
    } else if (!dateDiff) {
      alert.error("Enter valid date");
    } else {
      alert.error("Cannot hire minors");
    }
  }

  function getRights(e: Array<any>) {
    console.log(e);
    e.length === 1 ? setRights([+e]) : setRights(e);
  }

  const { Option } = Select;

  const colleguesRegister = [];
  for (let i: number = 0; i < employee.register.length; i++) {
    colleguesRegister.push(
      <Option
        key={employee.register[i].key}
        value={JSON.stringify(employee.register[i])}
      >
        {employee.register[i].surname + " " + employee.register[i].name}
      </Option>
    );
  }

  return (
    <div className={` ${display ? "" : "display-none"}`}>
      <Input
        name={"surname"}
        placeholder="Surname"
        onChange={(e) => setSurname(e.target.value)}
        value={surname}
      />
      <Input
        name={"name"}
        placeholder="Name"
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
      />
      <Input
        name={"patronymic"}
        placeholder="Patronymic"
        onChange={(e) => {
          setPatronomic(e.target.value);
        }}
        value={patronomic}
      />
      <Input
        name={"position"}
        placeholder="Position"
        onChange={(e) => {
          setPosition(e.target.value);
        }}
        value={position}
      />
      <DatePicker
        placeholder="Birthday"
        onChange={(date: moment.Moment | null, dateString: string) =>
          setBirthDay(dateString)
        }
      />
      <Radio.Group onChange={(e) => setGender(e.target.value)} value={gender}>
        <Radio value="male">Male</Radio>
        <Radio value="female">Female</Radio>
      </Radio.Group>
      <DatePicker
        placeholder="Employment date"
        onChange={(date: moment.Moment | null, dateString: string) =>
          setEmploymentDate(dateString)
        }
      />
      <DatePicker
        placeholder="Dismissal date"
        onChange={(date: moment.Moment | null, dateString: string) =>
          setDismissalDate(dateString)
        }
      />
      <Checkbox.Group
        options={options}
        defaultValue={["Pear"]}
        onChange={(checkedValues) => getRights(checkedValues)}
      />
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder="Please select"
        defaultValue={[]}
        onChange={(e) => setCollegues(e)}
      >
        {colleguesRegister}
      </Select>
      <Button onClick={() => handleUpload()}>Add new row</Button>
    </div>
  );
});

export default NewRow;

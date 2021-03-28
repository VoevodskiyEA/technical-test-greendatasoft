import { makeAutoObservable } from "mobx";
import { DataType } from "../App";
class Employee {
  constructor() {
    makeAutoObservable(this);
  }
  defaultValue = [
    {
      key: "1",
      surname: "Stahelski",
      name: "Chad",
      patronymic: "F.",
      position: "Film director",
      birthDay: "1968-09-19",
      gender: "male",
      employmentDate: "1993-03-31",
      dismissalDate: "Employed until the present",
      rights: [1],
      collegues: ["Keanu Reeves"],
    },
    {
      key: "2",
      surname: "Keanu",
      name: "Reeves",
      patronymic: "Henry",
      position: "Actor",
      birthDay: "1964-09-02",
      gender: "male",
      employmentDate: "1984-03-15",
      dismissalDate: "Employed until the present",
      rights: [0],
      collegues: ["Chad Stahelski"],
    },
  ];

  setLocalStorage() {
    const localData = localStorage.getItem("employee");
    return localData ? JSON.parse(localData) : this.defaultValue;
  }
  register: Array<DataType> = this.setLocalStorage();
  addEmployee(employee: any) {
    this.register.push(employee);
  }
  removeEmployee(key: any) {
    this.register = this.register.filter((employee) => employee.key !== key);
  }
  getReg() {
    return JSON.stringify(this.register);
  }
  getLastKey() {
    if (this.register.length === 0) {
      return "1";
    } else {
      return JSON.stringify(+this.register[this.register.length - 1].key + 1);
    }
  }
  changeRegister(newArray: Array<any>) {
    let jsonArray = JSON.stringify(newArray);
    this.register = newArray;
    localStorage.setItem("employee", jsonArray);
  }
  setDefaultLocalStorage() {
    this.register = this.defaultValue;
    localStorage.setItem("employee", JSON.stringify(this.register));
  }
}

export default new Employee();

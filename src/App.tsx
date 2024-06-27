import { ChangeEvent, FormEvent, FocusEvent, useState } from "react";

import "./styles/App.css";

function App() {
  interface FormData {
    name: string;
    number: string;
    month: number | undefined;
    year: number | undefined;
    cvv: number | undefined;
  }

  interface Errors {
    name: string;
    number: string;
    month: string;
    year: string;
    cvv: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    number: "",
    month: undefined,
    year: undefined,
    cvv: undefined,
  });

  const [errors, setErrors] = useState<Errors>({
    name: "",
    number: "",
    month: "",
    year: "",
    cvv: "",
  });

  const [success, setSuccess] = useState(false);

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = value;
    if ((name === "month" || name === "year") && value) {
      let monthOrYear = value.toString();
      if (monthOrYear.length === 1) {
        newValue = "0" + monthOrYear;
      }
      if (name === "month") {
        const monthValue = parseInt(newValue);
        if (monthValue < 1 || monthValue > 12) {
          newValue = "";
        }
      }
    }

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "month" && parseInt(value) > 12) {
      //this already accounts for the length of the input not being more than 2 digits since 12 is 2 digits
      return;
    } else if (name === "number" && value.length > 16) {
      return;
    } else if (name === "cvv" && value.toString().length > 3) {
      return;
    } else if (name === "year" && value.toString().length > 2) {
      return;
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const numberRegex = /^\d+$/;

  const validate = () => {
    let isValid = true;
    let errors = { name: "", number: "", month: "", year: "", cvv: "" };

    if (!formData.name) {
      isValid = false;
      errors.name = "Please enter your name";
    }
    if (!formData.number) {
      isValid = false;
      errors.number = "Please enter your card number";
    } else {
      const isNumber = numberRegex.test(formData.number);
      if (!isNumber) {
        isValid = false;
        errors.number = "Wrong format, numbers only";
      }
    }
    if (!formData.month) {
      isValid = false;
      errors.month = "Can't be blank";
    }
    if (!formData.year) {
      isValid = false;
      errors.year = "Can't be blank";
    }
    if (!formData.cvv) {
      isValid = false;
      errors.cvv = "Can't be blank";
    }
    setErrors(errors);
    return isValid;
  };

  const splitCardNumbers = (numbers: string) => {
    let splittedNumbers = [];
    const step = 4;

    for (let i = 0; i < formData.number.length; i += step) {
      splittedNumbers.push(numbers.slice(i, i + step));
    }
    return splittedNumbers;
  };

  const submitData = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      setFormData({
        name: "",
        number: "",
        month: undefined,
        year: undefined,
        cvv: undefined,
      });
      setSuccess(true);
    }
  };

  const nums = splitCardNumbers(formData.number);

  return (
    <div className="card-container">
      <div className="card-box">
        <div className="bg-container">
          <img
            className="bg"
            src="/images/bg-main-desktop.png"
            alt="background"
          />
        </div>
        <div className="cards">
          <div className="card card1">
            <img src="/images/bg-card-back.png" alt="card1" />
            <span>{formData.cvv ? formData.cvv : "000"}</span>
          </div>
          <div className="card card2">
            <div className="circles">
              <div className="circle big-circle"></div>
              <div className="circle small-circle"></div>
            </div>
            <div className="text">
              <p>
                {formData.number
                  ? nums.map((num, index) => <span key={index}>{num}</span>)
                  : Array.from({ length: 4 }, (_, index) => (
                      <span key={index}>0000</span>
                    ))}
              </p>
              <div>
                <p className="card-name">
                  {formData.name ? formData.name : "Cardholder name"}
                </p>
                <p className="exp-date">
                  {formData.month && formData.year
                    ? formData.month + "/" + formData.year
                    : "00/00"}
                </p>
              </div>
            </div>
            <img src="/images/bg-card-front.png" alt="card2" />
          </div>
        </div>
      </div>

      {!success ? (
        <form onSubmit={submitData}>
          <div className="form-input">
            <label htmlFor="name">Cardholder name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Jane Appleseed"
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div className="form-input">
            <label htmlFor="number">Card number</label>
            <input
              type="text"
              name="number"
              id="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="e.g. 1234 5678 9123 0000"
            />
            {errors.number && <p className="error-message">{errors.number}</p>}
          </div>
          <div className="exp-date-container">
            <fieldset id="exp-date">
              <legend> EXP. DATE (MM/YY)</legend>
              <div className="form-input">
                <input
                  type="number"
                  name="month"
                  id="exp-month"
                  value={formData.month ?? ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="MM"
                />
                {errors.month && (
                  <p className="error-message">{errors.month}</p>
                )}
              </div>
              <div className="form-input">
                <input
                  type="number"
                  name="year"
                  id="year"
                  value={formData.year ?? ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="YY"
                />
                {errors.number && (
                  <p className="error-message">{errors.year}</p>
                )}
              </div>
            </fieldset>
            <div className="form-input">
              <label htmlFor="cvv">CVC</label>
              <input
                type="number"
                name="cvv"
                id="cvv"
                value={formData.cvv ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. 123"
              />
              {errors.cvv && <p className="error-message">{errors.cvv}</p>}
            </div>
          </div>
          <button>Confirm</button>
        </form>
      ) : (
        <div className="completed-state">
          <div className="check-img-container">
            <img src="/images/icon-complete.svg" alt="check-icon" />
          </div>
          <h2>THANK YOU !</h2>
          <p>We've added your card details</p>
          <button onClick={() => setSuccess(false)}>Continue</button>
        </div>
      )}
    </div>
  );
}

export default App;

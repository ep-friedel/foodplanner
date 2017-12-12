import React from 'react';
import sEqual from 'shallow-equals';
import Dialog from 'UI/Dialog.js';
import ImageUploader from 'UI/ImageUploader/ImageUploader.jsx';
import MealOption from './MealOption.jsx';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, formatTime, round } from 'SCRIPTS/date.js';
import { formDataFromObject } from 'SCRIPTS/formData.js';
import './CreateMealDialog.less';
import 'react-day-picker/lib/style.css';

export default class CreateMealDialog extends React.Component {
  constructor(props) {
    const deadline = new Date(props.meal.deadline),
      time = new Date(props.meal.time);
    super();

    this.tomorrow12 = new Date();
    this.tomorrow12.setDate(this.tomorrow12.getDate() + 1);
    this.tomorrow12.setHours(12);
    this.tomorrow12.setMinutes(0);
    this.tomorrow12.setSeconds(0);

    if (props.app.dialog.state) {
      this.state = props.app.dialog.state;

    } else if (props.edit) {
      this.state = {
        ...props.meal,
        options: props.meal.options ? props.meal.options : [] ,
        deadline: formatDate(deadline),
        deadlineHour: round(deadline, 30).format('HH:mm'),
        timeHour: round(time, 30).format('HH:mm'),
        time: formatDate(time),
        timeObject: time,
        deadlineObject: deadline,
      };
    } else {
      this.state = {
        name: '',
        creator: props.user.name,
        creatorId: props.user.id,
        image: '',
        imageUrl: '',
        description: '',
        signupLimit: 0,
        deadline: '',
        deadlineHour: '12:00',
        timeHour: '12:00',
        time: '',
        timeObject: this.tomorrow12,
        deadlineObject: this.tomorrow12,
        options: []
      };
    }

    this.nameInput = this.handleInput('name').bind(this);
    this.creatorInput = this.handleInput('creator').bind(this);
    this.saveImage = this.handleInput('image').bind(this);
    this.saveImageUrl = this.handleInput('imageUrl').bind(this);
    this.descriptionInput = this.handleInput('description').bind(this);
    this.signupLimitInput = this.handleInput('signupLimit').bind(this);
    this.deadlineHourInput = this.handleTime('deadline').bind(this);
    this.deadlineInput = this.handleDatepicker('deadline').bind(this);
    this.timeHourInput = this.handleTime('time').bind(this);
    this.timeInput = this.handleDatepicker('time').bind(this);
    this.handleImage = this.handleImage.bind(this);

    this.mySetState = function (data, cb) {
      this.setState(data, () => {
        const app = history.state.app ? history.state.app : {};
        if (cb) {
          cb();
        }
        history.replaceState({app: {...app, dialog: {...(app.dialog ? app.dialog : {}), state: this.state}}}, document.title, document.location.pathname);
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.timeObject !== this.state.timeObject
      || nextState.deadlineObject !== this.state.deadlineObject
      || nextState.image !== this.state.image
      || !sEqual(nextState.options, this.state.options)
    ) {
      return true;
    }
    if (!sEqual(nextProps.meals, this.props.meals)) {
      return true;
    }
    return false;
  }

  handleInput(field) {
    return (evt) => {
      this.mySetState({
        [field]: evt.target.value
      });
    };
  }

  handleTime(field) {
    return (evt) => {
      let newDate = new Date(this.state[field + 'Object']),
          values = evt.target.value.split(':');
      newDate.setHours(values[0]);
      newDate.setMinutes(values[1]);

      this.mySetState({
        [field + 'Object']: newDate,
        [field + 'Hour']: evt.target.value
      });
    };
  }

  handleImage(imageData, objectUrl) {
    this.mySetState({imageData});
  }

  handleDatepicker(field) {
    return (date) => {
      let jsDate = date.toDate(),
        obj;

      jsDate.setHours(this.state[field + 'Object'].getHours());
      jsDate.setMinutes(this.state[field + 'Object'].getMinutes());

      obj = {
        [field + 'Object']: jsDate
      };

      if (field === 'deadline' && this.state.timeObject < jsDate) {
        obj.timeObject = jsDate;
      }
      this.mySetState(obj);
    };
  }

  submit() {
    const s = this.state,
      data = {
        id: s.id,
        name: s.name,
        creator: s.creator,
        creatorId: s.creatorId,
        image: s.image,
        imageData: s.imageData,
        description: s.description,
        signupLimit: s.signupLimit,
        deadline: s.deadlineObject.getTime(),
        time: s.timeObject.getTime(),
        options: JSON.stringify(s.options)
      },
      formData = formDataFromObject(data);

    if (this.props.edit) {
      this.props.edit_meal(s.id, formData);
    } else {
      this.props.create_meal(formData);
    }
  }

  cancel() {
    this.props.close_dialog();
  }

  setOption(index) {
    return (newOption) => {
      let newArr = [...this.state.options];
      newArr[index] = newOption;

      this.mySetState({
        options: newArr
      });
    }
  }

  addOption() {
    this.mySetState({
      options: [...this.state.options, {
        name: '',
        type: 'select',
        values: []
      }]
    });
  }

  deleteOption(index) {
    this.mySetState({
      options: this.state.options.filter((val, ind) => ind !== index)
    });
  }

  selectOptions(evt) {
    if (evt.target.value != -1) {
      const options = this.props.meals.find(meal => meal.id == evt.target.value).options.map(option => {
        let newOptions = Object.assign({}, option);
        newOptions.values = [].concat(option.values);
        return newOptions;
      });

      this.mySetState({options});
    }
  }

  render() {
    const p = this.props,
          s = this.state,
          edit = p.edit;
    let times = Array(48).fill(0).map((item, index) => ('00' + (Math.floor(index / 2)) + ':' + ((index % 2) ? '30' : '00')).slice(-5));

    return (
      <Dialog>
        <div className="titlebar">
          {
            edit
            ? <h3>{s.name} bearbeiten</h3>
            : <h3>Neue Mahlzeit erstellen</h3>
          }
          <span className="fa fa-times push-right pointer" onClick={this.cancel.bind(this)}></span>
        </div>
        <div className="body createMeal">
          <div className="row">
            <div className="col">
              <div>
                <label htmlFor="SignUpDialog_name">Name</label>
                <input type="text" id="SignUpDialog_name" defaultValue={s.name} onChange={this.nameInput}/>
              </div>
              <div>
                <label htmlFor="SignUpDialog_signupLimit">Teilnehmerbegrenzung</label>
                <input type="number" id="SignUpDialog_signupLimit" defaultValue={edit ? s.signupLimit : 0} onChange={this.signupLimitInput}/>
              </div>
            </div>
            <div className="col">
              <ImageUploader callback={this.handleImage} opts={{imageUrl: s.image}}/>
            </div>
          </div>
          <div>
            <label htmlFor="SignUpDialog_comment">Beschreibung</label>
            <textarea type="text" id="SignUpDialog_description" onChange={this.descriptionInput} defaultValue={s.description}></textarea>
          </div>
          <div>
            <label htmlFor="SignUpDialog_deadline">Anmeldeschluss</label>
            <div className="row deadline">
              <DayPickerInput
                value={formatDate(s.deadlineObject)}
                format="DD.MM.YY"
                onDayChange={this.deadlineInput}
              />
              <select className="timePicker" onChange={this.deadlineHourInput} defaultValue={edit ? s.deadlineHour : "12:00"}>
                {times.map(time => <option key={time} value={time}>{time}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="SignUpDialog_time">Lieferzeitpunkt</label>
            <div className="row time">
              <DayPickerInput
                value={formatDate(s.timeObject)}
                format="DD.MM.YY"
                onDayChange={this.timeInput}
              />
              <select className="timePicker" onChange={this.timeHourInput} defaultValue={edit ? s.timeHour : "12:00"}>
                {times.map(time => <option key={time} value={time}>{time}</option>)}
              </select>
            </div>
          </div>
          {s.options.map((option, index) => <MealOption key={index} option={option} index={index} setOption={this.setOption(index)} deleteOption={() => this.deleteOption(index)} editable={!edit || !p.meal.signups.length}/>)}
          {
            (!edit || !p.meal.signups.length)
            ? <div className="row">
              <p className="fakeLink addOption" onClick={this.addOption.bind(this)}><span className="fa fa-plus fa-lg"></span> Option hinzufügen</p>
              {
                (!s.options.length)
                ? <select className="push-right templateSelector" onChange={this.selectOptions.bind(this)}>
                  <option value="-1">Optionen laden</option>
                  {
                    p.meals.filter(meal => meal.options.length).map((meal) => <option value={meal.id} key={meal.id}>{meal.name}</option>)
                  }
                </select>
                : null
              }
            </div>
            : null
          }
        </div>
        <div className="foot">
          <button className="cancel" type="button" onClick={this.cancel.bind(this)}>Abbrechen</button>
          <button className="submit" type="button" onClick={this.submit.bind(this)}>Speichern</button>
        </div>
      </Dialog>
    );
  }
}
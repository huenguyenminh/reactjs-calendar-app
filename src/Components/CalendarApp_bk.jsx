import React from 'react';
import { useState } from 'react';
import { CalculationInterpolation } from 'sass';
import './CalendarApp.css';


export const CalendarApp_bk = () => {
  const daysOfWeek = ['Sun', 'Mon', "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = ['January', "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentDate = new Date();
  
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
  const [selectedDate, setSelectedDate] = useState(currentDate)
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [events, setEvents] = useState([])
  const [eventTime, setEventTime] = useState({hours: '00', minutes: '00'})
  const [eventText, setEventText] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  // console.log("current -> Month: " , currentMonth, currentYear, currentDate);
  

  // Xac dinh so ngay trong thang hien tai
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
// Ngày đầu tiên của tháng là thứ mấy  : Sun, Mon, Tue, ..., Sat [0,..., 6]
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1 ).getDay();

  console.log("currentDate: ",currentDate.getMonth())

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1))
    setCurrentYear((prevYear) => currentMonth === 0 ? prevYear - 1: prevYear)
  }

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1))
    setCurrentYear((prevYear) => currentMonth === 11 ? prevYear + 1: prevYear)
  }

  const handleDayClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day)
    const today = new Date()
    if(clickedDate >= today || isSameDay(clickedDate, today)){
      setSelectedDate(clickedDate)
      setShowEventPopup(true);
      setEventTime({hours: '00', minutes: '00'});
      setEventText('');
    }
  }

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() 
    )
  }

  const handleEventSubmit = () => {
    if (editingEvent) {
      const updatedEvents = events.map((event, index) =>
        index === events.indexOf(editingEvent)
        ? {
            ...event,
            time: `${eventTime.hours.padStart(2, '0')} : ${eventTime.minutes.padStart(2, '0')}`,
            text: eventText,
          }
        : event
      );
      setEvents(updatedEvents); 
      setEditingEvent(null); 
      setShowEventPopup(false);
    } else {
      const newEvent = {
        date: selectedDate,
        time: `${eventTime.hours.padStart(2,'0')} : ${eventTime.minutes.padStart(2, '0')}`,
        text: eventText
      }
      
      console.log('newEvent: ',JSON.stringify(newEvent));
  
      setEvents([...events, newEvent]);
      setEventTime({hours: '00', minutes: '00'})
      setShowEventPopup(false);
  
      console.log('Events: ',events);
    }
  }
  


  const handleEdit = (indexEvent) => {
    console.log('indexEditing: ', indexEvent);
    const eventToEdit = events[indexEvent]; // Lấy sự kiện trực tiếp từ danh sách sự kiện
    console.log('eventToEdit: ', JSON.stringify(eventToEdit, 0, 2));
    setEditingEvent(eventToEdit); // Cập nhật trạng thái `editingEvent` để lưu trữ
    setEventTime({
      hours: eventToEdit.time.split(' : ')[0], // Lấy giờ từ chuỗi thời gian
      minutes: eventToEdit.time.split(' : ')[1], // Lấy phút từ chuỗi thời gian
    });
    setEventText(eventToEdit.text); // Cập nhật văn bản sự kiện
    setShowEventPopup(true); // Hiển thị popup
  }

  return (
    <div className='calendar-app'>
      <div className='calendar'>
        <h1 className="heading">Calendar</h1>
        <div className='navigate-date'>
          <h2 className='month'>
            {monthsOfYear[currentMonth]},
          </h2>
          <h2 className='year'>2024</h2>
          <div className='buttons'>
            <i className="bx bx-chevron-left" onClick={prevMonth}></i>
            <i className="bx bx-chevron-right" onClick={nextMonth}></i>
          </div>
        </div>
        <div className="weekdays">
          {daysOfWeek.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="days">
          {[...Array(firstDayOfMonth).keys()].map((_, index) => (
            <span key={`empty-${index}`}/>
          ))}
          {/* Tạo các ngày trong tháng, từ 1 đến daysInMonth */}
           {[...Array(daysInMonth).keys()].map((day) => (
            <span 
              key={day + 1}
              className={day + 1 === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear() ? 'current-day': ''}
              onClick={() => handleDayClick(day + 1)}
              >{day + 1}</span>
          ))}

        </div>
      </div>
      <div className="events">
        {showEventPopup &&  <div className="event-popup">
          <div className="time-input">
            <div className="event-popup-time">Time</div>
            <input 
              type="number" 
              name="hours" 
              min={0} 
              max={24} 
              className="hours" 
              value={eventTime.hours} 
              onChange={(e) => {
                setEventTime({...eventTime, hours: e.target.value})
              }}
            />
            <input 
              type="number" 
              name="minutes" 
              min={0}
              max={60} 
              className="minutes" 
              value={eventTime.minutes} 
              onChange={(e) => {
                setEventTime({...eventTime, minutes: e.target.value})
              }}
            />
          </div>
          <textarea 
            placeholder='Enter Event Text (maximun 60 characters)' 
            value={eventText} 
            onChange={(e) => {
              if(e.target.value.length <= 60){
                setEventText(e.target.value)
              }
            }}
          ></textarea>
          <button className='event-popup-btn' onClick={handleEventSubmit}> {editingEvent ? 'Save Changes' : 'Add Event'}</button>
          <button className='close-event-popup' onClick={() => setShowEventPopup(false)}>
            <i className="bx bx-x"></i>
          </button>
        </div> }
       {events.map((event, index)=> (
        <div className="event" key={index}>
          <div className="event-date-wrapper">
            <div className="event-date">
              {`
                ${monthsOfYear[event.date.getMonth()]}
                ${event.date.getDate()}, 
                ${event.date.getFullYear()}
              `}
            </div>
            <div className="event-time">{event.time}</div>
          </div>
          <div className="event-text">{event.text}</div>
          <div className="event-buttons">
            <i className="bx bxs-edit-alt" onClick={() => handleEdit(index)}></i>
            <i className="bx bxs-message-alt-x"></i>
          </div>
        </div>
       ))}
        
      </div>
    </div>
  )
}

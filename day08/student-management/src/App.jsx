import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Database State: Roster of students (LocalStorage persisted)
  const [students, setStudents] = useState(() => {
    const savedData = localStorage.getItem('school_students');
    return savedData ? JSON.parse(savedData) : [];
  });

  // 2. State: Notice Board Announcements (LocalStorage persisted)
  const [notices, setNotices] = useState(() => {
    const savedNotices = localStorage.getItem('school_notices');
    return savedNotices ? JSON.parse(savedNotices) : [];
  });

  // 3. State: Portal Configurations (LocalStorage persisted)
  const [portalConfig, setPortalConfig] = useState(() => {
    const savedConfig = localStorage.getItem('school_config');
    return savedConfig ? JSON.parse(savedConfig) : {
      schoolName: 'Artificial Intelligence & Data Science Department',
      currentTerm: 'Fall Semester 2026'
    };
  });

  // 4. Modal Popup State (Holds student object currently viewed in detail)
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [tempRemarks, setTempRemarks] = useState('');

  // 5. Navigation View State ('roster' | 'dashboard' | 'add' | 'schedule' | 'notices' | 'settings')
  const [currentView, setCurrentView] = useState('roster');

  // 6. Form states (for Enrolling a student)
  const [studId, setStudId] = useState('');
  const [studName, setStudName] = useState('');
  const [studClass, setStudClass] = useState('Semester 1');
  const [studScore, setStudScore] = useState('');

  // 7. Notice Board Form Input States
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');

  // 8. Settings Form Input States
  const [configSchoolName, setConfigSchoolName] = useState(portalConfig.schoolName);
  const [configTerm, setConfigTerm] = useState(portalConfig.currentTerm);

  // 9. Search and Filtering States (used on Student List page)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');

  // 10. Grade Constants
  const CLASSES = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];

  // Timetable Constant data structure (days, slots, subjects)
  const TIMETABLE = {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    slots: [
      { time: '09:00 AM - 10:30 AM', mon: 'Data Structures (DSA)', tue: 'Computer Networks', wed: 'Theory of Comp. (TOC)', thu: 'Operating Systems', fri: 'Artificial Intell.' },
      { time: '10:45 AM - 12:15 PM', mon: 'Operating Systems', tue: 'DBMS (SQL/NoSQL)', wed: 'Software Engineering', thu: 'Computer Networks', fri: 'Analysis of Algorithms' },
      { time: '12:15 PM - 01:15 PM', mon: '🍔 Lunch Break', tue: '🍔 Lunch Break', wed: '🍔 Lunch Break', thu: '🍔 Lunch Break', fri: '🍔 Lunch Break' },
      { time: '01:15 PM - 02:45 PM', mon: 'Linear Algebra', tue: 'Web Development', wed: 'Compiler Design', thu: 'DBMS Laboratory', fri: 'Capstone Project' },
      { time: '03:00 PM - 04:30 PM', mon: 'DSA Laboratory', tue: 'OOP (Java/C++) Lab', wed: 'AI & ML Lab', thu: 'Frontend Web Lab', fri: 'Department Seminar' }
    ]
  };

  // 11. LOCALSTORAGE PERSISTENT HOOKS
  useEffect(() => {
    localStorage.setItem('school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('school_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('school_config', JSON.stringify(portalConfig));
  }, [portalConfig]);

  // Sync temporary remarks when modal opens
  useEffect(() => {
    if (selectedStudent) {
      setTempRemarks(selectedStudent.remarks || '');
    } else {
      setTempRemarks('');
    }
  }, [selectedStudent]);

  // 12. DYNAMIC STATS calculations (derived state)
  const totalStudents = students.length;
  const presentStudents = students.filter(s => s.status === 'Present').length;
  const absentStudents = students.filter(s => s.status === 'Absent').length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;
  
  const averageScore = totalStudents > 0 
    ? Math.round(students.reduce((acc, curr) => acc + Number(curr.score), 0) / totalStudents) 
    : 0;

  const passingStudents = students.filter(s => Number(s.score) >= 50).length;
  const passingRate = totalStudents > 0 ? Math.round((passingStudents / totalStudents) * 100) : 0;

  const getPerformanceGrade = (score) => {
    const numScore = Number(score);
    if (numScore >= 90) return { letter: 'A', class: 'grade-a' };
    if (numScore >= 80) return { letter: 'B', class: 'grade-b' };
    if (numScore >= 70) return { letter: 'C', class: 'grade-c' };
    if (numScore >= 50) return { letter: 'D', class: 'grade-d' };
    return { letter: 'F', class: 'grade-f' };
  };

  const getGradeCount = (letter) => {
    return students.filter(s => getPerformanceGrade(s.score).letter === letter).length;
  };

  // 13. Add Student Handler
  const handleAddStudent = (e) => {
    e.preventDefault();

    const trimmedId = studId.trim();
    const trimmedName = studName.trim();
    const parsedScore = Number(studScore);

    if (!trimmedId || !trimmedName || studScore === '') {
      alert('Please fill out all fields!');
      return;
    }

    if (parsedScore < 0 || parsedScore > 100 || isNaN(parsedScore)) {
      alert('Test score must be a number between 0 and 100!');
      return;
    }

    const idExists = students.some(s => s.id.toLowerCase() === trimmedId.toLowerCase());
    if (idExists) {
      alert(`Student with ID/Roll No "${trimmedId}" already exists!`);
      return;
    }

    const newStudent = {
      id: trimmedId,
      name: trimmedName,
      gradeClass: studClass,
      score: parsedScore,
      status: 'Present',
      remarks: ''
    };

    setStudents([...students, newStudent]);
    setStudId('');
    setStudName('');
    setStudClass('Grade 10');
    setStudScore('');
    setCurrentView('roster');
  };

  // 14. Add Announcement Handler
  const handleAddNotice = (e) => {
    e.preventDefault();
    const title = noticeTitle.trim();
    const content = noticeContent.trim();

    if (!title || !content) {
      alert('Please fill out all fields!');
      return;
    }

    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-US', dateOptions);

    const newNotice = {
      id: Date.now().toString(),
      title,
      content,
      date: formattedDate
    };

    setNotices([newNotice, ...notices]);
    setNoticeTitle('');
    setNoticeContent('');
  };

  // Delete Notice
  const deleteNotice = (id) => {
    setNotices(notices.filter(n => n.id !== id));
  };

  // 15. Save Configurations Handler
  const handleSaveConfig = (e) => {
    e.preventDefault();
    const school = configSchoolName.trim();
    const term = configTerm.trim();

    if (!school || !term) {
      alert('Fields cannot be blank!');
      return;
    }

    setPortalConfig({
      schoolName: school,
      currentTerm: term
    });
    alert('Portal configurations saved!');
  };

  // 16. Database utilities

  const purgeStudents = () => {
    if (window.confirm('Clear all student records? This cannot be undone.')) {
      setStudents([]);
    }
  };

  const clearNotices = () => {
    if (window.confirm('Delete all announcements?')) {
      setNotices([]);
    }
  };

  const factoryReset = () => {
    if (window.confirm('Reset student portal to factory settings? All configurations, notices, and students will be cleared.')) {
      setStudents([]);
      setNotices([]);
      setPortalConfig({
        schoolName: 'Artificial Intelligence & Data Science Department',
        currentTerm: 'Fall Semester 2026'
      });
      setConfigSchoolName('Artificial Intelligence & Data Science Department');
      setConfigTerm('Fall Semester 2026');
      setCurrentView('roster');
    }
  };

  // Toggle single attendance
  const toggleAttendance = (id) => {
    setStudents(students.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: s.status === 'Present' ? 'Absent' : 'Present'
        };
      }
      return s;
    }));
  };

  // Delete a student from the database
  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  // Bulk operation triggers
  const markAllStatus = (newStatus) => {
    setStudents(students.map(s => ({
      ...s,
      status: newStatus
    })));
  };

  // Helper to assign a color class to a Semester
  const getSemesterBadgeClass = (semester) => {
    switch (semester) {
      case 'Semester 1':
      case 'Semester 2':
        return 'sem-badge sem-freshman';
      case 'Semester 3':
      case 'Semester 4':
        return 'sem-badge sem-sophomore';
      case 'Semester 5':
      case 'Semester 6':
        return 'sem-badge sem-junior';
      default:
        return 'sem-badge sem-senior';
    }
  };

  // Helper to color-code and format timetable subject slots
  const renderTimetableCell = (subject) => {
    if (subject.includes('Lunch')) {
      return <span className="subject-tag lunch-tag">{subject}</span>;
    }
    if (subject.includes('Lab') || subject.includes('Laboratory')) {
      return <span className="subject-tag lab-tag">{subject}</span>;
    }
    if (subject.includes('Structures') || subject.includes('Comp.') || subject.includes('Algorithms') || subject.includes('Algebra')) {
      return <span className="subject-tag core-tag">{subject}</span>;
    }
    if (subject.includes('Networks') || subject.includes('DBMS') || subject.includes('Operating Systems')) {
      return <span className="subject-tag systems-tag">{subject}</span>;
    }
    return <span className="subject-tag applied-tag">{subject}</span>;
  };

  // Helper avatar initials
  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Compound filtering
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.gradeClass.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAttendance = statusFilter === 'All' ? true : student.status === statusFilter;
    const matchesClass = classFilter === 'All' ? true : student.gradeClass === classFilter;

    return matchesSearch && matchesAttendance && matchesClass;
  });

  return (
    <div className="app-container">
      {/* Navigation Header Bar using dynamic portalConfig branding */}
      <header className="app-navbar">
        <div className="nav-branding">
          <h1>{portalConfig.schoolName}</h1>
          <p className="subtitle">{portalConfig.currentTerm}</p>
        </div>

        {/* Dynamic Nav tabs */}
        <nav className="nav-tabs">
          <button 
            onClick={() => setCurrentView('roster')} 
            className={`nav-link ${currentView === 'roster' ? 'active' : ''}`}
          >
            Student List
          </button>
          <button 
            onClick={() => setCurrentView('dashboard')} 
            className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('schedule')} 
            className={`nav-link ${currentView === 'schedule' ? 'active' : ''}`}
          >
            Schedule
          </button>
          <button 
            onClick={() => setCurrentView('notices')} 
            className={`nav-link ${currentView === 'notices' ? 'active' : ''}`}
          >
            Notices ({notices.length})
          </button>
          <button 
            onClick={() => setCurrentView('add')} 
            className={`nav-link ${currentView === 'add' ? 'active' : ''}`}
          >
            Enroll Student
          </button>
          <button 
            onClick={() => setCurrentView('settings')} 
            className={`nav-link ${currentView === 'settings' ? 'active' : ''}`}
          >
            Settings
          </button>
        </nav>
      </header>

      {/* Main Workspace with Conditional Rendering of Screens */}
      <main className="workspace">

        {/* SCREEN 1: DASHBOARD VIEW */}
        {currentView === 'dashboard' && (
          <section className="dashboard-view animate-fade">
            <div className="section-header">
              <h2>Classroom Insights</h2>
              <p className="section-subtitle">View attendance averages, passing indicators, and grade distributions.</p>
            </div>
            
            {/* Primary Stats Grid */}
            <div className="dashboard-grid">
              <div className="dash-card">
                <span className="card-label">Total Enrollment</span>
                <span className="card-value">{totalStudents}</span>
                <span className="card-hint">Active students</span>
              </div>
              <div className="dash-card success-accent">
                <span className="card-label">Attendance Rate</span>
                <span className="card-value">{attendanceRate}%</span>
                <div className="dash-progress-track">
                  <div className="dash-progress-bar bg-success" style={{ width: `${attendanceRate}%` }}></div>
                </div>
              </div>
              <div className="dash-card primary-accent">
                <span className="card-label">Class Score Average</span>
                <span className="card-value">{averageScore}%</span>
                <span className="card-hint">Overall exam marks</span>
              </div>
              <div className="dash-card warning-accent">
                <span className="card-label">Passing Rate</span>
                <span className="card-value">{passingRate}%</span>
                <div className="dash-progress-track">
                  <div className="dash-progress-bar bg-primary" style={{ width: `${passingRate}%` }}></div>
                </div>
              </div>
            </div>

            {/* Visual Grade Distribution summary card */}
            <div className="distribution-card">
              <h2>Grade Distributions</h2>
              {totalStudents === 0 ? (
                <div className="dash-empty">
                  <p>No student data available to count grades. Enroll students to see analytics.</p>
                </div>
              ) : (
                <div className="grades-distribution-list">
                  <div className="grade-metric">
                    <span className="grade-label-tag tag-a">A</span>
                    <span className="grade-count-val">{getGradeCount('A')} students</span>
                    <span className="grade-desc">(90% - 100%)</span>
                  </div>
                  <div className="grade-metric">
                    <span className="grade-label-tag tag-b">B</span>
                    <span className="grade-count-val">{getGradeCount('B')} students</span>
                    <span className="grade-desc">(80% - 89%)</span>
                  </div>
                  <div className="grade-metric">
                    <span className="grade-label-tag tag-c">C</span>
                    <span className="grade-count-val">{getGradeCount('C')} students</span>
                    <span className="grade-desc">(70% - 79%)</span>
                  </div>
                  <div className="grade-metric">
                    <span className="grade-label-tag tag-d">D</span>
                    <span className="grade-count-val">{getGradeCount('D')} students</span>
                    <span className="grade-desc">(50% - 69%)</span>
                  </div>
                  <div className="grade-metric">
                    <span className="grade-label-tag tag-f">F</span>
                    <span className="grade-count-val">{getGradeCount('F')} students</span>
                    <span className="grade-desc">(Below 50%)</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SCREEN 2: STUDENT LIST VIEW */}
        {currentView === 'roster' && (
          <section className="roster-view animate-fade">
            <div className="section-header">
              <h2>Student Directory</h2>
              <p className="section-subtitle">Manage daily attendance, view overall scores, and write student notes.</p>
            </div>
            
            <div className="table-card">
              <div className="table-controls">
                {/* Filter buttons styled like tabs */}
                <div className="filter-tabs">
                  <button
                    onClick={() => setStatusFilter('All')}
                    className={`tab-btn ${statusFilter === 'All' ? 'active' : ''}`}
                  >
                    All <span className="badge">{totalStudents}</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter('Present')}
                    className={`tab-btn ${statusFilter === 'Present' ? 'active' : ''}`}
                  >
                    Present <span className="badge">{students.filter(s => s.status === 'Present').length}</span>
                  </button>
                  <button
                    onClick={() => setStatusFilter('Absent')}
                    className={`tab-btn ${statusFilter === 'Absent' ? 'active' : ''}`}
                  >
                    Absent <span className="badge">{students.filter(s => s.status === 'Absent').length}</span>
                  </button>
                </div>

                {/* Quick grade selector filter + search */}
                <div className="search-and-dropdown">
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="dropdown-class-filter"
                  >
                    <option value="All">All Semesters</option>
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Bulk operations row */}
              {totalStudents > 0 && (
                <div className="bulk-operations">
                  <span className="bulk-label">Bulk Attendance:</span>
                  <button onClick={() => markAllStatus('Present')} className="btn-bulk-action btn-bulk-present">
                    Mark All Present
                  </button>
                  <button onClick={() => markAllStatus('Absent')} className="btn-bulk-action btn-bulk-absent">
                    Mark All Absent
                  </button>
                </div>
              )}

              {/* Student list table display */}
              {filteredStudents.length === 0 ? (
                <div className="empty-state">
                  <p>No matching student records found.</p>
                  {students.length === 0 && (
                    <div className="empty-helper-actions">
                      <button onClick={() => setCurrentView('add')} className="btn-add-shortcut">
                        Enroll a Student
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="student-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student (Click to view profile)</th>
                        <th>Semester</th>
                        <th>Grade / Score</th>
                        <th>Attendance</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((stud) => {
                        const perf = getPerformanceGrade(stud.score);
                        return (
                          <tr key={stud.id}>
                            <td className="student-id">#{stud.id}</td>
                            <td>
                              <div className="student-profile student-clickable" onClick={() => setSelectedStudent(stud)}>
                                <div className="avatar">{getInitials(stud.name)}</div>
                                <span className="student-name">{stud.name}</span>
                              </div>
                            </td>
                            <td className="student-class-cell">
                              <span className={getSemesterBadgeClass(stud.gradeClass)}>{stud.gradeClass}</span>
                            </td>
                            <td>
                              <div className="score-cell">
                                <span className={`perf-badge ${perf.class}`}>{perf.letter}</span>
                                <span className="score-num">{stud.score}%</span>
                              </div>
                            </td>
                            <td>
                              <span className={`status-dot-badge ${stud.status.toLowerCase()}`}>
                                {stud.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  onClick={() => toggleAttendance(stud.id)}
                                  className={`btn-action-toggle ${stud.status === 'Present' ? 'action-absent' : 'action-present'}`}
                                >
                                  Mark {stud.status === 'Present' ? 'Absent' : 'Present'}
                                </button>
                                <button
                                  onClick={() => deleteStudent(stud.id)}
                                  className="btn-action-delete"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SCREEN 3: TIMETABLE SCHEDULE VIEW */}
        {currentView === 'schedule' && (
          <section className="schedule-view animate-fade">
            <div className="section-header">
              <h2>Weekly Class Schedule</h2>
              <p className="section-subtitle">Track classroom periods and slot times for subjects Monday through Friday.</p>
            </div>

            <div className="schedule-card">
              <div className="table-responsive">
                <table className="timetable-grid">
                  <thead>
                    <tr>
                      <th>Time Slot</th>
                      {TIMETABLE.days.map(d => (
                        <th key={d}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TIMETABLE.slots.map((slot, index) => (
                      <tr key={index} className={slot.mon.includes('Lunch') ? 'lunch-row' : ''}>
                        <td className="time-slot-column"><strong>{slot.time}</strong></td>
                        <td>{renderTimetableCell(slot.mon)}</td>
                        <td>{renderTimetableCell(slot.tue)}</td>
                        <td>{renderTimetableCell(slot.wed)}</td>
                        <td>{renderTimetableCell(slot.thu)}</td>
                        <td>{renderTimetableCell(slot.fri)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* SCREEN 4: NOTICE BOARD VIEW */}
        {currentView === 'notices' && (
          <section className="notices-view animate-fade">
            <div className="section-header">
              <h2>School Notice Board</h2>
              <p className="section-subtitle">Read administrative notices or post new announcements for the classroom.</p>
            </div>

            <div className="notices-workspace">
              {/* Left Side: Create Notice form */}
              <div className="create-notice-card">
                <h3>Post Announcement</h3>
                <form onSubmit={handleAddNotice} className="notice-form">
                  <div className="form-group-vertical">
                    <label htmlFor="notice-title">Announcement Title</label>
                    <input
                      id="notice-title"
                      type="text"
                      placeholder="e.g. Science Fair Postponed"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group-vertical">
                    <label htmlFor="notice-body">Message Body</label>
                    <textarea
                      id="notice-body"
                      placeholder="Write announcement details here..."
                      value={noticeContent}
                      onChange={(e) => setNoticeContent(e.target.value)}
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-submit">Publish Notice</button>
                </form>
              </div>

              {/* Right Side: Notice cards list */}
              <div className="notices-list-card">
                <h3>Notice Feed ({notices.length})</h3>
                {notices.length === 0 ? (
                  <div className="dash-empty">
                    <p>No active announcements posted. Use the form on the left to write one.</p>
                  </div>
                ) : (
                  <div className="notices-feed-container">
                    {notices.map(notice => (
                      <div key={notice.id} className="notice-bullet-card">
                        <header className="notice-bullet-header">
                          <h4>{notice.title}</h4>
                          <span className="notice-bullet-date">{notice.date}</span>
                        </header>
                        <p className="notice-bullet-text">{notice.content}</p>
                        <button 
                          onClick={() => deleteNotice(notice.id)} 
                          className="btn-delete-notice"
                          title="Remove announcement"
                        >
                          Archive Announcement
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* SCREEN 5: ENROLL STUDENT FORM */}
        {currentView === 'add' && (
          <section className="enroll-view animate-fade">
            <div className="enroll-container">
              <div className="section-header text-center">
                <h2>Student Enrollment</h2>
                <p className="section-subtitle">Register a new student roll, academic semester, and starting exam score.</p>
              </div>
              <div className="enroll-card">
                <form onSubmit={handleAddStudent} className="enroll-form">
                  <div className="form-group-vertical">
                    <label htmlFor="stud-id">Roll Number / Student ID</label>
                    <input
                      id="stud-id"
                      type="text"
                      placeholder="e.g. 106"
                      value={studId}
                      onChange={(e) => setStudId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group-vertical">
                    <label htmlFor="stud-name">Student Full Name</label>
                    <input
                      id="stud-name"
                      type="text"
                      placeholder="e.g. Harry Potter"
                      value={studName}
                      onChange={(e) => setStudName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row-double">
                    <div className="form-group-vertical">
                      <label htmlFor="stud-class">Assigned Semester</label>
                      <select
                        id="stud-class"
                        value={studClass}
                        onChange={(e) => setStudClass(e.target.value)}
                        className="select-class-full"
                      >
                        {CLASSES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group-vertical">
                      <label htmlFor="stud-score">Current Exam Score (0-100)</label>
                      <input
                        id="stud-score"
                        type="number"
                        placeholder="e.g. 92"
                        min="0"
                        max="100"
                        value={studScore}
                        onChange={(e) => setStudScore(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-action-row">
                    <button type="button" onClick={() => setCurrentView('roster')} className="btn-cancel">
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      Enroll Student
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* SCREEN 6: SETTINGS VIEW */}
        {currentView === 'settings' && (
          <section className="settings-view animate-fade">
            <div className="section-header">
              <h2>Portal Settings</h2>
              <p className="section-subtitle">Customize application branding headers or run quick classroom database managers.</p>
            </div>

            <div className="settings-grid">
              {/* Branding configs */}
              <div className="settings-card">
                <h3>Branding Configuration</h3>
                <form onSubmit={handleSaveConfig} className="settings-form">
                  <div className="form-group-vertical">
                    <label htmlFor="settings-school">Portal Name</label>
                    <input
                      id="settings-school"
                      type="text"
                      value={configSchoolName}
                      onChange={(e) => setConfigSchoolName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group-vertical">
                    <label htmlFor="settings-term">Academic Term Description</label>
                    <input
                      id="settings-term"
                      type="text"
                      value={configTerm}
                      onChange={(e) => setConfigTerm(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-submit">Save Settings</button>
                </form>
              </div>

              {/* Data Utilities Panel */}
              <div className="settings-card warning-panel">
                <h3>Database Utilities</h3>
                <p className="panel-warning-text">Manage school data records in localStorage. Be careful with resets.</p>
                
                <div className="settings-utility-buttons">
                  <button onClick={purgeStudents} className="btn-utility btn-utility-danger">
                    Clear Student List
                  </button>
                  <button onClick={clearNotices} className="btn-utility btn-utility-danger">
                    Delete Notices Feed
                  </button>
                  <button onClick={factoryReset} className="btn-utility btn-utility-danger">
                    Reset Portal to Defaults
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* POPUP MODAL OVERLAY: Displays full details of the selected student */}
      {selectedStudent && (
        <div className="modal-overlay animate-fade" onClick={() => setSelectedStudent(null)}>
          {/* Modal Container */}
          <div className="modal-card animate-scale" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Student Profile Details</h3>
              <button className="modal-close-btn" onClick={() => setSelectedStudent(null)}>&times;</button>
            </header>

            <div className="modal-body">
              {/* Profile Card Header Info */}
              <div className="modal-profile-summary">
                <div className="modal-avatar">{getInitials(selectedStudent.name)}</div>
                <div className="modal-name-group">
                  <h4>{selectedStudent.name}</h4>
                  <span className="modal-subtext">Roll No: #{selectedStudent.id} • {selectedStudent.gradeClass}</span>
                </div>
              </div>

              {/* Status details grid */}
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="info-label">Attendance Status</span>
                  <span className={`status-dot-badge ${selectedStudent.status.toLowerCase()}`}>
                    {selectedStudent.status}
                  </span>
                </div>
                <div className="modal-info-item">
                  <span className="info-label">Current Score</span>
                  <span className="score-num">{selectedStudent.score}%</span>
                </div>
                <div className="modal-info-item">
                  <span className="info-label">Academic Rating</span>
                  <span className={`perf-badge ${getPerformanceGrade(selectedStudent.score).class}`}>
                    {getPerformanceGrade(selectedStudent.score).letter}
                  </span>
                </div>
              </div>

              {/* Remarks Section */}
              <div className="modal-remarks-section">
                <label htmlFor="modal-remarks-textarea" className="info-label">Teacher's Remarks & Notes</label>
                <textarea
                  id="modal-remarks-textarea"
                  placeholder="Type student remarks or performance reviews here..."
                  value={tempRemarks}
                  onChange={(e) => setTempRemarks(e.target.value)}
                  rows="4"
                ></textarea>
                <button onClick={saveRemarks} className="btn-save-remarks">
                  Save Remarks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

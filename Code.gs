// --- 시트 이름 설정 ---
const SHEET_STUDENTS = '학생명부';
const SHEET_LESSONS = '수업설계';
const SHEET_OBSERVATIONS = '관찰기록';
// --------------------

/**
 * 사용자가 웹 앱 URL에 접속했을 때 가장 먼저 실행되는 함수입니다.
 * index.html 파일을 웹페이지로 만들어 사용자에게 보여줍니다.
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle("학습 과정 기록 시스템")
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

/**
 * 시트에서 데이터를 가져와 자바스크립트 객체 배열로 변환하는 헬퍼 함수입니다.
 * @param {string} sheetName - 데이터를 가져올 시트의 이름
 * @returns {Array<Object>}
 */
function getSheetDataAsObjectArray(sheetName) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`'${sheetName}' 시트를 찾을 수 없습니다.`);
    }
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    if (values.length < 2) return []; // 헤더만 있거나 데이터가 없는 경우
    const headers = values.shift(); // 첫 행(헤더)을 분리
    return values.map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || ''; // 빈 셀은 빈 문자열로 처리
      });
      return obj;
    });
}

// --- 클라이언트(웹페이지)에서 google.script.run으로 호출할 함수들 ---

function getStudents() {
  try {
    return { status: 'success', data: getSheetDataAsObjectArray(SHEET_STUDENTS) };
  } catch (e) {
    return { status: 'error', message: e.message };
  }
}

function getLessons() {
  try {
    return { status: 'success', data: getSheetDataAsObjectArray(SHEET_LESSONS) };
  } catch (e) {
    return { status: 'error', message: e.message };
  }
}

function addStudent(student) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_STUDENTS);
    sheet.appendRow([student.학년, student.반, student.번호, student.이름]);
    return { status: 'success', message: "학생이 추가되었습니다." };
  } catch (e) {
    return { status: 'error', message: e.message };
  }
}

function addStudents(students) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_STUDENTS);
    const values = students.map(s => [s.학년, s.반, s.번호, s.이름]);
    sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
    return { status: 'success', message: `${students.length}명의 학생이 추가되었습니다.` };
  } catch (e) {
    return { status: 'error', message: e.message };
  }
}

function addLesson(lesson) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_LESSONS);
    sheet.appendRow([lesson.과목, lesson.성취기준, lesson.수업주제, lesson.핵심아이디어]);
    return { status: 'success', message: "수업 정보가 추가되었습니다." };
  } catch (e) {
    return { status: 'error', message: e.message };
  }
}

function addObservation(observation) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_OBSERVATIONS);
    sheet.appendRow([observation.학년, observation.반, observation.번호, observation.이름, observation.날짜, observation.과목, observation.수업주제, observation.관찰기록]);
    return { status: 'success', message: "관찰 기록이 저장되었습니다." };
  } catch (e) {
    return { status: 'error', message: e.message };
  }
}

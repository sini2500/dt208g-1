// hitta DOM-element, dubbelkolla att de är rätt typ
const form = document.getElementById("course-form") as HTMLFormElement;
const list = document.getElementById("course-list") as HTMLElement;

// Lista över tillåtna värden för kursprogression, typ sträng.
const progressions: string[] = ['A', 'B', 'C'];

// Ett interface för kurser
interface CourseInfo {
  code: string;
  name: string;
  progression: string;
  syllabus: string;
}

// hämta eventuella kurser från localstorage när sidan laddar, tom array om inga finns
let courses: CourseInfo[] = loadCourses();

// hämta kurser från localstorage
function loadCourses(): CourseInfo[] {
  const data = localStorage.getItem("courses");
  return data ? JSON.parse(data) : [];
}

// spara den aktuella arrayen med kurser i localstorage
function saveCourses(): void {
  localStorage.setItem("courses", JSON.stringify(courses));
}

// se om en kurskod redan används
function checkUnique(code: string): boolean {
  return !courses.some(c => c.code === code);
}

// se om givet värde finns i tillåtna progression
function checkProgression(value: string): boolean {
  return progressions.includes(value);
}

// spara kurs och rendera om vyn
function addCourse(course: CourseInfo): void {
  courses.push(course);
  saveCourses();
  render();
}

// ta bort kurs med angiven kurskod och rendera om vyn
function deleteCourse(code: string): void {
  courses = courses.filter(c => c.code !== code);
  saveCourses();
  render();
}

// Rendera alla kurser
function render(): void {
  list.innerHTML = "";

  courses.forEach(course => {
    const div = document.createElement("div");

    // mall för kurs-kort
    div.innerHTML = `
      <h3>${course.name} (${course.code})</h3>
      <p>Progression: ${course.progression}</p>
      <a href="${course.syllabus}" target="_blank">Kursplan</a>
      <br/>
      <button data-code="${course.code}">Radera</button>
    `;

    div.querySelector("button")?.addEventListener("click", () => {
      deleteCourse(course.code);
    });

    list.appendChild(div);
  });
}

// Formuläret
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // ta input-värden, behandlar elementen som inputElement, inte vanliga HTMLElement (type asert)
  const codeInput = (document.getElementById("code") as HTMLInputElement).value;
  const nameInput = (document.getElementById("name") as HTMLInputElement).value;
  const progInput = (document.getElementById("progression") as HTMLSelectElement).value;
  const syllabusInput = (document.getElementById("syllabus") as HTMLInputElement).value;

  // kolla att värden är okej
  if (!checkUnique(codeInput)) {
    alert("Kurskoden måste vara unik");
    return;
  }

  // skydd mot att användaren ändrar "value" i select-elementet
  if (!checkProgression(progInput)) {
    alert("Progression måste vara A, B eller C");
    return;
  }

  // skapa ny kurs
  const newCourse: CourseInfo = {
    code: codeInput,
    name: nameInput,
    progression: progInput,
    syllabus: syllabusInput,
  };

  addCourse(newCourse);

  // töm formulär
  form.reset();
});

// Rendera vid sidladdning
render();

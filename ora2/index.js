// Handle responsive
const sidebarTriggerBtn = document.querySelector(".sidebar-button");
const topMenuTriggerBtn = document.querySelector(".top-menu-button");

sidebarTriggerBtn.addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("sidebar--open");
});

topMenuTriggerBtn.addEventListener("click", function () {
  const topMenuPane = document.getElementById("top-menu-pane-pc");
  topMenuPane.classList.toggle("top-menu-pane--open");
});

// Handle change info

// Labels
const avatarInputLabel = document.querySelector('#avatar-input-label');

// Headers
const infoHeader = document.querySelector("#page-header");

// Sections
const formSection = document.querySelector("#info-edit-section");
// const infoSection = document.querySelector("#info-section");
const editActionsSection = document.querySelector("#edit-actions-section");

// Img tag that display avatar
const avatarTag = document.querySelector("#avatar");

// List of buttons
const resetBtn = document.querySelector("#reset-btn");
const confirmBtn = document.querySelector("#confirm-btn");
const cancelBtn = document.querySelector("#cancel-btn");
const editBtn = document.querySelector("#edit-btn");

// List of inputs
const uploadAvaInp = document.querySelector("#file-input");
const studentNumberInp = document.querySelector("#student-number");
const studentNameInp = document.querySelector("#student-name");
const startYearInp = document.querySelector("#able-to-school-date");
const eduLevelInp = document.querySelector("#learn-level");
const emailInp = document.querySelector("#email");

// List of select boxes
const eduProgramInp = document.querySelector("#program");
const facultyInp = document.querySelector("#manage");
const learningStatusInp = document.querySelector("#learning-status");
const sexInp = document.querySelector("#sex");
const classInp = document.querySelector("#class");
const courseInp = document.querySelector("#course");

const inputArr = [
  // uploadAvaInp,
  studentNumberInp,
  studentNameInp,
  startYearInp,
  eduLevelInp,
  emailInp,
];

const selectArr = [
  eduProgramInp,
  facultyInp,
  learningStatusInp,
  sexInp,
  classInp,
  courseInp,
];

const allFields = [
	...inputArr,
	...selectArr,
]

const defaultValue = {
  avatar: "assets/me.png",
  name: "Nguyễn Tùng Lâm",
  startYear: "2020",
  eduLevel: "KSCLC-TN-TT-VN-ICT",
  eduProgram: "Công nghệ thông tin Việt-Nhật 2020",
  faculty: "Trường công nghệ thông tin và truyền thông",
  learningStatus: "Học",
  sex: "Nam",
  class: "Việt Nhật 03-K65",
  course: "65",
  email: "lam.nt204998@sis.hust.edu.vn",
  studentNumber: "20204998",
};

const info = { ...defaultValue };

let edit = false;
let prevAvatar = defaultValue.avatar;

const toggleEdit = () => {
  edit = !edit;
  if (edit) infoHeader.innerHTML = "chỉnh sửa thông tin cá nhân";
  else infoHeader.innerHTML = "thông tin cá nhân";
  // infoSection.classList.toggle("hidden");
  // formSection.classList.toggle("hidden");
  editActionsSection.classList.toggle("hidden");

  allFields.forEach((field) => {
    field.disabled = !field.disabled;
  });

  prevAvatar = info.avatar;

  avatarInputLabel.classList.toggle("hidden");
};

// Handle click edit button
if (editBtn) {
  editBtn.addEventListener("click", () => {
    toggleEdit();
  });
}

// Handle change avatar
if (uploadAvaInp) {
  uploadAvaInp.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      info.avatar = reader.result;
      avatarTag.src = info.avatar;
    };
  });
}

// Handle confirm button
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    // Update the info object to the value of the inputs
    app.updateInfo();

    // Assign the new value to inputs
    app.getInfo();

    toggleEdit();

    console.log(info);
  });
}

// Handle cancel button
if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    app.getInfo();

    info.avatar = prevAvatar;
    avatarTag.src = info.avatar;

    toggleEdit();    

    console.log(info);
  });
}

// Handle reset button
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    app.resetInfo();

    info.avatar = defaultValue.avatar;
    avatarTag.src = info.avatar;

    toggleEdit();

    console.log(info);
  });
}

const app = {
  resetInfo: function () {
    inputArr.forEach((input) => {
      if (input) {
        input.value = defaultValue[input.name];
      }
    });
    selectArr.forEach((select) => {
      if (select) {
        const option = select.options[select.selectedIndex];
        option.value = defaultValue[select.name];
        option.text = defaultValue[select.name];
      }
    });
  },

  getInfo: function () {
    inputArr.forEach((input) => {
      if (input) {
        input.value = info[input.name];
      }
    });

    selectArr.forEach((select) => {
      if (select) {
        const option = select.options[select.selectedIndex];
        if (option) {
          option.value = info[select.name];
          option.text = info[select.name];
        }
      }
    });
  },

  updateInfo: function () {
    inputArr.forEach((input) => {
      if (input) {
        info[input.name] = input.value;
      }
    });

    selectArr.forEach((select) => {
      const option = select.options[select.selectedIndex];
      if (option) {
        info[select.name] = option.text;
      }
    });
  },

  initState: () => {
    allFields.forEach((field) => {
      field.disabled = true;
    })
    avatarInputLabel.classList.toggle("hidden");
  },

  start: function () {
    this.getInfo();
    this.initState();
  },
};

app.start();

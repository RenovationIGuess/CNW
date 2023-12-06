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
const avatarInputLabel = document.querySelector("#avatar-input-label");

// Headers
const infoHeader = document.querySelector("#page-header");

// Sections
const formSection = document.querySelector("#info-edit-section");
// const infoSection = document.querySelector("#info-section");
const editActionsSection = document.querySelector("#edit-actions-section");

// Img tag that display avatar
const avatarTag = document.querySelector("#avatar");

// Containers
const container = document.querySelector(".info-detail");

// List of buttons
const resetBtn = document.querySelector("#reset-btn");
const confirmBtn = document.querySelector("#confirm-btn");
const cancelBtn = document.querySelector("#cancel-btn");
const editBtn = document.querySelector("#edit-btn");
const buttons = document.querySelectorAll("button");
const addInfoBtns = document.querySelectorAll(".add-info-btn");
const addGroupBtns = document.querySelectorAll(".add-group-btn");
const exportPDFBtn = document.querySelector(".pdf-img");

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

const allFields = [...inputArr, ...selectArr];

const myMSSV = 20204998;

// Set prevent default for all buttons
buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
  });
});

// Handle click add info button
addInfoBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    addInfo(btn);
  });
});

addGroupBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    addGroup(btn);
  });
});

function deleteGroup(deleteBtn) {
  deleteBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const parent = deleteBtn.parentElement;
    const nextDiv = parent.nextElementSibling;
    const groupLabelInput = parent.querySelector(".group-label-input");
    const promptMess = prompt(
      "Bạn có chắc muốn xóa trường " + groupLabelInput.value,
      "Nguyễn Tùng Lâm 20204998",
    );
    if (promptMess != null) {
      parent.remove();
      nextDiv.remove();
    }
  });
}

function hiddenInput(labelGrps) {
  const input = labelGrps.querySelector(".group-label-input");
  input.disabled = true;
  input.style.pointerEvents = "none";

  input.parentElement.addEventListener("dblclick", function () {
    console.log("help");
    if (input.disabled) {
      input.disabled = false;
      input.style.pointerEvents = "auto";
    }
  });
  input.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      event.preventDefault();
      input.value += "_20204998";
      input.disabled = true;
      input.style.pointerEvents = "none";
    }
  });
}

function hiddenFieldInput(labelInput, valueInput) {
  labelInput.disabled = true;
  labelInput.style.pointerEvents = "none";
  valueInput.disabled = true;
  valueInput.style.pointerEvents = "none";

  labelInput.parentElement.addEventListener("dblclick", function () {
    if (labelInput.disabled) {
      labelInput.disabled = false;
      labelInput.style.pointerEvents = "auto";
    }
  });

  valueInput.parentElement.addEventListener("dblclick", function () {
    if (valueInput.disabled) {
      valueInput.disabled = false;
      valueInput.style.pointerEvents = "auto";
    }
  });

  labelInput.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      event.preventDefault();
      labelInput.disabled = true;
      labelInput.style.pointerEvents = "none";
    }
  });

  valueInput.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      event.preventDefault();
      valueInput.disabled = true;
      valueInput.style.pointerEvents = "none";
    }
  });
}

function addEventforBtn(newGroup) {
  const newAddInfoBtn = newGroup.querySelector(".add-info-btn");
  newAddInfoBtn.addEventListener("click", function (event) {
    event.preventDefault();
    addInfo(newAddInfoBtn);
  });
  const newAddGroupBtn = newGroup.querySelector(".add-group-btn");
  newAddGroupBtn.addEventListener("click", function (event) {
    event.preventDefault();
    addGroup();
  });
}

const addInfo = (addInfoBtn) => {
  const newField = document.createElement("div");
  newField.className = "flex items-center mb-4 gap-4";
  newField.innerHTML =
    '<label class="p-4"><input type="text" value="Info_Item_20204998" class="info-input font-bold info-font info-label"></label><label class="p-4"><input class="info-input info-font info-value" type="text" value="Nguyễn Tùng Lâm" /></label><img class="pdf-img delete-info-btn " src="./assets/rebin.png">';

  const parent = addInfoBtn.parentElement;
  // const divParent = parent.closest("div").querySelector(".info-detail__row");
  const nextDiv = parent.nextElementSibling;
  nextDiv.appendChild(newField);

  const infoLabel = newField.querySelector(".info-label");
  const infoValue = newField.querySelector(".info-value");
  const deleteBtn = newField.querySelector(".delete-info-btn");
  hiddenFieldInput(infoLabel, infoValue);
  deleteBtn.addEventListener("click", function () {
    newField.remove();
  });
};

function addGroup() {
  const newGroup = document.createElement("div");
  newGroup.className = "info-detail__row";
  newGroup.innerHTML =
    '<span class="font-segoe row-title group-label p-4"><input type="text" value="Group_Item_20204998" class="group-label-input info-input font-bold font-segoe row-title"></span><button type="submit" class="confirm-button add-info-btn"><span>Add Info Item</span></button><button type="submit" class="confirm-button add-group-btn"><span>Add Group Item</span></button><img class="pdf-img delete-group-btn" src="./assets/rebin.png" /><hr align="left" />';
  const newGroupContainer = document.createElement("div");
  newGroupContainer.className = "info-detail__row flex-colv w-full pl-10";

  container.appendChild(newGroup);
  container.appendChild(newGroupContainer);

  let br1 = document.createElement("br");
  let br2 = document.createElement("br");
  container.appendChild(br1);
  container.appendChild(br2);

  deleteGroup(newGroup.querySelector(".delete-group-btn"));
  hiddenInput(newGroup.querySelector(".group-label"));
  addEventforBtn(newGroup);
}

$(exportPDFBtn).click(function () {
  html2canvas($(container), {
    onrendered: function (canvas) {
      var data = canvas.toDataURL();
      var docDefinition = {
        content: [
          {
            image: data,
            width: 500,
          },
        ],
      };
      pdfMake.createPdf(docDefinition).download("NguyenTungLam_20204998.pdf");
    },
  });
});
